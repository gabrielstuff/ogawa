# Transmission RPC Specification

> [!IMPORTANT]
> Transmisson 4.1.0 (`rpc_version_semver` 6.0.0) added support for the JSON-RPC 2.0 protocol and converted all RPC strings to snake_case.
>
> The old bespoke RPC protocol, and the old mix of kebab-case and camelCase strings, are still supported in Transmission 4 but are deprecated and will be removed in the future. People using the old protocol should update their code!
>
> For documentation of the old RPC protocol and strings, please consult documentation from previous versions.
> https://github.com/transmission/transmission/blob/4.0.6/docs/rpc-spec.md

This document describes a protocol for interacting with Transmission sessions remotely.

## Terminology
The [JSON](https://www.json.org/) terminology in [RFC 8259](https://datatracker.ietf.org/doc/html/rfc8259) is used.
RPC requests and responses are formatted in JSON.

## Tools
If `transmission-remote` is called with a `--debug` argument, its RPC traffic to the Transmission server will be dumped to the terminal. This can be useful when you want to compare requests in your application to another for reference.

If `transmission-qt` is run with an environment variable `TR_RPC_VERBOSE` set, it too will dump the RPC requests and responses to the terminal for inspection.

Lastly, using the browser's developer tools in the Transmission web client is always an option.

## Message format
Transmission follows the [JSON-RPC 2.0](https://www.jsonrpc.org/specification) specification and supports the entirety of it,
except that parameters by-position is not supported, meaning the request parameters must be an Object.

Response parameters are returned in the `result` Object.

#### Example request
```json
{
   "jsonrpc": "2.0",
   "params": {
     "fields": [ "version" ]
   },
   "method": "session_get",
   "id": 912313
}
```

#### Example response
```json
{
   "jsonrpc": "2.0",
   "result": {
      "version": "4.1.0-dev (ae226418eb)"
   },
   "id": 912313
}
```

### Error data
JSON-RPC 2.0 allows for additional information about an error be included in the `data` key of the Error object in an implementation-defined format.

In Transmission, this key is an Object that includes:
1. An optional `error_string` string that provides additional information.
2. An optional `result` Object that contains additional keys defined by the method.

### Transport mechanism
HTTP POSTing a JSON-encoded request is the preferred way of communicating with a Transmission RPC server. The current Transmission implementation has the default URL as `http://host:9091/transmission/rpc`.

#### CSRF protection
Most Transmission RPC servers require a `X-Transmission-Session-Id` header to be sent with requests. When your request has the wrong id, the server returns an HTTP 409 error with the right session ID. The correct way to handle a 409 is to update your session ID and resend the previous request.

#### Authentication
Authentication is optional. When enabled, it uses HTTP Basic Access Authentication with `Authorization: Basic <base64 credentials>` header.

## Torrent requests

### Torrent action requests
| Method name | Description |
|:--|:--|
| `torrent_start` | start torrent |
| `torrent_start_now` | start torrent disregarding queue position |
| `torrent_stop` | stop torrent |
| `torrent_verify` | verify torrent |
| `torrent_reannounce` | re-announce to trackers now |

Request parameters: `ids` - which torrents to use:
1. an integer referring to a torrent id
2. a list of torrent id numbers, SHA1 hash strings, or both
3. a string, `recently_active`, for recently-active torrents

### Adding a torrent: `torrent_add`
| Key | Value Type | Description |
|:--|:--|:--|
| `filename` | string | filename or URL of the .torrent file |
| `metainfo` | string | base64-encoded .torrent content |
| `download_dir` | string | path to download the torrent to |
| `paused` | boolean | if true, don't start the torrent |
| `peer_limit` | number | maximum number of peers |
| `labels` | array | array of string labels |

Either `filename` **or** `metainfo` **must** be included.

### Removing a torrent: `torrent_remove`
| Key | Value Type | Description |
|:--|:--|:--|
| `ids` | array | torrent list |
| `delete_local_data` | boolean | delete local data (default: false) |

### Getting torrents: `torrent_get`
Request parameters:
- `ids` (optional) - torrent list
- `fields` (required) - array of keys to return

Common fields:
| Key | Value Type |
|:--|:--|
| `id` | integer |
| `hash_string` | string |
| `name` | string |
| `total_size` | number |
| `downloaded_ever` | number |
| `uploaded_ever` | number |
| `rate_download` | number (B/s) |
| `rate_upload` | number (B/s) |
| `seeders_connected` | number |
| `peers_connected` | number |
| `status` | number (0-6) |
| `date_added` | number |
| `done_date` | number |
| `upload_ratio` | double |

Status values:
| Value | Meaning |
|:--|:--|
| 0 | Torrent is stopped |
| 1 | Torrent is queued to verify local data |
| 2 | Torrent is verifying local data |
| 3 | Torrent is queued to download |
| 4 | Torrent is downloading |
| 5 | Torrent is queued to seed |
| 6 | Torrent is seeding |

## Session requests

### Session get: `session_get`
Returns session parameters. No required parameters.

### Session stats: `session_stats`
Returns:
| Key | Value Type |
|:--|:--|
| `active_torrent_count` | number |
| `download_speed` | number |
| `paused_torrent_count` | number |
| `torrent_count` | number |
| `upload_speed` | number |

## Testing connection

To test if Transmission is reachable:
```json
{
  "jsonrpc": "2.0",
  "method": "session_get",
  "id": 1
}
```

This will return HTTP 409 if no session ID is provided, with the session ID in the `X-Transmission-Session-Id` header. Subsequent requests should include this header.
