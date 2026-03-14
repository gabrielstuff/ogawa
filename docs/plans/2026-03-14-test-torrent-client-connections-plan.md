---
title: Add unit tests for torrent client connection testing
type: test
status: active
date: 2026-03-14
---

# Add Unit Tests for Torrent Client Connections

## Overview

Create integration tests to verify connection functionality for qBittorrent, Transmission, rTorrent adapters against actual running clients. Mark Deluge as not tested yet.

## Problem Statement

The torrent client adapters have been implemented but lack tests to verify they work against real running clients.

## Client Configuration

The following torrent clients are running:

| Client | Port | URL |
|--------|------|-----|
| qBittorrent | 9090 | http://localhost:9090 |
| Transmission | 9091 | http://localhost:9091 |
| rTorrent | 5000 | scgi://localhost:5000 |
| Deluge | - | Not running (mark as pending) |

## Proposed Solution

Create test files that connect to actual running torrent clients:

### Test Files to Create

1. **qbittorrent.test.ts** - Test qBittorrent on port 9090
2. **transmission.test.ts** - Test Transmission on port 9091
3. **rtorrent.test.ts** - Test rTorrent on port 5000
4. **deluge.test.ts** - Mark as pending (not running)

### Test Cases

Each test should verify:

1. **testConnection()** - Returns true when client is reachable
2. **getTorrents()** - Returns array of torrents (may be empty)
3. **Error handling** - Handles unreachable clients gracefully

## Files to Create

- `server/services/clients/qbittorrent.test.ts`
- `server/services/clients/transmission.test.ts`
- `server/services/clients/rtorrent.test.ts`
- `server/services/clients/deluge.test.ts`

## Implementation

```typescript
import { describe, it, expect } from 'vitest'
import { QBittorrentAdapter } from './qbittorrent'

describe('QBittorrentAdapter', () => {
  const adapter = new QBittorrentAdapter({
    client: 'qBittorrent',
    url: 'http://localhost:9090',
    username: 'admin',
    password: 'admin',
  })

  it('should connect to qBittorrent', async () => {
    const result = await adapter.testConnection()
    expect(result).toBe(true)
  })

  it('should fetch torrents', async () => {
    const torrents = await adapter.getTorrents()
    expect(Array.isArray(torrents)).toBe(true)
  })
})
```

## Acceptance Criteria

- [ ] qBittorrent test passes (port 9090)
- [ ] Transmission test passes (port 9091)
- [ ] rTorrent test passes (port 5000)
- [ ] Deluge test file exists but marked as skipped/pending
