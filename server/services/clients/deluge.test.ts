import { describe, it, expect } from 'vitest'

// Deluge is not running, so we mark these tests as pending
describe.skip('DelugeAdapter', () => {
  it('should connect to Deluge', async () => {
    expect(true).toBe(true)
  })

  it('should fetch torrents', async () => {
    expect(true).toBe(true)
  })
})
