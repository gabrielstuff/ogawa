import db from '../../db'
import { settings } from '../../db/schema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const method = event.method

  if (method === 'GET') {
    const rows = await db.select().from(settings).all()

    const result: Record<string, any> = {}
    for (const row of rows) {
      const parts = row.key.split('.')
      const category = parts[0]
      const key = parts[1]
      if (!category || !key) continue
      if (!result[category]) result[category] = {}

      // Parse values that should be numbers
      if (['itemsPerPage', 'maxActive', 'downloadSpeedLimit', 'uploadSpeedLimit'].includes(key)) {
        result[category][key] = parseInt(row.value, 10) || 0
      }
      else {
        result[category][key] = row.value
      }
    }

    return result
  }

  if (method === 'PATCH' || method === 'POST') {
    const body = await readBody(event)

    if (body) {
      for (const [category, values] of Object.entries(body)) {
        if (typeof values !== 'object' || values === null) continue

        for (const [key, value] of Object.entries(values as Record<string, any>)) {
          const settingKey = `${category}.${key}`
          const stringValue = String(value ?? '')

          await db.update(settings)
            .set({ value: stringValue, updatedAt: new Date() })
            .where(eq(settings.key, settingKey))
            .run()
        }
      }
    }

    return { success: true }
  }

  throw createError({
    statusCode: 405,
    message: 'Method not allowed',
  })
})
