import type { Torrent, TorrentDetails } from '../utils/types'

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
