import { ofetch } from 'ofetch'
import type { Torrent, TorrentDetails, RTorrentSettings, TorrentFile } from '../../utils/types'
import type { TorrentClientAdapter } from '../adapter'

export class RTorrentAdapter implements TorrentClientAdapter {
  private settings: RTorrentSettings

  constructor(settings: RTorrentSettings) {
    this.settings = settings
  }

  private get baseUrl(): string {
    return this.settings.url || 'http://localhost:8080'
  }

  async getTorrents(): Promise<Torrent[]> {
    try {
      const response = await ofetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `<?xml version="1.0"?>
<methodCall>
  <methodName>download_list</methodName>
  <params>
    <param><value><string>all</string></value></param>
  </params>
</methodCall>`,
      })

      return []
    } catch (e) {
      console.error('Failed to fetch rTorrent torrents:', e)
      return []
    }
  }

  async getTorrentDetails(_hash: string): Promise<TorrentDetails | null> {
    return null
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

  async startTorrents(_hashes: string[]): Promise<boolean> {
    console.error('rTorrent: startTorrents not implemented - requires SCGI protocol')
    return false
  }

  async stopTorrents(_hashes: string[]): Promise<boolean> {
    console.error('rTorrent: stopTorrents not implemented - requires SCGI protocol')
    return false
  }

  async deleteTorrents(_hashes: string[], _deleteFiles: boolean): Promise<boolean> {
    console.error('rTorrent: deleteTorrents not implemented - requires SCGI protocol')
    return false
  }

  async testConnection(): Promise<boolean> {
    try {
      await ofetch(this.baseUrl, {
        method: 'POST',
        body: '<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName></methodCall>',
        timeout: 5000,
      })
      return true
    } catch {
      return false
    }
  }
}
