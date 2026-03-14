import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import * as schema from './schema'
import { readFileSync } from 'node:fs'

let db: ReturnType<typeof drizzle> | null = null

function getDb() {
  if (db) return db
  
  const tursoUrl = process.env.TURSO_URL || 'file:ogawa.db'
  const tursoToken = process.env.TURSO_TOKEN
  
  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken,
  })
  
  db = drizzle(client, { schema })
  return db
}

export { getDb as db }
export default getDb()
