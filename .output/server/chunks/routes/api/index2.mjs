import { d as defineEventHandler, g as getRouterParam, b as getHeader, e as readMultipartFormData, r as readBody, a as getQuery, c as createError } from '../../nitro/nitro.mjs';
import { c as createClientAdapter } from '../../_/factory.mjs';
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

async function getSettings() {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n;
  const db = await import('../../_/index.mjs').then((m) => m.default);
  const { settings: settingsTable } = await import('../../_/schema.mjs').then(function (n) { return n.a; }).then((m) => m);
  const rows = await db.select().from(settingsTable).all();
  const result = {};
  for (const row of rows) {
    const parts = row.key.split(".");
    const category = parts[0];
    const key = parts[1];
    if (!category || !key) continue;
    if (!result[category]) result[category] = {};
    result[category][key] = row.value;
  }
  const clientType = ((_a = result.client) == null ? void 0 : _a.type) || "qBittorrent";
  switch (clientType) {
    case "qBittorrent":
      return {
        client: "qBittorrent",
        url: ((_b = result.client) == null ? void 0 : _b.url) || "http://localhost:9090",
        username: ((_c = result.client) == null ? void 0 : _c.username) || "admin",
        password: ((_d = result.client) == null ? void 0 : _d.password) || "pasdemdp"
      };
    case "Transmission":
      return {
        client: "Transmission",
        url: ((_e = result.client) == null ? void 0 : _e.url) || "http://localhost:9091",
        username: ((_f = result.client) == null ? void 0 : _f.username) || "admin",
        password: ((_g = result.client) == null ? void 0 : _g.password) || "admin"
      };
    case "rTorrent":
      return {
        client: "rTorrent",
        url: ((_h = result.client) == null ? void 0 : _h.url) || "http://localhost:8080/scgi"
      };
    case "Deluge":
      return {
        client: "Deluge",
        host: ((_i = result.client) == null ? void 0 : _i.host) || "localhost",
        port: parseInt(((_j = result.client) == null ? void 0 : _j.port) || "58846", 10),
        password: ((_k = result.client) == null ? void 0 : _k.password) || "admin"
      };
    default:
      return {
        client: "qBittorrent",
        url: ((_l = result.client) == null ? void 0 : _l.url) || "http://localhost:9090",
        username: ((_m = result.client) == null ? void 0 : _m.username) || "admin",
        password: ((_n = result.client) == null ? void 0 : _n.password) || "pasdemdp"
      };
  }
}
const index = defineEventHandler(async (event) => {
  var _a, _b;
  const adapter = createClientAdapter(await getSettings());
  const method = event.method;
  if (method === "GET") {
    const hash = getRouterParam(event, "hash");
    if (hash) {
      return await adapter.getTorrentDetails(hash);
    }
    return await adapter.getTorrents();
  }
  if (method === "POST") {
    const contentType = getHeader(event, "content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      const form = await readMultipartFormData(event);
      const file = form == null ? void 0 : form.find((f) => f.name === "torrent");
      if (file == null ? void 0 : file.data) {
        const success = await adapter.addTorrentByFile(Buffer.from(file.data));
        return { success };
      }
    }
    const body = await readBody(event);
    if ((body == null ? void 0 : body.type) === "magnet" || ((_a = body == null ? void 0 : body.url) == null ? void 0 : _a.startsWith("magnet:"))) {
      const url = body.url;
      const success = await adapter.addTorrentByMagnet(url);
      return { success };
    }
    if ((body == null ? void 0 : body.type) === "url" || ((_b = body == null ? void 0 : body.url) == null ? void 0 : _b.startsWith("http"))) {
      const url = body.url;
      const success = await adapter.addTorrentByUrl(url);
      return { success };
    }
    return { success: false, error: "Invalid request" };
  }
  if (method === "PATCH") {
    const hash = getRouterParam(event, "hash");
    const body = await readBody(event);
    if (hash && (body == null ? void 0 : body.action)) {
      switch (body.action) {
        case "start":
          await adapter.startTorrents([hash]);
          break;
        case "stop":
          await adapter.stopTorrents([hash]);
          break;
      }
    }
    return { success: true };
  }
  if (method === "DELETE") {
    const hash = getRouterParam(event, "hash");
    const query = getQuery(event);
    const deleteFiles = query.deleteFiles === "true";
    if (hash) {
      await adapter.deleteTorrents([hash], deleteFiles);
    }
    return { success: true };
  }
  throw createError({
    statusCode: 405,
    message: "Method not allowed"
  });
});

export { index as default };
//# sourceMappingURL=index2.mjs.map
