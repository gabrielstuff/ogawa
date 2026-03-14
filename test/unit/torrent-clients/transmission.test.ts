import { describe, it, expect, beforeEach } from 'vitest'
import { TransmissionAdapter } from '../../../server/services/clients/transmission'

const transmissionSettings = {
  client: 'Transmission' as const,
  url: 'http://localhost:9091',
  username: 'admin',
  password: 'pasdemdp',
}

describe('TransmissionAdapter', () => {
  let adapter: TransmissionAdapter

  beforeEach(() => {
    adapter = new TransmissionAdapter(transmissionSettings)
  })

  it('should connect to Transmission', async () => {
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
