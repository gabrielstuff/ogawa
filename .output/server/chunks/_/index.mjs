import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { a as schema } from './schema.mjs';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';

let db = null;
function getDb() {
  if (db) return db;
  const tursoUrl = process.env.TURSO_URL || "file:ogawa.db";
  const tursoToken = process.env.TURSO_TOKEN;
  const client = createClient({
    url: tursoUrl,
    authToken: tursoToken
  });
  db = drizzle(client, { schema });
  return db;
}
const db$1 = getDb();

export { getDb as db, db$1 as default };
//# sourceMappingURL=index.mjs.map
