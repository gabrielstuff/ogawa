export interface Torrent {
  hash: string
  name: string
  size: number
  completed: number
  downloaded: number
  uploaded: number
  downloadSpeed: number
  uploadSpeed: number
  seeds: number
  peers: number
  state: TorrentState
  addedAt: number
  doneAt: number | null
  ratio: number
}

export type TorrentState = 'downloading' | 'seeding' | 'paused' | 'stopped' | 'error'

export interface TorrentFile {
  name: string
  size: number
  completed: number
  priority: FilePriority
}

export type FilePriority = 'skip' | 'low' | 'normal' | 'high'

export interface TorrentDetails extends Torrent {
  files: TorrentFile[]
  trackers: string[]
}

export interface ClientConnectionSettings {
  client: ClientType
}

export type ClientType = 'qBittorrent' | 'rTorrent' | 'Transmission' | 'Deluge'

export interface QBittorrentSettings extends ClientConnectionSettings {
  client: 'qBittorrent'
  url: string
  username: string
  password: string
}

export interface RTorrentSettings extends ClientConnectionSettings {
  client: 'rTorrent'
  url: string
}

export interface TransmissionSettings extends ClientConnectionSettings {
  client: 'Transmission'
  url: string
  username: string
  password: string
}

export interface DelugeSettings extends ClientConnectionSettings {
  client: 'Deluge'
  host: string
  port: number
  password: string
}

export type Settings = QBittorrentSettings | RTorrentSettings | TransmissionSettings | DelugeSettings

export interface TorrentClientAdapter {
  getTorrents(): Promise<Torrent[]>
  getTorrentDetails(hash: string): Promise<TorrentDetails | null>
  addTorrentByFile(file: Buffer): Promise<boolean>
  addTorrentByUrl(url: string): Promise<boolean>
  addTorrentByMagnet(magnet: string): Promise<boolean>
  startTorrents(hashes: string[]): Promise<boolean>
  stopTorrents(hashes: string[]): Promise<boolean>
  deleteTorrents(hashes: string[], deleteFiles: boolean): Promise<boolean>
  testConnection(): Promise<boolean>
}
