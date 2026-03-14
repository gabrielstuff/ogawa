import { ofetch } from 'ofetch'
import type { Torrent, TorrentDetails, TorrentFile, QBittorrentSettings } from '../../utils/types'
import type { TorrentClientAdapter } from '../adapter'

interface QBitTorrent {
  hash: string
  name: string
  size: number
  downloaded: number
  uploaded: number
  dlspeed: number
  upspeed: number
  num_seeds: number
  num_leechs: number
  state: string
  added_on: number
  completion_on: number
  ratio: number
}

interface QBitFile {
  name: string
  size: number
  completed: number
  priority: number
}

export class QBittorrentAdapter implements TorrentClientAdapter {
  private settings: QBittorrentSettings
  private cookies: string | null = null

  constructor(settings: QBittorrentSettings) {
    this.settings = settings
  }

  private get baseUrl(): string {
    return this.settings.url || 'http://localhost:8080'
  }

  private get auth(): { username: string; password: string } {
    return {
      username: this.settings.username || 'admin',
      password: this.settings.password || 'adminadmin',
    }
  }

  private async request<T>(endpoint: string, options: {
    method?: string
    body?: Record<string, string>
  } = {}): Promise<T> {
    const url = `${this.baseUrl}/api/v2${endpoint}`

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }

    if (this.cookies) {
      headers['Cookie'] = this.cookies
    }

    return ofetch<T>(url, {
      method: options.method || 'GET',
      headers,
      body: options.body ? new URLSearchParams(options.body).toString() : undefined,
    })
  }

  private async ensureAuth(): Promise<void> {
    if (this.cookies) return

    try {
      const response: any = await ofetch.raw(`${this.baseUrl}/api/v2/auth/login`, {
        method: 'POST',
        body: new URLSearchParams({
          username: this.auth.username,
          password: this.auth.password,
        }).toString(),
      })

      const setCookieHeader = response.headers?.get?.('set-cookie') || response.headers?.['set-cookie']
      if (setCookieHeader) {
        this.cookies = setCookieHeader.split(';')[0]
        console.log('Got cookies:', this.cookies)
      } else {
        console.log('No cookies in response')
      }
    } catch (e) {
      console.error('qBittorrent auth failed:', e)
    }
  }

  async getTorrents(): Promise<Torrent[]> {
    await this.ensureAuth()

    try {
      const response = await this.request<QBitTorrent[]>('/torrents/info')

      return response.map(t => ({
        hash: t.hash,
        name: t.name,
        size: t.size,
        completed: t.size > 0 ? Math.floor((t.downloaded / t.size) * t.size) : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.dlspeed,
        uploadSpeed: t.upspeed,
        seeds: t.num_seeds,
        peers: t.num_leechs,
        state: this.mapState(t.state),
        addedAt: t.added_on * 1000,
        doneAt: t.completion_on > 0 ? t.completion_on * 1000 : null,
        ratio: t.ratio,
      }))
    } catch (e) {
      console.error('Failed to fetch torrents:', e)
      return []
    }
  }

  async getTorrentDetails(hash: string): Promise<TorrentDetails | null> {
    await this.ensureAuth()

    try {
      const torrents = await this.request<QBitTorrent[]>('/torrents/info', {
        method: 'POST',
        body: { hashes: hash },
      })

      const t = torrents[0]
      if (!t) return null

      const files = await this.request<QBitFile[]>('/torrents/files', {
        method: 'POST',
        body: { hash },
      })

      return {
        hash: t.hash,
        name: t.name,
        size: t.size,
        completed: t.size > 0 ? Math.floor((t.downloaded / t.size) * t.size) : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.dlspeed,
        uploadSpeed: t.upspeed,
        seeds: t.num_seeds,
        peers: t.num_leechs,
        state: this.mapState(t.state),
        addedAt: t.added_on * 1000,
        doneAt: t.completion_on > 0 ? t.completion_on * 1000 : null,
        ratio: t.ratio,
        files: files.map(f => ({
          name: f.name,
          size: f.size,
          completed: f.completed,
          priority: this.mapPriority(f.priority),
        })),
        trackers: [],
      }
    } catch (e) {
      console.error('Failed to fetch torrent details:', e)
      return null
    }
  }

  async addTorrentByFile(file: Buffer): Promise<boolean> {
    await this.ensureAuth()

    try {
      const formData = new FormData()
      const uint8Array = new Uint8Array(file)
      formData.append('torrentfile', new Blob([uint8Array]), 'torrent.torrent')

      await ofetch(`${this.baseUrl}/api/v2/torrents/add`, {
        method: 'POST',
        body: formData,
      })

      return true
    } catch (e) {
      console.error('Failed to add torrent:', e)
      return false
    }
  }

  async addTorrentByUrl(url: string): Promise<boolean> {
    await this.ensureAuth()

    try {
      await this.request('/torrents/add', {
        method: 'POST',
        body: { urls: url },
      })
      return true
    } catch (e) {
      console.error('Failed to add torrent from URL:', e)
      return false
    }
  }

  async addTorrentByMagnet(magnet: string): Promise<boolean> {
    return this.addTorrentByUrl(magnet)
  }

  async startTorrents(hashes: string[]): Promise<boolean> {
    await this.ensureAuth()

    try {
      await this.request('/torrents/start', {
        method: 'POST',
        body: { hashes: hashes.join('|') },
      })
      return true
    } catch (e) {
      console.error('Failed to start torrents:', e)
      return false
    }
  }

  async stopTorrents(hashes: string[]): Promise<boolean> {
    await this.ensureAuth()

    try {
      await this.request('/torrents/stop', {
        method: 'POST',
        body: { hashes: hashes.join('|') },
      })
      return true
    } catch (e) {
      console.error('Failed to stop torrents:', e)
      return false
    }
  }

  async deleteTorrents(hashes: string[], deleteFiles: boolean = false): Promise<boolean> {
    await this.ensureAuth()

    try {
      await this.request('/torrents/delete', {
        method: 'POST',
        body: {
          hashes: hashes.join('|'),
          deleteFiles: deleteFiles ? 'true' : 'false',
        },
      })
      return true
    } catch (e) {
      console.error('Failed to delete torrents:', e)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await ofetch(`${this.baseUrl}/api/v2/app/version`)
      return true
    } catch (e) {
      return false
    }
  }

  private mapState(state: string): Torrent['state'] {
    const stateMap: Record<string, Torrent['state']> = {
      downloading: 'downloading',
      seeding: 'seeding',
      pausedUP: 'seeding',
      pausedDL: 'paused',
      stopped: 'stopped',
      error: 'error',
      queued: 'stopped',
      uploading: 'seeding',
      forcedUP: 'seeding',
      forcedDL: 'downloading',
    }
    return stateMap[state] || 'stopped'
  }

  private mapPriority(priority: number): TorrentFile['priority'] {
    if (priority === 0) return 'skip'
    if (priority === 1) return 'low'
    if (priority === 2) return 'normal'
    if (priority === 4) return 'high'
    return 'normal'
  }
}
