import { describe, it, expect } from 'vitest'
import { TransmissionAdapter } from '../../../server/services/clients/transmission'

const transmissionSettings = {
  client: 'Transmission' as const,
  url: 'http://localhost:9091',
  username: 'admin',
  password: 'pasdemdp',
}

const MAGNET_SINTEL = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

async function waitForTorrent(adapter: TransmissionAdapter, timeoutMs: number = 30000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const torrents = await adapter.getTorrents()
    if (torrents.length > 0) {
      return torrents[torrents.length - 1]
    }
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  throw new Error('Torrent not found after timeout')
}

describe('TransmissionAdapter E2E', () => {
  const adapter = new TransmissionAdapter(transmissionSettings)

  it('should connect to Transmission', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should add a torrent by magnet, start, check status, stop, and delete', async () => {
    const added = await adapter.addTorrentByMagnet(MAGNET_SINTEL)
    expect(added).toBe(true)

    let torrent
    try {
      torrent = await waitForTorrent(adapter, 30000)
    }
    catch {
      throw new Error('Failed to find torrent after adding by magnet')
    }

    if (!torrent) {
      throw new Error('Torrent not found')
    }

    expect(torrent.name).toContain('Sintel')

    const testHash = torrent.hash

    const startResult = await adapter.startTorrents([testHash])
    expect(startResult).toBe(true)

    await new Promise(resolve => setTimeout(resolve, 3000))

    const torrents = await adapter.getTorrents()
    const updated = torrents.find(t => t.hash === testHash)
    expect(updated).toBeDefined()
    expect(updated?.state).toBeDefined()

    const stopResult = await adapter.stopTorrents([testHash])
    expect(stopResult).toBe(true)

    const deleteResult = await adapter.deleteTorrents([testHash], false)
    expect(deleteResult).toBe(true)
  })
})
