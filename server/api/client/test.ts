import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const client = body?.client || 'qBittorrent'
  const url = body?.url
  const username = body?.username
  const password = body?.password
  const host = body?.host
  const port = body?.port

  if (client === 'qBittorrent') {
    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required for qBittorrent',
      })
    }

    try {
      await ofetch(`${url}/api/v2/app/version`, {
        method: 'GET',
      })
      return { success: true, client: 'qBittorrent' }
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        message: 'Failed to connect to qBittorrent',
      })
    }
  }

  if (client === 'Transmission') {
    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required for Transmission',
      })
    }

    try {
      const response = await ofetch<{ result: string }>(`${url}/transmission/rpc`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          method: 'session-get',
          arguments: {},
        },
      })

      if (response.result === 'success') {
        return { success: true, client: 'Transmission' }
      }
      throw new Error('Invalid response')
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        message: 'Failed to connect to Transmission',
      })
    }
  }

  if (client === 'rTorrent') {
    const scgiUrl = url || 'localhost:5000'
    const [scgiHost, scgiPort] = scgiUrl.includes(':') ? scgiUrl.split(':') : [scgiUrl, '5000']

    try {
      const response = await fetch(`http://${scgiHost}:${scgiPort}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'SCGI': '1',
        },
        body: `CONTENT_LENGTH18\u0000<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName><params></params></methodCall>`,
      })

      if (response.ok) {
        return { success: true, client: 'rTorrent' }
      }
      throw new Error('SCGI request failed')
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        message: 'Failed to connect to rTorrent',
      })
    }
  }

  if (client === 'Deluge') {
    const delugeHost = host || 'localhost'
    const delugePort = port || 58846
    const delugePassword = password || 'admin'

    try {
      const response = await ofetch<{ id: number, result: string, error?: string }>(`http://${delugeHost}:${delugePort}/json`, {
        method: 'POST',
        body: {
          method: 'auth.login',
          params: [delugePassword],
          id: 1,
        },
      })

      if (!response.error) {
        return { success: true, client: 'Deluge' }
      }
      throw new Error(response.error)
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        message: 'Failed to connect to Deluge',
      })
    }
  }

  throw createError({
    statusCode: 400,
    message: `Unknown client: ${client}`,
  })
})
