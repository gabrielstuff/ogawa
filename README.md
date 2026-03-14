# Ogawa

A modern, web-based torrent client interface built with Nuxt 4.

## About

Ogawa provides a unified, clean interface for managing torrents across multiple torrent client backends. Connect to qBittorrent, Transmission, rTorrent, or Deluge and manage all your torrents from a single, responsive interface.

### Features

- **Multi-client support** - Connect to qBittorrent, Transmission, rTorrent, or Deluge
- **RSS Feeds** - Built-in RSS feed management for automated downloading
- **Responsive Design** - Works on desktop and mobile devices
- **PWA Support** - Install as a native-like app
- **Dark Theme** - Easy on the eyes with a clean dark interface
- **Fast & Lightweight** - Built with Nuxt 4 and Bun for optimal performance

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Nuxt 4 (Vue 3) |
| Runtime | Bun |
| UI | @nuxt/ui |
| Icons | @nuxt/icon |
| State | Pinia |
| Database | libSQL (Turso) with Drizzle ORM |
| Validation | Zod |

## Architecture

Ogawa uses an **Adapter Pattern** to support multiple torrent clients:

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│   UI Layer  │────▶│  API Routes  │────▶│ Client Factory  │
│   (Vue 3)   │     │   (Nuxt)     │     │   (adapter)     │
└─────────────┘     └──────────────┘     └────────┬────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────┐
                    │                              │                  │
              ┌─────▼─────┐   ┌───────────┐   ┌──▼────┐   ┌─────▼────┐
              │ qBittorrent│   │Transmission│   │rTorrent│   │ Deluge   │
              └───────────┘   └───────────┘   └────────┘   └──────────┘
```

### Directory Structure

```
ogawa/
├── assets/css/           # Global styles
├── db/                  # Database schema and setup
├── layouts/             # Vue layouts
├── pages/               # File-based routing
├── public/              # Static assets
├── server/
│   ├── api/             # API endpoints
│   └── services/        # Torrent client adapters
│       └── clients/      # Client implementations
├── types/               # TypeScript types
└── nuxt.config.ts       # Nuxt configuration
```

## Supported Clients

| Client | Default Port | Protocol |
|--------|-------------|----------|
| qBittorrent | 8080 | REST API |
| Transmission | 9091 | RPC |
| rTorrent | 5000 | SCGI |
| Deluge | 58846 | JSON-RPC |

## Setup

### Prerequisites

- [Bun](https://bun.sh) runtime
- A running torrent client (qBittorrent, Transmission, rTorrent, or Deluge)

### Installation

```bash
# Clone the repository
cd ogawa

# Install dependencies
bun install
```

### Environment Variables

Create a `.env` file:

```bash
# Database (local SQLite)
TURSO_URL=file:ogawa.db
TURSO_TOKEN=

# qBittorrent (default client)
QBITTORRENT_URL=http://localhost:8080
QBITTORRENT_USERNAME=admin
QBITTORRENT_PASSWORD=adminadmin

# Or use other clients:
# TRANSMISSION_URL=http://localhost:9091
# TRANSMISSION_USERNAME=admin
# TRANSMISSION_PASSWORD=admin
# RTORRENT_URL=scgi://localhost:5000
# DELUGE_HOST=localhost
# DELUGE_PORT=58846
# DELUGE_PASSWORD=password
```

### Running

```bash
# Development
bun run dev

# Production
bun run build
bun run start
```

The app will be available at `http://localhost:3000`.

## Development

```bash
# Lint
bun run lint

# Fix lint issues
bun run lint:fix

# Format code
bun run format

# Run tests
bun run test
```

## API Endpoints

- `GET /api/torrents` - List all torrents
- `POST /api/torrents` - Add a new torrent
- `GET /api/torrents/:hash` - Get torrent details
- `PATCH /api/torrents/:hash` - Update torrent
- `DELETE /api/torrents/:hash` - Delete torrent
- `GET /api/feeds` - List RSS feeds
- `POST /api/feeds` - Add RSS feed
- `GET /api/settings` - Get settings
- `PATCH /api/settings` - Update settings
- `POST /api/client/test` - Test client connection

## License

MIT
