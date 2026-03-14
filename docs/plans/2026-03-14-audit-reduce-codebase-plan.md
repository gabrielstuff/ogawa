---
title: Codebase audit - reduce by 30% and improve quality
type: refactor
status: active
date: 2026-03-14
---

# Codebase Audit - Reduce by 30% and Improve Quality

## Overview

Current codebase has redundancies and opportunities for reduction after recent component extraction.

## Current State

| Category | Files | Total LOC |
|----------|-------|-----------|
| Pages | 4 | 842 |
| Components | 17 | 1,190 |
| Composables | 6 | 255 |
| Server API | 5 | 533 |
| Client Services | 4 | 1,176 |
| **Total** | **36** | **3,796** |

## Issues Found

### 🔴 Critical: Duplicate Code (312 LOC)

**`pages/add.vue`** - Completely duplicated with `AddTorrentModal.vue`
- Same functionality, 312 lines
- Not linked anywhere (layout uses modal action)
- Can be safely deleted

### 🟡 Large Components (Need Split)

| Component | LOC | Issue |
|-----------|-----|-------|
| AddTorrentModal.vue | 316 | Handles 3 input types + API calls |
| ClientConfigForm.vue | 194 | Handles 4 client types in one file |

### 🟢 Already Good

- All composables are well-sized (6-60 LOC)
- Most components are single-purpose (24-90 LOC)
- Pages are reasonable after previous refactor

## Reduction Plan

### Phase 1: Delete Duplicate (312 LOC → 0)

- [ ] Delete `pages/add.vue` (completely redundant)

**Savings: 312 LOC (8%)**

### Phase 2: Simplify AddTorrentModal (316 → ~150)

Split into smaller focused components:
- [ ] Create `AddTorrentForm.vue` - handles file upload, magnet, URL tabs
- [ ] Create `useAddTorrent` composable - API logic extracted
- [ ] AddTorrentModal becomes a thin wrapper

**Savings: ~166 LOC (4%)**

### Phase 3: Simplify ClientConfigForm (194 → ~100)

Split by client type:
- [ ] Create `QBitConfigForm.vue`
- [ ] Create `TransmissionConfigForm.vue`
- [ ] Create `RTorrentConfigForm.vue`
- [ ] Create `DelugeConfigForm.vue`
- [ ] ClientConfigForm becomes a switch component

**Savings: ~94 LOC (2.5%)**

## Summary

| Phase | Reduction | New Total | % Reduction |
|-------|-----------|-----------|-------------|
| Current | - | 3,796 | - |
| Phase 1 | 312 LOC | 3,484 | 8% |
| Phase 2 | 166 LOC | 3,318 | 4% |
| Phase 3 | 94 LOC | 3,224 | 2.5% |
| **Total** | **572 LOC** | **3,224** | **15%** |

## Additional Improvements

### Naming Consistency
- [ ] Rename nav "Add" item to remove misleading `/add` path (now triggers modal)

### Code Quality
- [ ] Remove unused imports after refactoring
- [ ] Ensure all components have clear single responsibility

## Acceptance Criteria

- [ ] Delete pages/add.vue
- [ ] Split AddTorrentModal into smaller components
- [ ] Split ClientConfigForm by client type
- [ ] Update layout nav to remove misleading path
- [ ] Total reduction exceeds 500 LOC
