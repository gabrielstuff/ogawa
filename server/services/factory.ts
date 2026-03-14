import type { Settings, QBittorrentSettings, RTorrentSettings, TransmissionSettings, DelugeSettings } from '../utils/types'
import type { TorrentClientAdapter } from './adapter'
import { QBittorrentAdapter } from './clients/qbittorrent'
import { RTorrentAdapter } from './clients/rtorrent'
import { TransmissionAdapter } from './clients/transmission'
import { DelugeAdapter } from './clients/deluge'

let cachedAdapter: TorrentClientAdapter | null = null
let cachedSettings: string | null = null

export function createClientAdapter(settings: Settings): TorrentClientAdapter {
  const settingsKey = JSON.stringify(settings)

  if (cachedAdapter && cachedSettings === settingsKey) {
    return cachedAdapter
  }

  const adapter = createAdapter(settings)
  cachedAdapter = adapter
  cachedSettings = settingsKey
  return adapter
}

function createAdapter(settings: Settings): TorrentClientAdapter {
  switch (settings.client) {
    case 'qBittorrent':
      return new QBittorrentAdapter(settings as QBittorrentSettings)
    case 'rTorrent':
      return new RTorrentAdapter(settings as RTorrentSettings)
    case 'Transmission':
      return new TransmissionAdapter(settings as TransmissionSettings)
    case 'Deluge':
      return new DelugeAdapter(settings as DelugeSettings)
    default:
      throw new Error(`Unsupported torrent client: ${settings.client}`)
  }
}

export function getClientTypes(): string[] {
  return ['qBittorrent', 'rTorrent', 'Transmission', 'Deluge']
}
