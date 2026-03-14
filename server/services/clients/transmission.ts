import { ofetch } from 'ofetch'
import type { Torrent, TorrentDetails, TransmissionSettings, TorrentFile } from '../../utils/types'
import type { TorrentClientAdapter } from '../adapter'

export class TransmissionAdapter implements TorrentClientAdapter {
  private settings: TransmissionSettings
  private sessionId: string | null = null

  constructor(settings: TransmissionSettings) {
    this.settings = settings
  }

  private get baseUrl(): string {
    return this.settings.url || 'http://localhost:9091'
  }

  private get auth(): { username: string, password: string } {
    return {
      username: this.settings.username || 'admin',
      password: this.settings.password || 'admin',
    }
  }

  private async request<T>(method: string, args: Record<string, unknown> = {}): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.sessionId) {
      headers['X-Transmission-Session-Id'] = this.sessionId
    }

    if (this.auth.username && this.auth.password) {
      const credentials = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString('base64')
      headers['Authorization'] = `Basic ${credentials}`
    }

    // Transmission RPC body: { method, arguments } — NOT jsonrpc format
    const body = { method, arguments: args }

    try {
      const response = await ofetch<{ result: string, arguments?: T, error?: { message: string } }>(
        `${this.baseUrl}/transmission/rpc`,
        { method: 'POST', headers, body },
      )

      if (response.result !== 'success') {
        throw new Error(response.result || 'Transmission returned non-success result')
      }

      return response.arguments as T
    }
    catch (e: any) {
      if (e.response?.status === 409) {
        const sessionHeader = e.response?.headers?.get?.('x-transmission-session-id')
          || e.response?.headers?.['x-transmission-session-id']
        if (sessionHeader) {
          this.sessionId = sessionHeader
          return this.request(method, args)
        }
      }
      throw e
    }
  }

  async getTorrents(): Promise<Torrent[]> {
    try {
      // Transmission RPC method names use hyphens
      const result = await this.request<{ torrents: Array<{
        hashString: string
        name: string
        totalSize: number
        downloadedEver: number
        uploadedEver: number
        rateDownload: number
        rateUpload: number
        peersConnected: number
        status: number
        addedDate: number
        doneDate: number
        uploadRatio: number
      }> }>('torrent-get', {
        fields: [
          'hashString', 'name', 'totalSize', 'downloadedEver', 'uploadedEver',
          'rateDownload', 'rateUpload', 'peersConnected',
          'status', 'addedDate', 'doneDate', 'uploadRatio',
        ],
      })

      if (!result?.torrents) return []

      return result.torrents.map(t => ({
        hash: t.hashString,
        name: t.name,
        size: t.totalSize,
        completed: t.doneDate > 0 ? t.totalSize : 0,
        downloaded: t.downloadedEver,
        uploaded: t.uploadedEver,
        downloadSpeed: t.rateDownload,
        uploadSpeed: t.rateUpload,
        seeds: 0,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.addedDate * 1000,
        doneAt: t.doneDate > 0 ? t.doneDate * 1000 : null,
        ratio: t.uploadRatio,
      }))
    }
    catch (e) {
      console.error('Failed to fetch Transmission torrents:', e)
      return []
    }
  }

  async getTorrentDetails(hash: string): Promise<TorrentDetails | null> {
    try {
      const result = await this.request<{ torrents: Array<{
        hashString: string
        name: string
        totalSize: number
        downloadedEver: number
        uploadedEver: number
        rateDownload: number
        rateUpload: number
        peersConnected: number
        status: number
        addedDate: number
        doneDate: number
        uploadRatio: number
        files: Array<{ name: string, length: number, bytesCompleted: number }>
        fileStats: Array<{ priority: number }>
        trackers: Array<{ announce: string }>
      }> }>('torrent-get', {
        ids: [hash],
        fields: [
          'hashString', 'name', 'totalSize', 'downloadedEver', 'uploadedEver',
          'rateDownload', 'rateUpload', 'peersConnected',
          'status', 'addedDate', 'doneDate', 'uploadRatio', 'files', 'fileStats', 'trackers',
        ],
      })

      const t = result?.torrents?.[0]
      if (!t) return null

      return {
        hash: t.hashString,
        name: t.name,
        size: t.totalSize,
        completed: t.doneDate > 0 ? t.totalSize : 0,
        downloaded: t.downloadedEver,
        uploaded: t.uploadedEver,
        downloadSpeed: t.rateDownload,
        uploadSpeed: t.rateUpload,
        seeds: 0,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.addedDate * 1000,
        doneAt: t.doneDate > 0 ? t.doneDate * 1000 : null,
        ratio: t.uploadRatio,
        files: (t.files || []).map((f, i) => ({
          name: f.name,
          size: f.length,
          completed: f.bytesCompleted,
          priority: this.mapPriority(t.fileStats?.[i]?.priority ?? 0),
        })),
        trackers: (t.trackers || []).map(tr => tr.announce),
      }
    }
    catch (e) {
      console.error('Failed to fetch Transmission torrent details:', e)
      return null
    }
  }

  async addTorrentByFile(file: Buffer): Promise<boolean> {
    try {
      await this.request('torrent-add', { metainfo: Buffer.from(file).toString('base64') })
      return true
    }
    catch (e) {
      console.error('Failed to add Transmission torrent:', e)
      return false
    }
  }

  async addTorrentByUrl(url: string): Promise<boolean> {
    try {
      await this.request('torrent-add', { filename: url })
      return true
    }
    catch (e) {
      console.error('Failed to add Transmission torrent from URL:', e)
      return false
    }
  }

  async addTorrentByMagnet(magnet: string): Promise<boolean> {
    return this.addTorrentByUrl(magnet)
  }

  async startTorrents(hashes: string[]): Promise<boolean> {
    try {
      await this.request('torrent-start', { ids: hashes })
      return true
    }
    catch (e) {
      console.error('Failed to start Transmission torrents:', e)
      return false
    }
  }

  async stopTorrents(hashes: string[]): Promise<boolean> {
    try {
      await this.request('torrent-stop', { ids: hashes })
      return true
    }
    catch (e) {
      console.error('Failed to stop Transmission torrents:', e)
      return false
    }
  }

  async deleteTorrents(hashes: string[], deleteFiles: boolean): Promise<boolean> {
    try {
      await this.request('torrent-remove', { ids: hashes, 'delete-local-data': deleteFiles })
      return true
    }
    catch (e) {
      console.error('Failed to delete Transmission torrents:', e)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('session-get', {})
      return true
    }
    catch (e) {
      console.error('Transmission connection test failed:', e)
      return false
    }
  }

  private mapStatus(status: number): Torrent['state'] {
    const statusMap: Record<number, Torrent['state']> = {
      0: 'stopped',
      1: 'downloading', // queued to check
      2: 'downloading', // checking
      3: 'downloading', // queued to download
      4: 'downloading',
      5: 'seeding',     // queued to seed
      6: 'seeding',
    }
    return statusMap[status] || 'stopped'
  }

  private mapPriority(priority: number): TorrentFile['priority'] {
    if (priority === -1) return 'low'
    if (priority === 1) return 'high'
    return 'normal'
  }
}
