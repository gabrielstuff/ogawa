---
title: Create E2E Integration Tests for Torrent Client Adapters
type: fix
status: active
date: 2026-03-14
---

# Create E2E Integration Tests for Torrent Client Adapters

## Overview

Create comprehensive end-to-end (E2E) integration tests for qBittorrent and Transmission torrent client adapters using real, working torrent data (magnet links and torrent files). The tests verify the complete torrent lifecycle: connect → add torrent → get status → start → wait → check status → stop → delete.

## Problem Statement

Current E2E tests use **invalid/fake magnet links** that don't work with real torrent clients:

- Current: `magnet:?xt=urn:btih:6a4c5b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3&dn=ubuntu-test&tr=udp://tracker.example.com:80`
- This fake magnet has a random hash and non-existent tracker, causing tests to fail

## Proposed Solution

Replace fake test data with **real, working torrent data**:
- Use public domain torrents (Sintel, Big Buck Bunny)
- Test both magnet links AND .torrent files
- Implement proper test isolation with cleanup hooks

## Test Data

### Magnet Links

1. **Sintel** (open movie):
   ```
   magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent
   ```

2. **Big Buck Bunny** (open movie):
   ```
   magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent
   ```

### Torrent Files

Located in `test-files/` directory:
- `test-files/big-buck-bunny.torrent`
- `test-files/sintel.torrent`

## Test Scenarios

### 1. QBittorrent E2E Tests

| Test | Method | Input | Expected |
|------|--------|-------|----------|
| Connect | `testConnection()` | - | `true` |
| Add by magnet | `addTorrentByMagnet()` | Sintel magnet | `true` |
| Fetch torrents | `getTorrents()` | - | Torrent in list |
| Start torrent | `startTorrents()` | hash | `true` |
| Wait & check | `getTorrents()` | - | Status updated |
| Stop torrent | `stopTorrents()` | hash | `true` |
| Delete torrent | `deleteTorrents()` | hash | `true` |

### 2. Transmission E2E Tests

Same flow as QBittorrent, using Transmission adapter.

### 3. Unit Tests

| Adapter | Tests |
|---------|-------|
| QBittorrent | `testConnection`, `addTorrentByFile`, `addTorrentByUrl`, `addTorrentByMagnet` |
| Transmission | `testConnection`, `addTorrentByFile`, `addTorrentByUrl`, `addTorrentByMagnet` |

## Implementation Details

### Test File Structure

```
server/services/clients/
├── qbittorrent-e2e.test.ts      # E2E tests with real data
├── transmission-e2e.test.ts      # E2E tests with real data
├── qbittorrent.test.ts          # Unit tests (existing, enhance)
└── transmission.test.ts          # Unit tests (existing, enhance)
```

### Test Improvements

1. **Add cleanup hooks**: Use `afterEach` to delete test torrents
2. **Use real data**: Sintel/Big Buck Bunny magnets and torrent files
3. **Better assertions**: Verify state changes after operations
4. **Retry logic**: Wait for torrent to appear after adding (max 10s)
5. **Test isolation**: Each test adds its own torrent

### Code Changes

#### qbittorrent-e2e.test.ts

```typescript
// Use real Sintel magnet link
const MAGNET_SINTEL = 'magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent'

describe('QBittorrentAdapter E2E', () => {
  const adapter = new QBittorrentAdapter(settings)
  let testHash = ''

  afterEach(async () => {
    // Cleanup: delete test torrent if exists
    if (testHash) {
      await adapter.deleteTorrents([testHash], false)
      testHash = ''
    }
  })

  it('should add torrent by magnet and verify lifecycle', async () => {
    // 1. Add torrent
    const added = await adapter.addTorrentByMagnet(MAGNET_SINTEL)
    expect(added).toBe(true)

    // 2. Wait for torrent to appear (up to 10s)
    const torrent = await waitForTorrent(adapter, 10000)
    testHash = torrent.hash

    // 3. Start torrent
    await adapter.startTorrents([testHash])

    // 4. Wait and check status
    await new Promise(r => setTimeout(r, 3000))
    const updated = await adapter.getTorrents()
    const found = updated.find(t => t.hash === testHash)
    expect(found).toBeDefined()

    // 5. Stop torrent
    await adapter.stopTorrents([testHash])

    // 6. Delete torrent
    await adapter.deleteTorrents([testHash], false)
  })
})

async function waitForTorrent(adapter, timeout) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const torrents = await adapter.getTorrents()
    if (torrents.length > 0) {
      return torrents[torrents.length - 1]
    }
    await new Promise(r => setTimeout(r, 500))
  }
  throw new Error('Torrent not found after timeout')
}
```

## Acceptance Criteria

- [ ] QBittorrent E2E test passes with real Sintel magnet
- [ ] Transmission E2E test passes with real Sintel magnet
- [ ] Tests cover full lifecycle: connect → add → get status → start → wait → check → stop → delete
- [ ] Tests properly clean up after themselves
- [ ] Unit tests verify individual adapter methods
- [ ] All tests run successfully with `bun test`

## Success Metrics

- All E2E tests pass (no skipped tests due to missing torrent)
- Test execution time: < 60 seconds per adapter
- 100% cleanup: no orphaned torrents after tests

## Dependencies

- qBittorrent running on port 9090
- Transmission running on port 9091
- Credentials: admin/pasdemdp

## Risks

- **Network dependency**: Magnet links require internet and working trackers
- **Timing issues**: May need to adjust wait times for slow connections
- **Client state**: Tests assume clean client (no pre-existing torrents)
