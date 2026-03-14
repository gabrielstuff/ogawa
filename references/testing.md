# Testing

> Testing guide for Ogawa based on Nuxt best practices.

This project uses [Vitest](https://vitest.dev/) with [@nuxt/test-utils](https://test-utils.nuxt.com/) for testing, following Nuxt's recommended testing patterns.

## Test Organization

Tests are organized using Vitest projects to separate different test types:

```
test/
├── unit/           # Fast Node.js environment tests
│   └── torrent-clients/
│       ├── qbittorrent.test.ts
│       └── transmission.test.ts
├── e2e/            # End-to-end tests against real services
│   └── torrent-clients/
│       ├── qbittorrent-e2e.test.ts
│       └── transmission-e2e.test.ts
└── nuxt/           # Tests requiring Nuxt runtime environment
    └── (future tests)
```

## Running Tests

```bash
# Run all tests
bun test

# Run all tests in watch mode
bun test:watch

# Run only unit tests
bun test:unit

# Run only E2E tests
bun test:e2e

# Run only Nuxt environment tests
bun test:nuxt
```

## Test Types

### Unit Tests

Located in `test/unit/`. These run in a Node.js environment and are fast. They test individual adapter methods without requiring running torrent clients.

```bash
bun test:unit
```

### E2E Tests

Located in `test/e2e/`. These tests connect to actual torrent clients (qBittorrent, Transmission) and test the full workflow:

1. Connect to client
2. Add torrent by magnet
3. Get torrent status
4. Start download
5. Wait and check status
6. Stop download
7. Delete torrent

**Requirements:**
- qBittorrent running on port 9090
- Transmission running on port 9091
- Credentials: admin/pasdemdp

```bash
bun test:e2e
```

## Adding New Tests

### Unit Test

Create a new test file in `test/unit/`:

```typescript
import { describe, it, expect } from 'vitest'
import { MyAdapter } from '../../server/services/my-adapter'

describe('MyAdapter', () => {
  it('should do something', async () => {
    // test implementation
  })
})
```

### E2E Test

Create a new test file in `test/e2e/`. E2E tests should be self-contained and clean up after themselves.

## Test Configuration

See `vitest.config.ts` for the test project configuration. The config uses `@nuxt/test-utils/config` to set up proper Nuxt integration.

## References

- [Nuxt Testing Documentation](https://nuxt.com/docs/getting-started/testing)
- [Vitest Documentation](https://vitest.dev/)
- [@nuxt/test-utils](https://test-utils.nuxt.com/)
