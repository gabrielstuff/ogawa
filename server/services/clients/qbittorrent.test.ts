import { describe, it, expect } from 'vitest'
import { QBittorrentAdapter } from './qbittorrent'

const qbitSettings = {
  client: 'qBittorrent' as const,
  url: 'http://localhost:9090',
  username: 'admin',
  password: 'admin',
}

describe('QBittorrentAdapter', () => {
  const adapter = new QBittorrentAdapter(qbitSettings)

  it('should connect to qBittorrent', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })
})
