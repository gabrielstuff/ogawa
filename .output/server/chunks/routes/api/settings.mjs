import { d as defineEventHandler, r as readBody, c as createError } from '../../nitro/nitro.mjs';
import db from '../../_/index.mjs';
import { s as settings$1 } from '../../_/schema.mjs';
import { eq } from 'drizzle-orm';
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

const settings = defineEventHandler(async (event) => {
  const method = event.method;
  if (method === "GET") {
    const rows = await db.select().from(settings$1).all();
    const result = {};
    for (const row of rows) {
      const parts = row.key.split(".");
      const category = parts[0];
      const key = parts[1];
      if (!category || !key) continue;
      if (!result[category]) result[category] = {};
      if (["itemsPerPage", "maxActive", "downloadSpeedLimit", "uploadSpeedLimit"].includes(key)) {
        result[category][key] = parseInt(row.value, 10) || 0;
      } else {
        result[category][key] = row.value;
      }
    }
    return result;
  }
  if (method === "PATCH" || method === "POST") {
    const body = await readBody(event);
    if (body) {
      for (const [category, values] of Object.entries(body)) {
        if (typeof values !== "object" || values === null) continue;
        for (const [key, value] of Object.entries(values)) {
          const settingKey = `${category}.${key}`;
          const stringValue = String(value != null ? value : "");
          await db.update(settings$1).set({ value: stringValue, updatedAt: /* @__PURE__ */ new Date() }).where(eq(settings$1.key, settingKey)).run();
        }
      }
    }
    return { success: true };
  }
  throw createError({
    statusCode: 405,
    message: "Method not allowed"
  });
});

export { settings as default };
//# sourceMappingURL=settings.mjs.map
