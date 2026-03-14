import { o as ofetch } from '../nitro/nitro.mjs';

var __defProp$3 = Object.defineProperty;
var __defNormalProp$3 = (obj, key, value) => key in obj ? __defProp$3(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$3 = (obj, key, value) => __defNormalProp$3(obj, typeof key !== "symbol" ? key + "" : key, value);
class QBittorrentAdapter {
  constructor(settings) {
    __publicField$3(this, "settings");
    __publicField$3(this, "cookies", null);
    this.settings = settings;
  }
  get baseUrl() {
    return this.settings.url || "http://localhost:8080";
  }
  get auth() {
    return {
      username: this.settings.username || "admin",
      password: this.settings.password || "adminadmin"
    };
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/v2${endpoint}`;
    const headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    };
    if (this.cookies) {
      headers["Cookie"] = this.cookies;
    }
    return ofetch(url, {
      method: options.method || "GET",
      headers,
      body: options.body ? new URLSearchParams(options.body).toString() : void 0
    });
  }
  async ensureAuth() {
    var _a, _b, _c;
    if (this.cookies) return;
    try {
      const response = await ofetch.raw(`${this.baseUrl}/api/v2/auth/login`, {
        method: "POST",
        body: new URLSearchParams({
          username: this.auth.username,
          password: this.auth.password
        }).toString()
      });
      const setCookieHeader = ((_b = (_a = response.headers) == null ? void 0 : _a.get) == null ? void 0 : _b.call(_a, "set-cookie")) || ((_c = response.headers) == null ? void 0 : _c["set-cookie"]);
      if (setCookieHeader) {
        this.cookies = setCookieHeader.split(";")[0];
        console.log("Got cookies:", this.cookies);
      } else {
        console.log("No cookies in response");
      }
    } catch (e) {
      console.error("qBittorrent auth failed:", e);
    }
  }
  async getTorrents() {
    await this.ensureAuth();
    try {
      const response = await this.request("/torrents/info");
      return response.map((t) => ({
        hash: t.hash,
        name: t.name,
        size: t.size,
        completed: t.size > 0 ? Math.floor(t.downloaded / t.size * t.size) : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.dlspeed,
        uploadSpeed: t.upspeed,
        seeds: t.num_seeds,
        peers: t.num_leechs,
        state: this.mapState(t.state),
        addedAt: t.added_on * 1e3,
        doneAt: t.completion_on > 0 ? t.completion_on * 1e3 : null,
        ratio: t.ratio
      }));
    } catch (e) {
      console.error("Failed to fetch torrents:", e);
      return [];
    }
  }
  async getTorrentDetails(hash) {
    await this.ensureAuth();
    try {
      const torrents = await this.request("/torrents/info", {
        method: "POST",
        body: { hashes: hash }
      });
      const t = torrents[0];
      if (!t) return null;
      const files = await this.request("/torrents/files", {
        method: "POST",
        body: { hash }
      });
      return {
        hash: t.hash,
        name: t.name,
        size: t.size,
        completed: t.size > 0 ? Math.floor(t.downloaded / t.size * t.size) : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.dlspeed,
        uploadSpeed: t.upspeed,
        seeds: t.num_seeds,
        peers: t.num_leechs,
        state: this.mapState(t.state),
        addedAt: t.added_on * 1e3,
        doneAt: t.completion_on > 0 ? t.completion_on * 1e3 : null,
        ratio: t.ratio,
        files: files.map((f) => ({
          name: f.name,
          size: f.size,
          completed: f.completed,
          priority: this.mapPriority(f.priority)
        })),
        trackers: []
      };
    } catch (e) {
      console.error("Failed to fetch torrent details:", e);
      return null;
    }
  }
  async addTorrentByFile(file) {
    await this.ensureAuth();
    try {
      const formData = new FormData();
      const uint8Array = new Uint8Array(file);
      formData.append("torrentfile", new Blob([uint8Array]), "torrent.torrent");
      await ofetch(`${this.baseUrl}/api/v2/torrents/add`, {
        method: "POST",
        body: formData
      });
      return true;
    } catch (e) {
      console.error("Failed to add torrent:", e);
      return false;
    }
  }
  async addTorrentByUrl(url) {
    await this.ensureAuth();
    try {
      await this.request("/torrents/add", {
        method: "POST",
        body: { urls: url }
      });
      return true;
    } catch (e) {
      console.error("Failed to add torrent from URL:", e);
      return false;
    }
  }
  async addTorrentByMagnet(magnet) {
    return this.addTorrentByUrl(magnet);
  }
  async startTorrents(hashes) {
    await this.ensureAuth();
    try {
      await this.request("/torrents/start", {
        method: "POST",
        body: { hashes: hashes.join("|") }
      });
      return true;
    } catch (e) {
      console.error("Failed to start torrents:", e);
      return false;
    }
  }
  async stopTorrents(hashes) {
    await this.ensureAuth();
    try {
      await this.request("/torrents/stop", {
        method: "POST",
        body: { hashes: hashes.join("|") }
      });
      return true;
    } catch (e) {
      console.error("Failed to stop torrents:", e);
      return false;
    }
  }
  async deleteTorrents(hashes, deleteFiles = false) {
    await this.ensureAuth();
    try {
      await this.request("/torrents/delete", {
        method: "POST",
        body: {
          hashes: hashes.join("|"),
          deleteFiles: deleteFiles ? "true" : "false"
        }
      });
      return true;
    } catch (e) {
      console.error("Failed to delete torrents:", e);
      return false;
    }
  }
  async testConnection() {
    try {
      await ofetch(`${this.baseUrl}/api/v2/app/version`);
      return true;
    } catch (e) {
      return false;
    }
  }
  mapState(state) {
    const stateMap = {
      downloading: "downloading",
      seeding: "seeding",
      pausedUP: "seeding",
      pausedDL: "paused",
      stopped: "stopped",
      error: "error",
      queued: "stopped",
      uploading: "seeding",
      forcedUP: "seeding",
      forcedDL: "downloading"
    };
    return stateMap[state] || "stopped";
  }
  mapPriority(priority) {
    if (priority === 0) return "skip";
    if (priority === 1) return "low";
    if (priority === 2) return "normal";
    if (priority === 4) return "high";
    return "normal";
  }
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, key + "" , value);
class RTorrentAdapter {
  constructor(settings) {
    __publicField$2(this, "settings");
    this.settings = settings;
  }
  get baseUrl() {
    return this.settings.url || "http://localhost:8080";
  }
  async getTorrents() {
    try {
      const response = await ofetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `<?xml version="1.0"?>
<methodCall>
  <methodName>download_list</methodName>
  <params>
    <param><value><string>all</string></value></param>
  </params>
</methodCall>`
      });
      return [];
    } catch (e) {
      console.error("Failed to fetch rTorrent torrents:", e);
      return [];
    }
  }
  async getTorrentDetails(_hash) {
    return null;
  }
  async addTorrentByFile(_file) {
    console.error("rTorrent: addTorrentByFile not implemented - requires SCGI protocol");
    return false;
  }
  async addTorrentByUrl(_url) {
    console.error("rTorrent: addTorrentByUrl not implemented - requires SCGI protocol");
    return false;
  }
  async addTorrentByMagnet(_magnet) {
    console.error("rTorrent: addTorrentByMagnet not implemented - requires SCGI protocol");
    return false;
  }
  async startTorrents(_hashes) {
    console.error("rTorrent: startTorrents not implemented - requires SCGI protocol");
    return false;
  }
  async stopTorrents(_hashes) {
    console.error("rTorrent: stopTorrents not implemented - requires SCGI protocol");
    return false;
  }
  async deleteTorrents(_hashes, _deleteFiles) {
    console.error("rTorrent: deleteTorrents not implemented - requires SCGI protocol");
    return false;
  }
  async testConnection() {
    try {
      await ofetch(this.baseUrl, {
        method: "POST",
        body: '<?xml version="1.0"?><methodCall><methodName>system.listMethods</methodName></methodCall>',
        timeout: 5e3
      });
      return true;
    } catch {
      return false;
    }
  }
}

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, typeof key !== "symbol" ? key + "" : key, value);
class TransmissionAdapter {
  constructor(settings) {
    __publicField$1(this, "settings");
    __publicField$1(this, "sessionId", null);
    this.settings = settings;
  }
  get baseUrl() {
    return this.settings.url || "http://localhost:9091";
  }
  get auth() {
    return {
      username: this.settings.username || "admin",
      password: this.settings.password || "admin"
    };
  }
  async request(method, args = {}) {
    var _a, _b, _c;
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.sessionId) {
      headers["X-Transmission-Session-Id"] = this.sessionId;
    }
    try {
      const response = await ofetch(`${this.baseUrl}/transmission/rpc`, {
        method: "POST",
        headers,
        body: {
          method,
          arguments: args
        }
      });
      return response.arguments;
    } catch (e) {
      if (((_a = e.response) == null ? void 0 : _a.status) === 409 && ((_c = (_b = e.response) == null ? void 0 : _b.headers) == null ? void 0 : _c["x-transmission-session-id"])) {
        this.sessionId = e.response.headers["x-transmission-session-id"];
        return this.request(method, args);
      }
      throw e;
    }
  }
  async getTorrents() {
    try {
      const result = await this.request("torrent-get", {
        fields: [
          "id",
          "hashString",
          "name",
          "totalSize",
          "downloadedEver",
          "uploadedEver",
          "rateDownload",
          "rateUpload",
          "seedersConnected",
          "peersConnected",
          "status",
          "dateAdded",
          "doneDate",
          "uploadRatio"
        ]
      });
      return result.torrents.map((t) => ({
        hash: t.hashString,
        name: t.name,
        size: t.totalSize,
        completed: t.doneDate > 0 ? t.totalSize : 0,
        downloaded: t.downloadedEver,
        uploaded: t.uploadedEver,
        downloadSpeed: t.rateDownload,
        uploadSpeed: t.rateUpload,
        seeds: t.seedersConnected,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.dateAdded * 1e3,
        doneAt: t.doneDate > 0 ? t.doneDate * 1e3 : null,
        ratio: t.uploadRatio
      }));
    } catch (e) {
      console.error("Failed to fetch Transmission torrents:", e);
      return [];
    }
  }
  async getTorrentDetails(hash) {
    try {
      const result = await this.request("torrent-get", {
        ids: [hash],
        fields: [
          "id",
          "hashString",
          "name",
          "totalSize",
          "downloadedEver",
          "uploadedEver",
          "rateDownload",
          "rateUpload",
          "seedersConnected",
          "peersConnected",
          "status",
          "dateAdded",
          "doneDate",
          "uploadRatio",
          "files",
          "trackers"
        ]
      });
      const t = result.torrents[0];
      if (!t) return null;
      return {
        hash: t.hashString,
        name: t.name,
        size: t.totalSize,
        completed: t.doneDate > 0 ? t.totalSize : 0,
        downloaded: t.downloadedEver,
        uploaded: t.uploadedEver,
        downloadSpeed: t.rateDownload,
        uploadSpeed: t.rateUpload,
        seeds: t.seedersConnected,
        peers: t.peersConnected,
        state: this.mapStatus(t.status),
        addedAt: t.dateAdded * 1e3,
        doneAt: t.doneDate > 0 ? t.doneDate * 1e3 : null,
        ratio: t.uploadRatio,
        files: (t.files || []).map((f) => ({
          name: f.name,
          size: f.length,
          completed: f.bytesCompleted,
          priority: this.mapPriority(f.priority)
        })),
        trackers: (t.trackers || []).map((t2) => t2.announceUrl)
      };
    } catch (e) {
      console.error("Failed to fetch Transmission torrent details:", e);
      return null;
    }
  }
  async addTorrentByFile(file) {
    try {
      const base64 = Buffer.from(file).toString("base64");
      await this.request("torrent-add", {
        metainfo: base64
      });
      return true;
    } catch (e) {
      console.error("Failed to add Transmission torrent:", e);
      return false;
    }
  }
  async addTorrentByUrl(url) {
    try {
      await this.request("torrent-add", {
        filename: url
      });
      return true;
    } catch (e) {
      console.error("Failed to add Transmission torrent from URL:", e);
      return false;
    }
  }
  async addTorrentByMagnet(magnet) {
    return this.addTorrentByUrl(magnet);
  }
  async startTorrents(hashes) {
    try {
      await this.request("torrent-start", {
        ids: hashes
      });
      return true;
    } catch (e) {
      console.error("Failed to start Transmission torrents:", e);
      return false;
    }
  }
  async stopTorrents(hashes) {
    try {
      await this.request("torrent-stop", {
        ids: hashes
      });
      return true;
    } catch (e) {
      console.error("Failed to stop Transmission torrents:", e);
      return false;
    }
  }
  async deleteTorrents(hashes, deleteFiles) {
    try {
      await this.request("torrent-remove", {
        ids: hashes,
        "delete-local-data": deleteFiles
      });
      return true;
    } catch (e) {
      console.error("Failed to delete Transmission torrents:", e);
      return false;
    }
  }
  async testConnection() {
    try {
      await this.request("session-get");
      return true;
    } catch {
      return false;
    }
  }
  mapStatus(status) {
    const statusMap = {
      0: "stopped",
      1: "downloading",
      2: "downloading",
      3: "seeding",
      4: "seeding"
    };
    return statusMap[status] || "stopped";
  }
  mapPriority(priority) {
    if (priority === -1) return "low";
    if (priority === 1) return "high";
    return "normal";
  }
}

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class DelugeAdapter {
  constructor(settings) {
    __publicField(this, "settings");
    this.settings = settings;
  }
  get connection() {
    return {
      host: this.settings.host || "localhost",
      port: this.settings.port || 58846,
      password: this.settings.password || "admin"
    };
  }
  async request(method, params = []) {
    const response = await ofetch("http://localhost:8112/json", {
      method: "POST",
      body: {
        method,
        params,
        id: 1
      }
    });
    if (response.error) {
      throw new Error(response.error);
    }
    return response.result;
  }
  async getTorrents() {
    try {
      const result = await this.request("core.get_torrents_status", [{}, [
        "hash",
        "name",
        "total_size",
        "downloaded",
        "uploaded",
        "download_payload_rate",
        "upload_payload_rate",
        "num_seeds",
        "num_peers",
        "state",
        "time_added",
        "completed_time",
        "ratio"
      ]]);
      return result.map((t) => ({
        hash: t.hash,
        name: t.name,
        size: t.total_size,
        completed: t.completed_time > 0 ? t.total_size : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.download_payload_rate,
        uploadSpeed: t.upload_payload_rate,
        seeds: t.num_seeds,
        peers: t.num_peers,
        state: this.mapState(t.state),
        addedAt: t.time_added * 1e3,
        doneAt: t.completed_time > 0 ? t.completed_time * 1e3 : null,
        ratio: t.ratio
      }));
    } catch (e) {
      console.error("Failed to fetch Deluge torrents:", e);
      return [];
    }
  }
  async getTorrentDetails(hash) {
    try {
      const result = await this.request("core.get_torrents_status", [[hash], [
        "hash",
        "name",
        "total_size",
        "downloaded",
        "uploaded",
        "download_payload_rate",
        "upload_payload_rate",
        "num_seeds",
        "num_peers",
        "state",
        "time_added",
        "completed_time",
        "ratio",
        "files",
        "trackers"
      ]]);
      const t = result[0];
      if (!t) return null;
      return {
        hash: t.hash,
        name: t.name,
        size: t.total_size,
        completed: t.completed_time > 0 ? t.total_size : 0,
        downloaded: t.downloaded,
        uploaded: t.uploaded,
        downloadSpeed: t.download_payload_rate,
        uploadSpeed: t.upload_payload_rate,
        seeds: t.num_seeds,
        peers: t.num_peers,
        state: this.mapState(t.state),
        addedAt: t.time_added * 1e3,
        doneAt: t.completed_time > 0 ? t.completed_time * 1e3 : null,
        ratio: t.ratio,
        files: (t.files || []).map((f) => ({
          name: f.path,
          size: f.size,
          completed: Math.floor(f.size * f.progress),
          priority: this.mapPriority(f.priority)
        })),
        trackers: (t.trackers || []).map((tr) => tr.url)
      };
    } catch (e) {
      console.error("Failed to fetch Deluge torrent details:", e);
      return null;
    }
  }
  async addTorrentByFile(file) {
    try {
      const base64 = Buffer.from(file).toString("base64");
      await this.request("core.add_torrent_file", ["torrent.torrent", base64, {}]);
      return true;
    } catch (e) {
      console.error("Failed to add Deluge torrent:", e);
      return false;
    }
  }
  async addTorrentByUrl(url) {
    try {
      await this.request("core.add_torrent_url", [url, {}]);
      return true;
    } catch (e) {
      console.error("Failed to add Deluge torrent from URL:", e);
      return false;
    }
  }
  async addTorrentByMagnet(magnet) {
    try {
      await this.request("core.add_torrent_url", [magnet, {}]);
      return true;
    } catch (e) {
      console.error("Failed to add Deluge magnet:", e);
      return false;
    }
  }
  async startTorrents(hashes) {
    try {
      await this.request("core.resume_torrents", [hashes]);
      return true;
    } catch (e) {
      console.error("Failed to start Deluge torrents:", e);
      return false;
    }
  }
  async stopTorrents(hashes) {
    try {
      await this.request("core.pause_torrents", [hashes]);
      return true;
    } catch (e) {
      console.error("Failed to pause Deluge torrents:", e);
      return false;
    }
  }
  async deleteTorrents(hashes, deleteFiles) {
    try {
      await this.request("core.remove_torrents", [hashes, deleteFiles]);
      return true;
    } catch (e) {
      console.error("Failed to delete Deluge torrents:", e);
      return false;
    }
  }
  async testConnection() {
    try {
      await this.request("web.get_host_status");
      return true;
    } catch {
      return false;
    }
  }
  mapState(state) {
    const stateMap = {
      Downloading: "downloading",
      Seeding: "seeding",
      Paused: "paused",
      Stopped: "stopped",
      Error: "error",
      Queued: "stopped"
    };
    return stateMap[state] || "stopped";
  }
  mapPriority(priority) {
    if (priority === 0) return "skip";
    if (priority === 1) return "low";
    if (priority === 4) return "high";
    return "normal";
  }
}

let cachedAdapter = null;
let cachedSettings = null;
function createClientAdapter(settings) {
  const settingsKey = JSON.stringify(settings);
  if (cachedAdapter && cachedSettings === settingsKey) {
    return cachedAdapter;
  }
  const adapter = createAdapter(settings);
  cachedAdapter = adapter;
  cachedSettings = settingsKey;
  return adapter;
}
function createAdapter(settings) {
  switch (settings.client) {
    case "qBittorrent":
      return new QBittorrentAdapter(settings);
    case "rTorrent":
      return new RTorrentAdapter(settings);
    case "Transmission":
      return new TransmissionAdapter(settings);
    case "Deluge":
      return new DelugeAdapter(settings);
    default:
      throw new Error(`Unsupported torrent client: ${settings.client}`);
  }
}

export { createClientAdapter as c };
//# sourceMappingURL=factory.mjs.map
