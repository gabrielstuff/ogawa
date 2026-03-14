import type { Torrent, TorrentDetails, RTorrentSettings, TorrentFile } from '../../utils/types'
import type { TorrentClientAdapter } from '../adapter'

interface RTorrentTorrent {
  hash: string
  name: string
  size: number
  downloaded: number
  uploaded: number
  downRate: number
  upRate: number
  seeds: number
  peers: number
  state: number
  isOpen: boolean
  isHashing: boolean
  isUploading: boolean
  isDownloading: boolean
  ratio: number
  addedOn: number
  completedOn: number
  left: number
}

export class RTorrentAdapter implements TorrentClientAdapter {
  private settings: RTorrentSettings

  constructor(settings: RTorrentSettings) {
    this.settings = settings
  }

  private get baseUrl(): string {
    return this.settings.url || 'http://localhost:8080'
  }

  private get scgiUrl(): string {
    const url = this.settings.url || 'localhost:5000'
    if (url.startsWith('scgi://')) {
      return url
    }
    return `scgi://${url}`
  }

  private async scgiRequest(method: string, params: string[] = []): Promise<unknown> {
    const scgiHost = this.scgiUrl.replace('scgi://', '')
    const [host, port] = scgiHost.includes(':') ? scgiHost.split(':') : [scgiHost, '5000']

    const requestBody = this.buildScgiRequest(method, params)

    const response = await fetch(`http://${host}:${port}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'SCGI': '1',
      },
      body: requestBody,
    })

    if (!response.ok) {
      throw new Error(`SCGI request failed: ${response.status}`)
    }

    const text = await response.text()
    return this.parseXmlRpcResponse(text)
  }

  private buildScgiRequest(method: string, params: string[]): string {
    let content = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>`
    for (const param of params) {
      content += `<param><value><string>${this.escapeXml(param)}</string></value></param>`
    }
    content += '</params></methodCall>'

    const contentLength = Buffer.byteLength(content)
    return `CONTENT_LENGTH${contentLength}\u0000${content}`
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;')
  }

  private parseXmlRpcResponse(xml: string): unknown {
    try {
      const getValue = (str: string): unknown => {
        const stringMatch = str.match(/<string>(.*?)<\/string>/)
        if (stringMatch && stringMatch[1]) return stringMatch[1]

        const intMatch = str.match(/<int>(.*?)<\/int>/)
        if (intMatch && intMatch[1]) return parseInt(intMatch[1], 10)

        const doubleMatch = str.match(/<double>(.*?)<\/double>/)
        if (doubleMatch && doubleMatch[1]) return parseFloat(doubleMatch[1])

        const booleanMatch = str.match(/<boolean>(.*?)<\/boolean>/)
        if (booleanMatch && booleanMatch[1]) return booleanMatch[1] === '1'

        const arrayMatch = str.match(/<array><data>(.*?)<\/data><\/array>/)
        if (arrayMatch && arrayMatch[1]) {
          const items = arrayMatch[1].match(/<value>.*?<\/value>/g) || []
          return items.map(item => getValue(item))
        }

        return str
      }

      const paramsMatch = xml.match(/<params>(.*?)<\/params>/s)
      if (paramsMatch && paramsMatch[1]) {
        const values = paramsMatch[1].match(/<value>.*?<\/value>/g) || []
        return values.map(v => getValue(v))
      }

      return null
    }
    catch (e) {
      console.error('Failed to parse XML-RPC response:', e)
      return null
    }
  }

  async getTorrents(): Promise<Torrent[]> {
    try {
      const result = await this.scgiRequest('download_list', ['main'])
      const hashes: string[] = Array.isArray(result) ? result as string[] : []

      if (hashes.length === 0) return []

      const torrents: Torrent[] = []

      for (const hash of hashes) {
        const details = await this.getTorrentByHash(hash)
        if (details) {
          torrents.push(details)
        }
      }

      return torrents
    }
    catch (e) {
      console.error('Failed to fetch rTorrent torrents:', e)
      return []
    }
  }

  private async getTorrentByHash(hash: string): Promise<Torrent | null> {
    try {
      const baseParams = [
        `d.get_hash=${hash}`,
        `d.get_name=${hash}`,
        `d.get_size_bytes=${hash}`,
        `d.get_bytes_done=${hash}`,
        `d.get_up_total=${hash}`,
        `d.get_down_rate=${hash}`,
        `d.get_up_rate=${hash}`,
        `d.get_seeders=${hash}`,
        `d.get_leechers=${hash}`,
        `d.get_state=${hash}`,
        `d.get_open=${hash}`,
        `d.is_hash_checking=${hash}`,
        `d.is_uploading=${hash}`,
        `d.is_downloading=${hash}`,
        `d.get_ratio=${hash}`,
        `d.get_creation_date=${hash}`,
        `d.get_completion_on=${hash}`,
        `d.get_left_bytes=${hash}`,
      ]

      const result = await this.scgiRequest('system.multicall', [baseParams.map(p => `(${p})`).join('')])

      if (!result || !Array.isArray(result) || result.length === 0) {
        return null
      }

      const data = Array.isArray(result[0]) ? (result[0] as (string | number | boolean | null)[]) : []

      if (data.length < 18) return null

      const [rtHash, name, size, downloaded, uploaded, downRate, upRate, seeds, peers, state, isOpen, isHashing, isUploading, isDownloading, ratio, addedOn, completedOn, left] = data as [
        string, string, number, number, number, number, number, number, number, number, boolean, boolean, boolean, boolean, number, number, number, number,
      ]

      return {
        hash: rtHash,
        name: name || 'Unknown',
        size: size || 0,
        completed: (size || 0) - (left || 0),
        downloaded: downloaded || 0,
        uploaded: uploaded || 0,
        downloadSpeed: downRate || 0,
        uploadSpeed: upRate || 0,
        seeds: seeds || 0,
        peers: peers || 0,
        state: this.mapState(state, isOpen, isHashing, isUploading, isDownloading),
        addedAt: addedOn ? addedOn * 1000 : Date.now(),
        doneAt: completedOn ? completedOn * 1000 : null,
        ratio: ratio || 0,
      }
    }
    catch (e) {
      console.error(`Failed to fetch rTorrent torrent ${hash}:`, e)
      return null
    }
  }

  async getTorrentDetails(hash: string): Promise<TorrentDetails | null> {
    const torrent = await this.getTorrentByHash(hash)
    if (!torrent) return null

    try {
      const filesParams = [
        `d.get_hash=${hash}`,
        `f.get_path=${hash}`,
        `f.get_size_bytes=${hash}`,
        `f.get_completed_bytes=${hash}`,
        `f.get_priority=${hash}`,
      ]

      const filesResult = await this.scgiRequest('system.multicall', [filesParams.map(p => `(${p})`).join('')])

      let files: TorrentFile[] = []
      if (filesResult && Array.isArray(filesResult) && Array.isArray(filesResult[0])) {
        const fileData = filesResult[0] as (string | number | null)[][]
        files = fileData.map((fileArr) => {
          const [path, size, completed, priority] = fileArr
          return {
            name: String(path || ''),
            size: Number(size || 0),
            completed: Number(completed || 0),
            priority: this.mapPriority(Number(priority)),
          }
        })
      }

      return {
        ...torrent,
        files,
        trackers: [],
      }
    }
    catch (e) {
      console.error(`Failed to fetch rTorrent torrent details ${hash}:`, e)
      return null
    }
  }

  async addTorrentByFile(_file: Buffer): Promise<boolean> {
    console.error('rTorrent: addTorrentByFile not implemented - requires SCGI protocol')
    return false
  }

  async addTorrentByUrl(_url: string): Promise<boolean> {
    console.error('rTorrent: addTorrentByUrl not implemented - requires SCGI protocol')
    return false
  }

  async addTorrentByMagnet(_magnet: string): Promise<boolean> {
    console.error('rTorrent: addTorrentByMagnet not implemented - requires SCGI protocol')
    return false
  }

  async startTorrents(hashes: string[]): Promise<boolean> {
    try {
      for (const hash of hashes) {
        await this.scgiRequest('d.open', [hash])
        await this.scgiRequest('d.start', [hash])
      }
      return true
    }
    catch (e) {
      console.error('Failed to start rTorrent torrents:', e)
      return false
    }
  }

  async stopTorrents(hashes: string[]): Promise<boolean> {
    try {
      for (const hash of hashes) {
        await this.scgiRequest('d.stop', [hash])
        await this.scgiRequest('d.close', [hash])
      }
      return true
    }
    catch (e) {
      console.error('Failed to stop rTorrent torrents:', e)
      return false
    }
  }

  async deleteTorrents(hashes: string[], _deleteFiles: boolean): Promise<boolean> {
    try {
      for (const hash of hashes) {
        await this.scgiRequest('d.stop', [hash])
        await this.scgiRequest('d.close', [hash])
        await this.scgiRequest('d.erase', [hash])
      }
      return true
    }
    catch (e) {
      console.error('Failed to delete rTorrent torrents:', e)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.scgiRequest('system.listMethods', [])
      return result !== null
    }
    catch {
      return false
    }
  }

  private mapState(state: number, isOpen: boolean, isHashing: boolean, isUploading: boolean, isDownloading: boolean): Torrent['state'] {
    if (!isOpen) return 'stopped'
    if (isHashing) return 'downloading'
    if (isDownloading) return 'downloading'
    if (isUploading) return 'seeding'
    return 'stopped'
  }

  private mapPriority(priority: number): TorrentFile['priority'] {
    if (priority === 0) return 'skip'
    if (priority === 1) return 'low'
    if (priority === 2) return 'normal'
    if (priority === 3) return 'high'
    return 'normal'
  }
}
