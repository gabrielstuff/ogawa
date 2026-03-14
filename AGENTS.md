# AGENTS.md

## Project Overview

This is a Nuxt.js 4 full-stack application with TypeScript, using:
- **Framework**: Nuxt 4.4.2
- **Database**: SQLite with Drizzle ORM and libSQL client
- **UI**: @nuxt/ui (based on Tailwind)
- **State Management**: Pinia
- **i18n**: @nuxtjs/i18n
- **PWA**: @vite-pwa/nuxt
- **Testing**: Vitest with Playwright for e2e
- **Package Manager**: Bun (preferred) or npm

## Commands

```bash
# Development
bun run dev          # Start dev server
bun run build        # Build for production
bun run preview      # Preview production build

# Testing
bun test             # Run all tests
bun test:watch       # Watch mode
bun test:unit        # Unit tests only
bun test:e2e         # E2E tests only

# Linting
bun run lint         # Run ESLint
bun run lint:fix     # Fix ESLint issues
```

## Code Conventions

- Use **TypeScript** for all files
- Follow existing patterns in `pages/`, `components/`, `composables/`
- Database models go in `db/` folder
- API routes go in `server/api/`
- Use Pinia stores in `stores/`
- Use composables in `composables/` for reusable logic

## Testing

- Unit tests in `test/` with `.test.ts` extension
- E2E tests use Playwright
- Run `bun test:nuxt` for Nuxt-specific tests

## Database

- SQLite database at `ogawa.db`
- Drizzle migrations and schemas in `db/`
- Use `drizzle-orm` for queries
