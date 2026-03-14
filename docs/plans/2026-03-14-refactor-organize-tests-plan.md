---
title: Organize and Document Tests per Nuxt Best Practices
type: refactor
status: active
date: 2026-03-14
---

# Organize and Document Tests per Nuxt Best Practices

## Overview

Refactor the test setup to follow Nuxt's recommended testing patterns from @nuxt/test-utils documentation.

## Current State

- Tests located in `server/services/clients/*.test.ts` (non-standard)
- No `vitest.config.ts` exists
- Tests use basic vitest without Nuxt-specific helpers
- No documentation for testing approach

## Problems

1. **Non-standard location**: Tests should be in `test/` directory per Nuxt conventions
2. **Missing config**: No vitest configuration for proper test separation
3. **No Nuxt integration**: Not using @nuxt/test-utils helpers
4. **No documentation**: Testing approach not documented

## Solution

### Step 1: Create vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'
import { defineVitestProject } from '@nuxt/test-utils/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['test/unit/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['test/e2e/**/*.test.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['test/nuxt/**/*.test.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
```

### Step 2: Create test directory structure

```
test/
├── unit/
│   └── torrent-clients/
│       ├── qbittorrent.test.ts
│       ├── transmission.test.ts
│       ├── rtorrent.test.ts
│       └── deluge.test.ts
├── e2e/
│   └── torrent-clients/
│       ├── qbittorrent-e2e.test.ts
│       └── transmission-e2e.test.ts
└── nuxt/
    └── (future Nuxt-specific tests)
```

### Step 3: Update package.json scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest --project unit",
    "test:e2e": "vitest --project e2e",
    "test:nuxt": "vitest --project nuxt",
    "test:run": "vitest run",
    "test:watch": "vitest --watch"
  }
}
```

### Step 4: Document testing approach

Create `references/testing.md` with:
- Test organization explanation
- Running tests commands
- How to add new tests

## Files to Create/Modify

- Create: `vitest.config.ts`
- Create: `test/unit/torrent-clients/*.ts` (move from server/services/clients/)
- Create: `test/e2e/torrent-clients/*.ts` (move from server/services/clients/)
- Create: `references/testing.md`
- Delete: `server/services/clients/*.test.ts` (after moving)
- Modify: `package.json` (scripts)

## Acceptance Criteria

- [x] vitest.config.ts created with proper project separation
- [x] Tests organized in test/unit/ and test/e2e/ directories
- [x] Package.json scripts updated for project-specific testing
- [x] references/testing.md created with documentation
- [x] Old test files removed from server/services/clients/
- [x] Tests still pass after reorganization

## References

- [Nuxt Testing Documentation](https://nuxt.com/docs/getting-started/testing)
- @nuxt/test-utils package
