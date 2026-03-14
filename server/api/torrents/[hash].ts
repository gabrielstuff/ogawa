import { createClientAdapter } from '../../services/factory'

async function getSettings() {
  const db = await import('../../../db').then(m => m.default)
  const { settings: settingsTable } = await import('../../../db/schema').then(m => m)

  const rows = await db.select().from(settingsTable).all()

  const result: Record<string, Record<string, string>> = {}
  for (const row of rows) {
    const parts = row.key.split('.')
    const category = parts[0]
    const key = parts[1]
    if (!category || !key) continue
    if (!result[category]) result[category] = {}
    result[category][key] = row.value
  }

  const clientType = result.client?.type || 'qBittorrent'

  switch (clientType) {
    case 'qBittorrent':
      return {
        client: 'qBittorrent' as const,
        url: result.client?.url || 'http://localhost:9090',
        username: result.client?.username || 'admin',
        password: result.client?.password || 'pasdemdp',
      }
    case 'Transmission':
      return {
        client: 'Transmission' as const,
        url: result.client?.url || 'http://localhost:9091',
        username: result.client?.username || 'admin',
        password: result.client?.password || 'admin',
      }
    case 'rTorrent':
      return {
        client: 'rTorrent' as const,
        url: result.client?.url || 'http://localhost:8080/scgi',
      }
    case 'Deluge':
      return {
        client: 'Deluge' as const,
        host: result.client?.host || 'localhost',
        port: parseInt(result.client?.port || '58846', 10),
        password: result.client?.password || 'admin',
      }
    default:
      return {
        client: 'qBittorrent' as const,
        url: result.client?.url || 'http://localhost:9090',
        username: result.client?.username || 'admin',
        password: result.client?.password || 'pasdemdp',
      }
  }
}

export default defineEventHandler(async (event) => {
  const adapter = createClientAdapter(await getSettings())
  const method = event.method

  if (method === 'GET') {
    const hash = getRouterParam(event, 'hash')

    if (hash) {
      return await adapter.getTorrentDetails(hash)
    }
  }

  if (method === 'PATCH') {
    const hash = getRouterParam(event, 'hash')
    const body = await readBody(event)

    if (hash && body?.action) {
      switch (body.action) {
        case 'start':
          await adapter.startTorrents([hash])
          break
        case 'stop':
          await adapter.stopTorrents([hash])
          break
      }
    }

    return { success: true }
  }

  if (method === 'DELETE') {
    const hash = getRouterParam(event, 'hash')
    const query = getQuery(event)
    const deleteFiles = query.deleteFiles === 'true'

    if (hash) {
      await adapter.deleteTorrents([hash], deleteFiles)
    }

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
