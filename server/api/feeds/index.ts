import db from '../../../db'
import { feeds, feedItems } from '../../../db/schema'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const rows = await db.select().from(feeds).all()
    return rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      lastUpdated: row.lastUpdated,
      items: [],
    }))
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const url = body?.url

    if (!url) {
      throw createError({
        statusCode: 400,
        message: 'URL is required',
      })
    }

    const id = await db.insert(feeds).values({
      url,
      title: url,
      createdAt: new Date(),
    }).run()

    return { success: true, id }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
