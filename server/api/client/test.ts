import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = body?.client || 'qBittorrent'
  const url = body?.url
  const username = body?.username || ''
  const password = body?.password || ''
  const host = body?.host
  const port = body?.port

  if (client === 'qBittorrent') {
    if (!url) {
      throw createError({ statusCode: 400, message: 'URL is required for qBittorrent' })
    }

    try {
      // qBittorrent requires login before any authenticated endpoint
      const loginResponse = await ofetch.raw(`${url}/api/v2/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username, password }).toString(),
      })

      const text = loginResponse._data as string
      if (text === 'Fails.') {
        throw createError({ statusCode: 401, message: 'Invalid qBittorrent credentials' })
      }

      return { success: true, client: 'qBittorrent' }
    }
    catch (e: any) {
      if (e.statusCode) throw e
      throw createError({ statusCode: 500, message: `Failed to connect to qBittorrent: ${e.message}` })
    }
  }

  if (client === 'Transmission') {
    if (!url) {
      throw createError({ statusCode: 400, message: 'URL is required for Transmission' })
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (username && password) {
      headers['Authorization'] = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
    }

    const rpcBody = { method: 'session-get', arguments: {} }

    // Transmission uses CSRF protection: first request returns 409 with the session token
    try {
      await ofetch(`${url}/transmission/rpc`, { method: 'POST', headers, body: rpcBody })
      return { success: true, client: 'Transmission' }
    }
    catch (e: any) {
      if (e.response?.status === 409) {
        const sessionId = e.response.headers?.get?.('x-transmission-session-id')
          || e.response.headers?.['x-transmission-session-id']

        if (!sessionId) {
          throw createError({ statusCode: 500, message: 'Failed to get Transmission session ID' })
        }

        try {
          await ofetch(`${url}/transmission/rpc`, {
            method: 'POST',
            headers: { ...headers, 'X-Transmission-Session-Id': sessionId },
            body: rpcBody,
          })
          return { success: true, client: 'Transmission' }
        }
        catch (e2: any) {
          throw createError({ statusCode: 500, message: `Transmission auth failed: ${e2.message}` })
        }
      }

      throw createError({ statusCode: 500, message: `Failed to connect to Transmission: ${e.message}` })
    }
  }

  if (client === 'rTorrent') {
    const scgiUrl = url || 'localhost:5000'
    const [scgiHost, scgiPort] = scgiUrl.includes(':') ? scgiUrl.split(':') : [scgiUrl, '5000']

    try {
      const response = await fetch(`http://${scgiHost}:${scgiPort}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'SCGI': '1' },
        body: `CONTENT_LENGTH18\u0000<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName><params></params></methodCall>`,
      })

      if (response.ok) {
        return { success: true, client: 'rTorrent' }
      }
      throw new Error('SCGI request failed')
    }
    catch (e: any) {
      throw createError({ statusCode: 500, message: `Failed to connect to rTorrent: ${e.message}` })
    }
  }

  if (client === 'Deluge') {
    const delugeHost = host || 'localhost'
    const delugePort = port || 58846
    const delugePassword = password || 'admin'

    try {
      const response = await ofetch<{ id: number, result: boolean, error?: string }>(
        `http://${delugeHost}:${delugePort}/json`,
        {
          method: 'POST',
          body: { method: 'auth.login', params: [delugePassword], id: 1 },
        },
      )

      if (!response.error) {
        return { success: true, client: 'Deluge' }
      }
      throw new Error(response.error)
    }
    catch (e: any) {
      throw createError({ statusCode: 500, message: `Failed to connect to Deluge: ${e.message}` })
    }
  }

  throw createError({ statusCode: 400, message: `Unknown client: ${client}` })
})
