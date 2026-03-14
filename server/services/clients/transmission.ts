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

    const body = {
      jsonrpc: '2.0',
      method,
      params: args,
      id: 1,
    }

    try {
      const response = await ofetch<{ result: T; arguments?: T; error?: { message: string } }>(`${this.baseUrl}/transmission/rpc`, {
        method: 'POST',
        headers,
        body,
      })

      if (response.error) {
        throw new Error(response.error.message || 'Transmission error')
      }

      return response.result
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
        hash_string: string
        name: string
        total_size: number
        downloaded_ever: number
        uploaded_ever: number
        rate_download: number
        rate_upload: number
        seeds_connected: number
        peers_connected: number
        status: number
        date_added: number
        done_date: number
        upload_ratio: number
      }> }>('torrent_get', {
        fields: [
          'id', 'hash_string', 'name', 'total_size', 'downloaded_ever', 'uploaded_ever',
          'rate_download', 'rate_upload', 'seeds_connected', 'peers_connected',
          'status', 'date_added', 'done_date', 'upload_ratio',
        ],
      })

      if (!result?.torrents) {
        return []
      }

      return result.torrents.map(t => ({
        hash: t.hash_string,
        name: t.name,
        size: t.total_size,
        completed: t.done_date > 0 ? t.total_size : 0,
        downloaded: t.downloaded_ever,
        uploaded: t.uploaded_ever,
        downloadSpeed: t.rate_download,
        uploadSpeed: t.rate_upload,
        seeds: t.seeds_connected,
        peers: t.peers_connected,
        state: this.mapStatus(t.status),
        addedAt: t.date_added * 1000,
        doneAt: t.done_date > 0 ? t.done_date * 1000 : null,
        ratio: t.upload_ratio,
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
        hash_string: string
        name: string
        total_size: number
        downloaded_ever: number
        uploaded_ever: number
        rate_download: number
        rate_upload: number
        seeds_connected: number
        peers_connected: number
        status: number
        date_added: number
        done_date: number
        upload_ratio: number
        files: Array<{ name: string, length: number, bytes_completed: number, priority: number }>
        trackers: Array<{ announce: string }>
      }> }>('torrent_get', {
        ids: [hash],
        fields: [
          'id', 'hash_string', 'name', 'total_size', 'downloaded_ever', 'uploaded_ever',
          'rate_download', 'rate_upload', 'seeds_connected', 'peers_connected',
          'status', 'date_added', 'done_date', 'upload_ratio', 'files', 'trackers',
        ],
      })

      const t = result.torrents?.[0]
      if (!t) return null

      return {
        hash: t.hash_string,
        name: t.name,
        size: t.total_size,
        completed: t.done_date > 0 ? t.total_size : 0,
        downloaded: t.downloaded_ever,
        uploaded: t.uploaded_ever,
        downloadSpeed: t.rate_download,
        uploadSpeed: t.rate_upload,
        seeds: t.seeds_connected,
        peers: t.peers_connected,
        state: this.mapStatus(t.status),
        addedAt: t.date_added * 1000,
        doneAt: t.done_date > 0 ? t.done_date * 1000 : null,
        ratio: t.upload_ratio,
        files: (t.files || []).map(f => ({
          name: f.name,
          size: f.length,
          completed: f.bytes_completed,
          priority: this.mapPriority(f.priority),
        })),
        trackers: (t.trackers || []).map(tr => tr.announce),
      }
    } catch (e) {
      console.error('Failed to fetch Transmission torrent details:', e)
      return null
    }
  }

  async addTorrentByFile(file: Buffer): Promise<boolean> {
    try {
      const base64 = Buffer.from(file).toString('base64')
      await this.request('torrent_add', {
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
      await this.request('torrent_add', {
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
      await this.request('torrent_start', {
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
      await this.request('torrent_stop', {
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
      await this.request('torrent_remove', {
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
