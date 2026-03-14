import { describe, it, expect, beforeEach } from 'vitest'
import { QBittorrentAdapter } from './qbittorrent'

const qbitSettings = {
  client: 'qBittorrent' as const,
  url: 'http://localhost:9090',
  username: 'admin',
  password: 'pasdemdp',
}

describe('QBittorrentAdapter', () => {
  let adapter: QBittorrentAdapter

  beforeEach(() => {
    adapter = new QBittorrentAdapter(qbitSettings)
  })

  it('should connect to qBittorrent', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })

  it('should add a torrent by URL', async () => {
    const result = await adapter.addTorrentByUrl('https://example.com/test.torrent')
    expect(result).toBe(true)
  })

  it('should add a torrent by magnet', async () => {
    const result = await adapter.addTorrentByMagnet('magnet:?xt=urn:btih:test')
    expect(result).toBe(true)
  })

  it('should add a torrent by file', async () => {
    const buffer = Buffer.from('fake torrent data')
    const result = await adapter.addTorrentByFile(buffer)
    expect(typeof result).toBe('boolean')
  })

  it('should start torrents', async () => {
    const result = await adapter.startTorrents(['nonexistent'])
    expect(result).toBe(true)
  })

  it('should stop torrents', async () => {
    const result = await adapter.stopTorrents(['nonexistent'])
    expect(result).toBe(true)
  })

  it('should delete torrents without files', async () => {
    const result = await adapter.deleteTorrents(['nonexistent'], false)
    expect(result).toBe(true)
  })

  it('should delete torrents with files', async () => {
    const result = await adapter.deleteTorrents(['nonexistent'], true)
    expect(result).toBe(true)
  })
})
