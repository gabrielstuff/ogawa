import { describe, it, expect } from 'vitest'
import { RTorrentAdapter } from './rtorrent'

const rtorrentSettings = {
  client: 'rTorrent' as const,
  url: 'localhost:5000',
}

describe.skip('RTorrentAdapter', () => {
  const adapter = new RTorrentAdapter(rtorrentSettings)

  it('should connect to rTorrent', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })
})
