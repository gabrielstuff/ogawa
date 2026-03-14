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

  private get auth(): { username: string; password: string } {
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

    try {
      const response = await ofetch<{ result: string; arguments?: T }>(`${this.baseUrl}/transmission/rpc`, {
        method: 'POST',
        headers,
        body: {
          jsonrpc: '2.0',
          method,
          arguments: args,
          id: 1,
        },
      })

      return response.arguments ?? (response.result as T)
    } catch (e: any) {
      if (e.response?.status === 409) {
        const sessionHeader = e.response?.headers?.['x-transmission-session-id'] 
          || e.response?.headers?.get?.('x-transmission-session-id')
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
      const result = await this.request<{ torrents: Array<{
        id: number
        hashString: string
        name: string
        totalSize: number
        downloadedEver: number
        uploadedEver: number
        rateDownload: number
        rateUpload: number
        seedersConnected: number
        peersConnected: number
        status: number
        dateAdded: number
        doneDate: number
        uploadRatio: number
      }> }>('torrent-get', {
        fields: [
          'id', 'hashString', 'name', 'totalSize', 'downloadedEver', 'uploadedEver',
          'rateDownload', 'rateUpload', 'seedersConnected', 'peersConnected',
          'status', 'dateAdded', 'doneDate', 'uploadRatio',
        ],
      })

      return result.torrents.map(t => ({
        hash: t.hashString,
        name: t.name,
        size: t.totalSize,
        completed: t.doneDate > 0 ? t.totalSize : 0,
        downloaded: t.downloadedEver,
        uploaded: t.uploadedEver,
        downloadSpeed: t.rateDownload,
        uploadSpeed: t.rateUpload,
        seeds: t.seedersConnected,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.dateAdded * 1000,
        doneAt: t.doneDate > 0 ? t.doneDate * 1000 : null,
        ratio: t.uploadRatio,
      }))
    } catch (e) {
      console.error('Failed to fetch Transmission torrents:', e)
      return []
    }
  }

  async getTorrentDetails(hash: string): Promise<TorrentDetails | null> {
    try {
      const result = await this.request<{ torrents: Array<{
        id: number
        hashString: string
        name: string
        totalSize: number
        downloadedEver: number
        uploadedEver: number
        rateDownload: number
        rateUpload: number
        seedersConnected: number
        peersConnected: number
        status: number
        dateAdded: number
        doneDate: number
        uploadRatio: number
        files: Array<{ name: string, length: number, bytesCompleted: number, priority: number }>
        trackers: Array<{ announceUrl: string }>
      }> }>('torrent-get', {
        ids: [hash],
        fields: [
          'id', 'hashString', 'name', 'totalSize', 'downloadedEver', 'uploadedEver',
          'rateDownload', 'rateUpload', 'seedersConnected', 'peersConnected',
          'status', 'dateAdded', 'doneDate', 'uploadRatio', 'files', 'trackers',
        ],
      })

      const t = result.torrents[0]
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
        seeds: t.seedersConnected,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.dateAdded * 1000,
        doneAt: t.doneDate > 0 ? t.doneDate * 1000 : null,
        ratio: t.uploadRatio,
        files: (t.files || []).map(f => ({
          name: f.name,
          size: f.length,
          completed: f.bytesCompleted,
          priority: this.mapPriority(f.priority),
        })),
        trackers: (t.trackers || []).map(t => t.announceUrl),
      }
    } catch (e) {
      console.error('Failed to fetch Transmission torrent details:', e)
      return null
    }
  }

  async addTorrentByFile(file: Buffer): Promise<boolean> {
    try {
      const base64 = Buffer.from(file).toString('base64')
      await this.request('torrent-add', {
        metainfo: base64,
      })
      return true
    } catch (e) {
      console.error('Failed to add Transmission torrent:', e)
      return false
    }
  }

  async addTorrentByUrl(url: string): Promise<boolean> {
    try {
      await this.request('torrent-add', {
        filename: url,
      })
      return true
    } catch (e) {
      console.error('Failed to add Transmission torrent from URL:', e)
      return false
    }
  }

  async addTorrentByMagnet(magnet: string): Promise<boolean> {
    return this.addTorrentByUrl(magnet)
  }

  async startTorrents(hashes: string[]): Promise<boolean> {
    try {
      await this.request('torrent-start', {
        ids: hashes,
      })
      return true
    } catch (e) {
      console.error('Failed to start Transmission torrents:', e)
      return false
    }
  }

  async stopTorrents(hashes: string[]): Promise<boolean> {
    try {
      await this.request('torrent-stop', {
        ids: hashes,
      })
      return true
    } catch (e) {
      console.error('Failed to stop Transmission torrents:', e)
      return false
    }
  }

  async deleteTorrents(hashes: string[], deleteFiles: boolean): Promise<boolean> {
    try {
      await this.request('torrent-remove', {
        ids: hashes,
        'delete-local-data': deleteFiles,
      })
      return true
    } catch (e) {
      console.error('Failed to delete Transmission torrents:', e)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('session_get', {})
      return true
    } catch (e) {
      console.error('Transmission connection test failed:', e)
      return false
    }
  }

  private mapStatus(status: number): Torrent['state'] {
    const statusMap: Record<number, Torrent['state']> = {
      0: 'stopped',
      1: 'downloading',
      2: 'downloading',
      3: 'seeding',
      4: 'seeding',
    }
    return statusMap[status] || 'stopped'
  }

  private mapPriority(priority: number): TorrentFile['priority'] {
    if (priority === -1) return 'low'
    if (priority === 1) return 'high'
    return 'normal'
  }
}
