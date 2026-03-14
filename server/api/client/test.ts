import { ofetch } from 'ofetch'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const url = body?.url
  const username = body?.username
  const password = body?.password

  if (!url) {
    throw createError({
      statusCode: 400,
      message: 'URL is required',
    })
  }

  try {
    // Try to get the qBittorrent version
    const response = await ofetch(`${url}/api/v2/app/version`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })

    return { success: true, version: response }
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: 'Failed to connect to qBittorrent',
    })
  }
})
