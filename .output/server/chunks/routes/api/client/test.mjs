import { d as defineEventHandler, r as readBody, c as createError, o as ofetch } from '../../../nitro/nitro.mjs';
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

const test = defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = body == null ? void 0 : body.url;
  body == null ? void 0 : body.username;
  body == null ? void 0 : body.password;
  if (!url) {
    throw createError({
      statusCode: 400,
      message: "URL is required"
    });
  }
  try {
    const response = await ofetch(`${url}/api/v2/app/version`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });
    return { success: true, version: response };
  } catch (e) {
    throw createError({
      statusCode: 500,
      message: "Failed to connect to qBittorrent"
    });
  }
});

export { test as default };
//# sourceMappingURL=test.mjs.map
