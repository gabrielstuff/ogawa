---
title: Fix Test Quality Issues in Torrent Client Tests
type: fix
status: active
date: 2026-03-14
---

# Fix Test Quality Issues in Torrent Client Tests

## Overview

Fix critical and important test quality issues identified in the code review for qBittorrent and Transmission client test files.

## Issues Found

### 🔴 Critical Issues

1. **Test Order Dependency** (qbittorrent-e2e.test.ts, transmission-e2e.test.ts)
   - Tests depend on execution order - if `fetch` runs before `add`, it fails
   - Should be self-contained: add → verify → cleanup in each test

2. **Weak Assertions** (qbittorrent.test.ts:31, transmission.test.ts:31)
   - `expect(typeof result).toBe('boolean')` always passes
   - Should check actual values: `expect(result).toBe(true)`

3. **Unused Helper Function** (qbittorrent-e2e.test.ts:13-23)
   - `waitForTorrent` defined but never used
   - Either use it or remove it

4. **Silent Skips** (qbittorrent-e2e.test.ts:66-68)
   - Tests silently skip if no torrent hash, hiding real problems
   - Should fail fast: `expect(testTorrentHash).toBeDefined()`

### 🟡 Important Issues

5. **No Test Isolation** - Single adapter instance shared across tests
6. **Hardcoded Credentials** - Password in source, should use env vars
7. **Fake Data** - `Buffer.from('fake torrent data')` won't work
8. **Duplicate Hash Deletion** - Test deletes, then `afterEach` tries again

## Acceptance Criteria

- [ ] Make E2E tests self-contained (each test adds, verifies, cleans up its own torrent)
- [ ] Replace weak assertions with strong ones
- [ ] Use or remove `waitForTorrent` helper
- [ ] Replace silent skips with explicit failures
- [ ] Add test isolation with fresh adapter instances
- [ ] Remove hardcoded credentials or document they're for testing only
- [ ] Use real test data instead of fake data
- [ ] Fix duplicate deletion in afterEach

## Files to Modify

- `server/services/clients/qbittorrent.test.ts`
- `server/services/clients/transmission.test.ts`
- `server/services/clients/qbittorrent-e2e.test.ts`
- `server/services/clients/transmission-e2e.test.ts`

## Implementation Plan

### Step 1: Fix qbittorrent.test.ts

Replace weak assertions:
```typescript
// Before (weak)
expect(typeof result).toBe('boolean')

// After (strong)
expect(result).toBe(true)
```

### Step 2: Fix qbittorrent-e2e.test.ts

Make tests self-contained:
```typescript
it('should add torrent by magnet and verify lifecycle', async () => {
  // 1. Add torrent
  const added = await adapter.addTorrentByMagnet(MAGNET_SINTEL)
  expect(added).toBe(true)
  
  // 2. Verify it exists
  const torrents = await adapter.getTorrents()
  const found = torrents.find(t => t.name.includes('Sintel'))
  testTorrentHash = found.hash
  expect(found).toBeDefined()
  
  // 3. Start
  await adapter.startTorrents([testTorrentHash])
  
  // 4. Verify started
  await new Promise(r => setTimeout(r, 2000))
  const updated = await adapter.getTorrents()
  const torrent = updated.find(t => t.hash === testTorrentHash)
  expect(torrent).toBeDefined()
  
  // 5. Stop
  await adapter.stopTorrents([testTorrentHash])
  
  // 6. Delete
  await adapter.deleteTorrents([testTorrentHash], false)
})
```

Fix afterEach to not duplicate:
```typescript
afterEach(async () => {
  if (testTorrentHash) {
    try {
      await adapter.deleteTorrents([testTorrentHash], false)
    } catch (e) {
      // Torrent may already be deleted by test
    }
    testTorrentHash = ''
  }
})
```

Use waitForTorrent helper:
```typescript
it('should add a torrent by magnet', async () => {
  const result = await adapter.addTorrentByMagnet(MAGNET_SINTEL)
  expect(result).toBe(true)
  
  const torrent = await waitForTorrent(adapter, 30000)
  testTorrentHash = torrent.hash
  expect(torrent.name).toContain('Sintel')
})
```

### Step 3: Fix transmission-e2e.test.ts

Same changes as qbittorrent-e2e.test.ts

### Step 4: Fix transmission.test.ts

Same changes as qbittorrent.test.ts

## Sources

- Code review findings from kieran-typescript-reviewer
- Related plan: docs/plans/2026-03-14-fix-e2e-torrent-tests-plan.md
