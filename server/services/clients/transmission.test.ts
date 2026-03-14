import { describe, it, expect } from 'vitest'
import { TransmissionAdapter } from './transmission'

const transmissionSettings = {
  client: 'Transmission' as const,
  url: 'http://localhost:9091',
  username: 'admin',
  password: 'admin',
}

describe('TransmissionAdapter', () => {
  const adapter = new TransmissionAdapter(transmissionSettings)

  it('should connect to Transmission', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })
})
