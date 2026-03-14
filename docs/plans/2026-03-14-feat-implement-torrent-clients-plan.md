---
title: Implement torrent client support for Transmission, rTorrent, and Deluge
type: feat
status: active
date: 2026-03-14
---

# Implement Torrent Client Support

## Overview

Complete the implementation of torrent client adapters for Transmission, rTorrent, and Deluge. Currently only qBittorrent is fully functional. The other clients either have stub implementations or bugs.

## Problem Statement

The project aims to support multiple torrent clients (qBittorrent, Transmission, rTorrent, Deluge), but only qBittorrent is fully working:
- **qBittorrent**: ✅ Fully implemented and working
- **Transmission**: ✅ Fully implemented in code
- **rTorrent**: ❌ Not implemented (stub methods only)
- **Deluge**: ⚠️ Has code but uses hardcoded URL (localhost:8112) instead of dynamic settings

Additionally, the Settings UI only shows qBittorrent fields and lacks a client selector.

## Current Code Status

### qBittorrent (`server/services/clients/qbittorrent.ts`)
- All 8 adapter methods implemented
- Authentication via cookies
- Full torrent CRUD operations

### Transmission (`server/services/clients/transmission.ts`)
- All 8 adapter methods implemented
- Session-based authentication with X-Transmission-Session-Id
- Full torrent CRUD operations

### rTorrent (`server/services/clients/rtorrent.ts`)
- Only `testConnection()` has basic implementation
- All other methods return false with console.error
- Uses SCGI protocol (different from HTTP)

### Deluge (`server/services/clients/deluge.ts`)
- All 8 adapter methods implemented
- Bug: uses hardcoded `http://localhost:8112/json` instead of dynamic settings
- Uses JSON-RPC protocol

## Proposed Solution

### Phase 1: Fix Deluge Adapter
1. Fix the request method to use dynamic host/port from settings
2. Add authentication handling (Deluge requires password in each request)

### Phase 2: Implement rTorrent Adapter
1. Implement SCGI protocol for rTorrent
2. rTorrent uses XML-RPC over SCGI (not HTTP)
3. Need to handle SCGI request formatting
4. Implement all 8 adapter methods

### Phase 3: Update Settings UI
1. Add client type selector dropdown
2. Show relevant fields based on selected client:
   - qBittorrent: URL, username, password
   - Transmission: URL, username, password
   - rTorrent: SCGI URL
   - Deluge: host, port, password
3. Update settings API to store client type

## Technical Details

### rTorrent SCGI Protocol
- rTorrent uses SCGI (not HTTP)
- Need to format SCGI requests: `CONTENT_LENGTH\r\n...\r\n\0`
- Common methods: `download_list`, `d.get_hash`, `d.get_name`, `d.get_size_bytes`, etc.
- XML-RPC responses need parsing

### Deluge JSON-RPC
- Deluge web API on port 8112 by default
- Each request needs auth: `method: "auth.login", params: [password]`
- Store session after login

### Settings Changes
- Add `clientType` field to settings
- Show/hide fields based on client type
- Persist client selection in database

## Acceptance Criteria

- [ ] Deluge adapter uses dynamic host/port from settings
- [ ] Deluge authentication works properly
- [ ] rTorrent adapter can list torrents
- [ ] rTorrent adapter can add/start/stop/delete torrents
- [ ] Settings page has client type dropdown
- [ ] Settings page shows relevant fields for each client
- [ ] Settings are persisted correctly with client type

## Files to Modify

1. `server/services/clients/deluge.ts` - Fix hardcoded URL
2. `server/services/clients/rtorrent.ts` - Full implementation
3. `pages/settings.vue` - Add client selector and conditional fields
4. `server/utils/types.ts` - May need adjustments
5. `server/api/settings.ts` - Handle client type in settings

## Testing

- Test each client connection individually
- Verify torrents list correctly for each client
- Test add/start/stop/delete operations
- Test settings persistence across page reloads

## Sources

- Repo exploration: All client adapters and settings
- qBittorrent API: https://github.com/qbittorrent/qBittorrent/wiki/WebUI-API-(qBittorrent-4.1)
- Transmission RPC: https://github.com/transmission/transmission/blob/main/docs/rpc-spec.md
- Deluge RPC: https://deluge-torrent.org/wiki/ RPC
