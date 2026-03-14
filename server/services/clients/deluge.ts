import { ofetch } from 'ofetch'
import type { Torrent, TorrentDetails, DelugeSettings, TorrentFile } from '../../utils/types'
import type { TorrentClientAdapter } from '../adapter'

export class DelugeAdapter implements TorrentClientAdapter {
  private settings: DelugeSettings

  constructor(settings: DelugeSettings) {
    this.settings = settings
  }

  private get connection(): { host: string; port: number; password: string } {
    return {
      host: this.settings.host || 'localhost',
      port: this.settings.port || 58846,
      password: this.settings.password || 'admin',
    }
  }

  private async request<T>(method: string, params: unknown[] = []): Promise<T> {
    const { host, port, password } = this.connection
    const url = `http://${host}:${port}/json`
    
    try {
      const response = await ofetch<{ id: number; result: T; error?: string }>(url, {
        method: 'POST',
        body: {
          method,
          params,
          id: 1,
        },
      })

      if (response.error) {
        throw new Error(response.error)
      }

      return response.result
    } catch (e) {
      console.error('Deluge request failed:', e)
      throw e
    }
  }

  private async ensureAuth(): Promise<void> {
    const { password } = this.connection
    try {
      await this.request('auth.login', [password])
    } catch (e) {
      console.error('Deluge auth failed:', e)
    }
  }

  async getTorrents(): Promise<Torrent[]> {
    await this.ensureAuth()
    try {
      const result = await this.request<Array<{
        hash: string
        name: string
        total_size: number
        downloaded: number
        uploaded: number
        download_payload_rate: number
        upload_payload_rate: number
        num_seeds: number
        num_peers: number
        state: string
        time_added: number
        completed_time: number
        ratio: number
      }>>('core.get_torrents_status', [{}, [
        'hash', 'name', 'total_size', 'downloaded', 'uploaded',
        'download_payload_rate', 'upload_payload_rate',
        'num_seeds', 'num_peers', 'state', 'time_added', 'completed_time', 'ratio',
      ]])

      return result.map(t => ({
        hash: t.hash,
        name: t.name,
        size: t.total_size,
        completed: t.completed_time > 0 ? t.total_size : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.download_payload_rate,
        uploadSpeed: t.upload_payload_rate,
        seeds: t.num_seeds,
        peers: t.num_peers,
        state: this.mapState(t.state),
        addedAt: t.time_added * 1000,
        doneAt: t.completed_time > 0 ? t.completed_time * 1000 : null,
        ratio: t.ratio,
      }))
    } catch (e) {
      console.error('Failed to fetch Deluge torrents:', e)
      return []
    }
  }

  async getTorrentDetails(hash: string): Promise<TorrentDetails | null> {
    await this.ensureAuth()
    try {
      const result = await this.request<Array<{
        hash: string
        name: string
        total_size: number
        downloaded: number
        uploaded: number
        download_payload_rate: number
        upload_payload_rate: number
        num_seeds: number
        num_peers: number
        state: string
        time_added: number
        completed_time: number
        ratio: number
        files: Array<{ path: string, size: number, progress: number, priority: number }>
        trackers: Array<{ url: string }>
      }>>('core.get_torrents_status', [[hash], [
        'hash', 'name', 'total_size', 'downloaded', 'uploaded',
        'download_payload_rate', 'upload_payload_rate',
        'num_seeds', 'num_peers', 'state', 'time_added', 'completed_time', 'ratio',
        'files', 'trackers',
      ]])

      const t = result[0]
      if (!t) return null

      return {
        hash: t.hash,
        name: t.name,
        size: t.total_size,
        completed: t.completed_time > 0 ? t.total_size : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.download_payload_rate,
        uploadSpeed: t.upload_payload_rate,
        seeds: t.num_seeds,
        peers: t.num_peers,
        state: this.mapState(t.state),
        addedAt: t.time_added * 1000,
        doneAt: t.completed_time > 0 ? t.completed_time * 1000 : null,
        ratio: t.ratio,
        files: (t.files || []).map(f => ({
          name: f.path,
          size: f.size,
          completed: Math.floor(f.size * f.progress),
          priority: this.mapPriority(f.priority),
        })),
        trackers: (t.trackers || []).map(tr => tr.url),
      }
    } catch (e) {
      console.error('Failed to fetch Deluge torrent details:', e)
      return null
    }
  }

  async addTorrentByFile(file: Buffer): Promise<boolean> {
    await this.ensureAuth()
    try {
      const base64 = Buffer.from(file).toString('base64')
      await this.request('core.add_torrent_file', ['torrent.torrent', base64, {}])
      return true
    } catch (e) {
      console.error('Failed to add Deluge torrent:', e)
      return false
    }
  }

  async addTorrentByUrl(url: string): Promise<boolean> {
    await this.ensureAuth()
    try {
      await this.request('core.add_torrent_url', [url, {}])
      return true
    } catch (e) {
      console.error('Failed to add Deluge torrent from URL:', e)
      return false
    }
  }

  async addTorrentByMagnet(magnet: string): Promise<boolean> {
    await this.ensureAuth()
    try {
      await this.request('core.add_torrent_url', [magnet, {}])
      return true
    } catch (e) {
      console.error('Failed to add Deluge magnet:', e)
      return false
    }
  }

  async startTorrents(hashes: string[]): Promise<boolean> {
    await this.ensureAuth()
    try {
      await this.request('core.resume_torrents', [hashes])
      return true
    } catch (e) {
      console.error('Failed to start Deluge torrents:', e)
      return false
    }
  }

  async stopTorrents(hashes: string[]): Promise<boolean> {
    await this.ensureAuth()
    try {
      await this.request('core.pause_torrents', [hashes])
      return true
    } catch (e) {
      console.error('Failed to pause Deluge torrents:', e)
      return false
    }
  }

  async deleteTorrents(hashes: string[], deleteFiles: boolean): Promise<boolean> {
    await this.ensureAuth()
    try {
      await this.request('core.remove_torrents', [hashes, deleteFiles])
      return true
    } catch (e) {
      console.error('Failed to delete Deluge torrents:', e)
      return false
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      await this.request('web.get_host_status')
      return true
    } catch {
      return false
    }
  }

  private mapState(state: string): Torrent['state'] {
    const stateMap: Record<string, Torrent['state']> = {
      Downloading: 'downloading',
      Seeding: 'seeding',
      Paused: 'paused',
      Stopped: 'stopped',
      Error: 'error',
      Queued: 'stopped',
    }
    return stateMap[state] || 'stopped'
  }

  private mapPriority(priority: number): TorrentFile['priority'] {
    if (priority === 0) return 'skip'
    if (priority === 1) return 'low'
    if (priority === 4) return 'high'
    return 'normal'
  }
}
