import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import db from '../../_/index.mjs';
import { f as feeds } from '../../_/schema.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'vue-router';
import 'node:url';
import '@iconify/utils';
import 'consola';
import 'drizzle-orm/libsql';
import '@libsql/client';
import 'drizzle-orm/sqlite-core';
import 'drizzle-orm';

const index = defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    const rows = await db.select().from(feeds).all();
    return rows.map((row) => ({
      id: row.id,
      url: row.url,
      title: row.title,
      lastUpdated: row.lastUpdated,
      items: []
    }));
  }
  if (method === "POST") {
    const body = await readBody(event);
    const url = body == null ? void 0 : body.url;
    if (!url) {
      throw createError({
        statusCode: 400,
        message: "URL is required"
      });
    }
    const id = await db.insert(feeds).values({
      url,
      title: url,
      createdAt: /* @__PURE__ */ new Date()
    }).run();
    return { success: true, id };
  }
  throw createError({
    statusCode: 405,
    message: "Method not allowed"
  });
});

export { index as default };
//# sourceMappingURL=index.mjs.map
