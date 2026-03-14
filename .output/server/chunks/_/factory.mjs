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
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
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
      await this.ensureAuth();
      await this.request("/app/version");
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
  get scgiUrl() {
    const url = this.settings.url || "localhost:5000";
    if (url.startsWith("scgi://")) {
      return url;
    }
    return `scgi://${url}`;
  }
  async scgiRequest(method, params = []) {
    const scgiHost = this.scgiUrl.replace("scgi://", "");
    const [host, port] = scgiHost.includes(":") ? scgiHost.split(":") : [scgiHost, "5000"];
    const requestBody = this.buildScgiRequest(method, params);
    const response = await fetch(`http://${host}:${port}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "SCGI": "1"
      },
      body: requestBody
    });
    if (!response.ok) {
      throw new Error(`SCGI request failed: ${response.status}`);
    }
    const text = await response.text();
    return this.parseXmlRpcResponse(text);
  }
  buildScgiRequest(method, params) {
    let content = `<?xml version="1.0"?><methodCall><methodName>${method}</methodName><params>`;
    for (const param of params) {
      content += `<param><value><string>${this.escapeXml(param)}</string></value></param>`;
    }
    content += "</params></methodCall>";
    const contentLength = Buffer.byteLength(content);
    return `CONTENT_LENGTH${contentLength}\0${content}`;
  }
  escapeXml(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
  }
  parseXmlRpcResponse(xml) {
    try {
      const getValue = (str) => {
        const stringMatch = str.match(/<string>(.*?)<\/string>/);
        if (stringMatch && stringMatch[1]) return stringMatch[1];
        const intMatch = str.match(/<int>(.*?)<\/int>/);
        if (intMatch && intMatch[1]) return parseInt(intMatch[1], 10);
        const doubleMatch = str.match(/<double>(.*?)<\/double>/);
        if (doubleMatch && doubleMatch[1]) return parseFloat(doubleMatch[1]);
        const booleanMatch = str.match(/<boolean>(.*?)<\/boolean>/);
        if (booleanMatch && booleanMatch[1]) return booleanMatch[1] === "1";
        const arrayMatch = str.match(/<array><data>(.*?)<\/data><\/array>/);
        if (arrayMatch && arrayMatch[1]) {
          const items = arrayMatch[1].match(/<value>.*?<\/value>/g) || [];
          return items.map((item) => getValue(item));
        }
        return str;
      };
      const paramsMatch = xml.match(/<params>(.*?)<\/params>/s);
      if (paramsMatch && paramsMatch[1]) {
        const values = paramsMatch[1].match(/<value>.*?<\/value>/g) || [];
        return values.map((v) => getValue(v));
      }
      return null;
    } catch (e) {
      console.error("Failed to parse XML-RPC response:", e);
      return null;
    }
  }
  async getTorrents() {
    try {
      const result = await this.scgiRequest("download_list", ["main"]);
      const hashes = Array.isArray(result) ? result : [];
      if (hashes.length === 0) return [];
      const torrents = [];
      for (const hash of hashes) {
        const details = await this.getTorrentByHash(hash);
        if (details) {
          torrents.push(details);
        }
      }
      return torrents;
    } catch (e) {
      console.error("Failed to fetch rTorrent torrents:", e);
      return [];
    }
  }
  async getTorrentByHash(hash) {
    try {
      const baseParams = [
        `d.get_hash=${hash}`,
        `d.get_name=${hash}`,
        `d.get_size_bytes=${hash}`,
        `d.get_bytes_done=${hash}`,
        `d.get_up_total=${hash}`,
        `d.get_down_rate=${hash}`,
        `d.get_up_rate=${hash}`,
        `d.get_seeders=${hash}`,
        `d.get_leechers=${hash}`,
        `d.get_state=${hash}`,
        `d.get_open=${hash}`,
        `d.is_hash_checking=${hash}`,
        `d.is_uploading=${hash}`,
        `d.is_downloading=${hash}`,
        `d.get_ratio=${hash}`,
        `d.get_creation_date=${hash}`,
        `d.get_completion_on=${hash}`,
        `d.get_left_bytes=${hash}`
      ];
      const result = await this.scgiRequest("system.multicall", [baseParams.map((p) => `(${p})`).join("")]);
      if (!result || !Array.isArray(result) || result.length === 0) {
        return null;
      }
      const data = Array.isArray(result[0]) ? result[0] : [];
      if (data.length < 18) return null;
      const [rtHash, name, size, downloaded, uploaded, downRate, upRate, seeds, peers, state, isOpen, isHashing, isUploading, isDownloading, ratio, addedOn, completedOn, left] = data;
      return {
        hash: rtHash,
        name: name || "Unknown",
        size: size || 0,
        completed: (size || 0) - (left || 0),
        downloaded: downloaded || 0,
        uploaded: uploaded || 0,
        downloadSpeed: downRate || 0,
        uploadSpeed: upRate || 0,
        seeds: seeds || 0,
        peers: peers || 0,
        state: this.mapState(state, isOpen, isHashing, isUploading, isDownloading),
        addedAt: addedOn ? addedOn * 1e3 : Date.now(),
        doneAt: completedOn ? completedOn * 1e3 : null,
        ratio: ratio || 0
      };
    } catch (e) {
      console.error(`Failed to fetch rTorrent torrent ${hash}:`, e);
      return null;
    }
  }
  async getTorrentDetails(hash) {
    const torrent = await this.getTorrentByHash(hash);
    if (!torrent) return null;
    try {
      const filesParams = [
        `d.get_hash=${hash}`,
        `f.get_path=${hash}`,
        `f.get_size_bytes=${hash}`,
        `f.get_completed_bytes=${hash}`,
        `f.get_priority=${hash}`
      ];
      const filesResult = await this.scgiRequest("system.multicall", [filesParams.map((p) => `(${p})`).join("")]);
      let files = [];
      if (filesResult && Array.isArray(filesResult) && Array.isArray(filesResult[0])) {
        const fileData = filesResult[0];
        files = fileData.map((fileArr) => {
          const [path, size, completed, priority] = fileArr;
          return {
            name: String(path || ""),
            size: Number(size || 0),
            completed: Number(completed || 0),
            priority: this.mapPriority(Number(priority))
          };
        });
      }
      return {
        ...torrent,
        files,
        trackers: []
      };
    } catch (e) {
      console.error(`Failed to fetch rTorrent torrent details ${hash}:`, e);
      return null;
    }
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
  async startTorrents(hashes) {
    try {
      for (const hash of hashes) {
        await this.scgiRequest("d.open", [hash]);
        await this.scgiRequest("d.start", [hash]);
      }
      return true;
    } catch (e) {
      console.error("Failed to start rTorrent torrents:", e);
      return false;
    }
  }
  async stopTorrents(hashes) {
    try {
      for (const hash of hashes) {
        await this.scgiRequest("d.stop", [hash]);
        await this.scgiRequest("d.close", [hash]);
      }
      return true;
    } catch (e) {
      console.error("Failed to stop rTorrent torrents:", e);
      return false;
    }
  }
  async deleteTorrents(hashes, _deleteFiles) {
    try {
      for (const hash of hashes) {
        await this.scgiRequest("d.stop", [hash]);
        await this.scgiRequest("d.close", [hash]);
        await this.scgiRequest("d.erase", [hash]);
      }
      return true;
    } catch (e) {
      console.error("Failed to delete rTorrent torrents:", e);
      return false;
    }
  }
  async testConnection() {
    try {
      const result = await this.scgiRequest("system.listMethods", []);
      return result !== null;
    } catch {
      return false;
    }
  }
  mapState(state, isOpen, isHashing, isUploading, isDownloading) {
    if (!isOpen) return "stopped";
    if (isHashing) return "downloading";
    if (isDownloading) return "downloading";
    if (isUploading) return "seeding";
    return "stopped";
  }
  mapPriority(priority) {
    if (priority === 0) return "skip";
    if (priority === 1) return "low";
    if (priority === 2) return "normal";
    if (priority === 3) return "high";
    return "normal";
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
    var _a, _b, _c, _d, _e, _f;
    const headers = {
      "Content-Type": "application/json"
    };
    if (this.sessionId) {
      headers["X-Transmission-Session-Id"] = this.sessionId;
    }
    if (this.auth.username && this.auth.password) {
      const credentials = Buffer.from(`${this.auth.username}:${this.auth.password}`).toString("base64");
      headers["Authorization"] = `Basic ${credentials}`;
    }
    const body = {
      jsonrpc: "2.0",
      method,
      params: args,
      id: 1
    };
    try {
      const response = await ofetch(`${this.baseUrl}/transmission/rpc`, {
        method: "POST",
        headers,
        body
      });
      if (response.error) {
        throw new Error(response.error.message || "Transmission error");
      }
      return response.result;
    } catch (e) {
      if (((_a = e.response) == null ? void 0 : _a.status) === 409) {
        const sessionHeader = ((_c = (_b = e.response) == null ? void 0 : _b.headers) == null ? void 0 : _c["x-transmission-session-id"]) || ((_f = (_e = (_d = e.response) == null ? void 0 : _d.headers) == null ? void 0 : _e.get) == null ? void 0 : _f.call(_e, "x-transmission-session-id"));
        if (sessionHeader) {
          this.sessionId = sessionHeader;
          return this.request(method, args);
        }
      }
      throw e;
    }
  }
  async getTorrents() {
    try {
      const result = await this.request("torrent_get", {
        fields: [
          "id",
          "hash_string",
          "name",
          "total_size",
          "downloaded_ever",
          "uploaded_ever",
          "rate_download",
          "rate_upload",
          "seeds_connected",
          "peers_connected",
          "status",
          "date_added",
          "done_date",
          "upload_ratio"
        ]
      });
      if (!(result == null ? void 0 : result.torrents)) {
        return [];
      }
      return result.torrents.map((t) => ({
        hash: t.hash_string,
        name: t.name,
        size: t.total_size,
        completed: t.done_date > 0 ? t.total_size : 0,
        downloaded: t.downloaded_ever,
        uploaded: t.uploaded_ever,
        downloadSpeed: t.rate_download,
        uploadSpeed: t.rate_upload,
        seeds: t.seeds_connected,
        peers: t.peers_connected,
        state: this.mapStatus(t.status),
        addedAt: t.date_added * 1e3,
        doneAt: t.done_date > 0 ? t.done_date * 1e3 : null,
        ratio: t.upload_ratio
      }));
    } catch (e) {
      console.error("Failed to fetch Transmission torrents:", e);
      return [];
    }
  }
  async getTorrentDetails(hash) {
    var _a;
    try {
      const result = await this.request("torrent_get", {
        ids: [hash],
        fields: [
          "id",
          "hash_string",
          "name",
          "total_size",
          "downloaded_ever",
          "uploaded_ever",
          "rate_download",
          "rate_upload",
          "seeds_connected",
          "peers_connected",
          "status",
          "date_added",
          "done_date",
          "upload_ratio",
          "files",
          "trackers"
        ]
      });
      const t = (_a = result.torrents) == null ? void 0 : _a[0];
      if (!t) return null;
      return {
        hash: t.hash_string,
        name: t.name,
        size: t.total_size,
        completed: t.done_date > 0 ? t.total_size : 0,
        downloaded: t.downloaded_ever,
        uploaded: t.uploaded_ever,
        downloadSpeed: t.rate_download,
        uploadSpeed: t.rate_upload,
        seeds: t.seeds_connected,
        peers: t.peers_connected,
        state: this.mapStatus(t.status),
        addedAt: t.date_added * 1e3,
        doneAt: t.done_date > 0 ? t.done_date * 1e3 : null,
        ratio: t.upload_ratio,
        files: (t.files || []).map((f) => ({
          name: f.name,
          size: f.length,
          completed: f.bytes_completed,
          priority: this.mapPriority(f.priority)
        })),
        trackers: (t.trackers || []).map((tr) => tr.announce)
      };
    } catch (e) {
      console.error("Failed to fetch Transmission torrent details:", e);
      return null;
    }
  }
  async addTorrentByFile(file) {
    try {
      const base64 = Buffer.from(file).toString("base64");
      await this.request("torrent_add", {
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
      await this.request("torrent_add", {
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
      await this.request("torrent_start", {
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
      await this.request("torrent_stop", {
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
      await this.request("torrent_remove", {
        "ids": hashes,
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
      await this.request("session_get", {});
      return true;
    } catch (e) {
      console.error("Transmission connection test failed:", e);
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
    const { host, port, password } = this.connection;
    const url = `http://${host}:${port}/json`;
    try {
      const response = await ofetch(url, {
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
    } catch (e) {
      console.error("Deluge request failed:", e);
      throw e;
    }
  }
  async ensureAuth() {
    const { password } = this.connection;
    try {
      await this.request("auth.login", [password]);
    } catch (e) {
      console.error("Deluge auth failed:", e);
    }
  }
  async getTorrents() {
    await this.ensureAuth();
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
    await this.ensureAuth();
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
    await this.ensureAuth();
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
    await this.ensureAuth();
    try {
      await this.request("core.add_torrent_url", [url, {}]);
      return true;
    } catch (e) {
      console.error("Failed to add Deluge torrent from URL:", e);
      return false;
    }
  }
  async addTorrentByMagnet(magnet) {
    await this.ensureAuth();
    try {
      await this.request("core.add_torrent_url", [magnet, {}]);
      return true;
    } catch (e) {
      console.error("Failed to add Deluge magnet:", e);
      return false;
    }
  }
  async startTorrents(hashes) {
    await this.ensureAuth();
    try {
      await this.request("core.resume_torrents", [hashes]);
      return true;
    } catch (e) {
      console.error("Failed to start Deluge torrents:", e);
      return false;
    }
  }
  async stopTorrents(hashes) {
    await this.ensureAuth();
    try {
      await this.request("core.pause_torrents", [hashes]);
      return true;
    } catch (e) {
      console.error("Failed to pause Deluge torrents:", e);
      return false;
    }
  }
  async deleteTorrents(hashes, deleteFiles) {
    await this.ensureAuth();
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
