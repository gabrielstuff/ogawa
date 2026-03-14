---
title: Refactor pages into reusable dumb components
type: refactor
status: active
date: 2026-03-14
---

# Refactor pages into reusable dumb components

## Overview

Current pages (especially `index.vue` at 673 lines) contain too much logic and UI markup. They mix data fetching, business logic, formatting utilities, and template markup in single files. This makes components hard to reuse, test, and maintain.

## Problem Statement

**Current Issues:**

1. **Monolithic pages**: `index.vue` is 673 lines with mixed concerns
2. **No reusable components**: All UI is inline in pages
3. **Duplicated logic**: Modal handling, form logic repeated across pages
4. **Props drilling**: No clear component boundaries
5. **Business logic in views**: API calls, formatting functions in page components
6. **Untestable**: Large components are hard to unit test

## Proposed Solution

Extract dumb (presentational) components from pages with clear props/events pattern.

### Components to Extract

| Component | Source | Responsibility |
|-----------|--------|----------------|
| `TorrentList` | index.vue | Desktop + mobile torrent list rendering |
| `TorrentRow` | index.vue | Single torrent row display |
| `TorrentCard` | index.vue | Mobile card view |
| `EmptyState` | index.vue, feeds.vue | Empty state display |
| `AddTorrentModal` | index.vue | Modal with tabs for file/magnet/url |
| `SearchFilter` | index.vue | Search and filter bar |
| `StatusBadge` | index.vue | State badge (downloading/seeding/etc) |
| `ProgressBar` | index.vue | Download progress visualization |
| `FeedList` | feeds.vue | Feed list display |
| `FeedCard` | feeds.vue | Single feed card |
| `SettingsSection` | settings.vue | Reusable settings group |
| `ClientConfigForm` | settings.vue | Client-specific config fields |

### Composables to Extract

| Composable | Purpose |
|------------|---------|
| `useTorrents` | Fetch, filter, sort torrents |
| `useFeeds` | Fetch, add, delete feeds |
| `useSettings` | Load, save, test settings |
| `useTorrentActions` | Start, stop, delete torrents |
| `useFormatters` | formatSize, formatSpeed utilities |

### Architecture Pattern

```
┌─────────────────────────────────────────────────────────┐
│                      Pages                               │
│  (index.vue, feeds.vue, settings.vue)                   │
│  - Route metadata                                       │
│  - Page-level data fetching                             │
│  - Coordinates children                                 │
│  - NO business logic                                    │
└─────────────────────┬───────────────────────────────────┘
                      │ props / events
                      ▼
┌─────────────────────────────────────────────────────────┐
│              Dumb Components (Presentational)              │
│  - Receive data via props                               │
│  - Emit events for actions                              │
│  - No API calls                                         │
│  - Pure rendering                                       │
└─────────────────────────────────────────────────────────┘
                      │ uses
                      ▼
┌─────────────────────────────────────────────────────────┐
│                    Composables                           │
│  - Business logic                                       │
│  - API calls                                           │
│  - State management                                    │
│  - Shared utilities                                    │
└─────────────────────────────────────────────────────────┘
```

## Technical Considerations

### Props/Events Convention

```vue
<!-- Dumb component -->
<script setup lang="ts">
interface Props {
  torrent: Torrent
}
const props = defineProps<Props>()

const emit = defineEmits<{
  start: [hash: string]
  stop: [hash: string]
  delete: [hash: string]
}>()
</script>

<template>
  <button @click="emit('start', props.torrent.hash)">Start</button>
</template>
```

### Composables Pattern

```ts
// composables/useTorrents.ts
export const useTorrents = () => {
  const { data: torrents, refresh } = await useFetch<Torrent[]>('/api/torrents')
  
  const filtered = computed(() => ...)
  
  const start = async (hash: string) => {
    await $fetch(`/api/torrents/${hash}/start`, { method: 'POST' })
    refresh()
  }
  
  return { torrents, filtered, refresh, start, ... }
}
```

## System-Wide Impact

- **Breaking changes**: Component props will change
- **Store usage**: Current `useAddTorrentModal` can stay as it's cross-component state
- **Testing**: New components will be unit testable

## Acceptance Criteria

- [ ] Each page < 200 lines
- [ ] Dumb components receive data via props only
- [ ] All user actions emit events
- [ ] No API calls in dumb components
- [ ] Composables handle all business logic
- [ ] All formatting utilities in `useFormatters` composable
- [ ] Components are individually reusable

## Success Metrics

- Page line count reduced by 60%+
- All components have single responsibility
- Business logic testable via composables
- UI components reusable across contexts

## Dependencies & Risks

- **Risk**: Breaking changes to existing functionality during refactor
- **Mitigation**: Keep old page working until new components ready
- **Effort**: Medium - iterative component extraction

## Implementation Phases

### Phase 1: Utilities & Composables
- Extract `useFormatters` composable
- Create `useTorrents`, `useFeeds`, `useSettings` composables

### Phase 2: Dumb Components
- Extract `EmptyState`, `StatusBadge`, `ProgressBar`
- Extract `TorrentRow`, `TorrentCard`

### Phase 3: Page Refactoring
- Refactor index.vue using new components
- Refactor feeds.vue
- Refactor settings.vue

## Sources & References

- Nuxt component best practices
- Vue 3 composition API patterns
