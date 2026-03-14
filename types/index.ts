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
  state: 'downloading' | 'seeding' | 'paused' | 'stopped' | 'error'
  addedAt: number
  doneAt: number | null
  ratio: number
}

export interface TorrentFile {
  name: string
  size: number
  completed: number
  priority: 'skip' | 'low' | 'normal' | 'high'
}

export interface TorrentDetails extends Torrent {
  files: TorrentFile[]
  trackers: string[]
}

export interface Feed {
  id: number
  url: string
  title: string | null
  lastUpdated: number | null
  items: FeedItem[]
}

export interface FeedItem {
  id: number
  title: string
  link: string
  pubDate: number
  torrentUrl: string
  downloaded: boolean
}

export interface AppSettings {
  client: {
    url: string
    username: string
    password: string
  }
  ui: {
    theme: string
    itemsPerPage: number
  }
  download: {
    defaultPath: string
    maxActive: number
    downloadSpeedLimit: number
    uploadSpeedLimit: number
  }
}
