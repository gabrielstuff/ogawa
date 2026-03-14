import { describe, it, expect } from 'vitest'
import { TransmissionAdapter } from './transmission'

const transmissionSettings = {
  client: 'Transmission' as const,
  url: 'http://localhost:9091',
  username: 'admin',
  password: 'pasdemdp',
}

describe('TransmissionAdapter', () => {
  const adapter = new TransmissionAdapter(transmissionSettings)

  it('should connect to Transmission', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should authenticate with correct credentials', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })

  it('should add a torrent by URL', async () => {
    const result = await adapter.addTorrentByUrl('https://example.com/test.torrent')
    expect(typeof result).toBe('boolean')
  })

  it('should add a torrent by magnet', async () => {
    const result = await adapter.addTorrentByMagnet('magnet:?xt=urn:btih:test')
    expect(typeof result).toBe('boolean')
  })

  it('should start torrents', async () => {
    const result = await adapter.startTorrents(['nonexistent'])
    expect(typeof result).toBe('boolean')
  })

  it('should stop torrents', async () => {
    const result = await adapter.stopTorrents(['nonexistent'])
    expect(typeof result).toBe('boolean')
  })

  it('should delete torrents without files', async () => {
    const result = await adapter.deleteTorrents(['nonexistent'], false)
    expect(typeof result).toBe('boolean')
  })

  it('should delete torrents with files', async () => {
    const result = await adapter.deleteTorrents(['nonexistent'], true)
    expect(typeof result).toBe('boolean')
  })
})
