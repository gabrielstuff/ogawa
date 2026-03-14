---
title: Flood GitHub Issues & PRs — Full Triage & Priority Plan
type: feat
status: active
date: 2026-03-14
---

# Flood GitHub Issues & PRs — Full Triage & Priority Plan

> **Source:** https://github.com/jesec/flood — 57 open issues · 14 open PRs
> **Analyzed:** 2026-03-14
> **Method:** Deduplicated, themed, and prioritized P1 → P3

---

## Priority Framework

| Priority | Criteria |
|----------|----------|
| **P1** | Crash · data loss · memory leak · complete feature broken for a whole client · first-run blocker |
| **P2** | Partial feature broken · commonly-used workflow impaired · security/permission gap |
| **P3** | UI polish · minor UX · rarely-hit edge case · dev/tooling |

---

## P1 — Critical: Fix Immediately

### 🔴 Memory Leak — Infinite allocation

| | |
|-|-|
| **Issue** | [#814](https://github.com/jesec/flood/issues/814) |
| **Title** | Flood allocates 10 GB+ RAM in minutes; grows infinitely |
| **Impact** | Server OOM crash — affects any long-running instance |
| **Status** | No PR, no investigation comment |

Flood's process memory grows without bound after a period of uptime. The bug reproduces reliably and makes production deployments unstable.

---

### 🔴 qBittorrent — ETA shows ∞ while seeding

| | |
|-|-|
| **Issue** | [#1059](https://github.com/jesec/flood/issues/1059) |
| **PR** | [#1060](https://github.com/jesec/flood/pull/1060) — open, needs review |
| **Impact** | All qBittorrent users with ratio/time seeding rules see broken ETA |
| **Root cause** | `dlspeed === 0` guard unconditionally hides ETA for seeding states |

A Copilot-authored fix exists in #1060. Maintainer (trim21) has reviewed and will provide a corrected version. **Action: review and merge or rewrite #1060.**

---

### 🔴 qBittorrent — RSS / Feed not working

| | |
|-|-|
| **Issue** | [#944](https://github.com/jesec/flood/issues/944) |
| **Impact** | Automated RSS downloading entirely broken for qBittorrent backend |
| **Status** | Maintainer asked for logs; no resolution |

Feed is completely non-functional when Flood is backed by qBittorrent. Core automation workflow.

---

### 🔴 qBittorrent — Cannot add Torrent Metafile

| | |
|-|-|
| **Issue** | [#590](https://github.com/jesec/flood/issues/590) |
| **Impact** | `.torrent` file upload fails on qBittorrent |
| **Status** | Open, no PR |

---

### 🔴 rtorrent — Settings changes not propagating

| | |
|-|-|
| **Issue** | [#1047](https://github.com/jesec/flood/issues/1047) |
| **Impact** | Speed limits, ratios, and other settings changed in Flood UI have no effect on rtorrent |
| **Status** | Open, no investigation |

---

### 🔴 rtorrent — add-torrent returns 500

| | |
|-|-|
| **Issue** | [#922](https://github.com/jesec/flood/issues/922) |
| **Impact** | Core add-torrent flow broken on rtorrent 0.9.8 |
| **Status** | Open |

---

### 🔴 Transmission — completely non-functional

| | |
|-|-|
| **Issue** | [#500](https://github.com/jesec/flood/issues/500) |
| **Impact** | Transmission backend users unable to use Flood at all |
| **Status** | Open |

---

### 🔴 First-run — 500 on registration

| | |
|-|-|
| **Issues** | [#403](https://github.com/jesec/flood/issues/403) · [#390](https://github.com/jesec/flood/issues/390) · [#451](https://github.com/jesec/flood/issues/451) |
| **Impact** | New installs fail during initial setup — Docker + bare metal |
| **Note** | #390 (Docker FailureMessage), #451 (exec format error in container) and #403 (500 on register) are related first-run failures |

---

## P2 — Important: Fix in Next Release

### 🟠 qBittorrent — Ratio/Seeding Limits: Start doesn't work

| | |
|-|-|
| **Issue** | [#498](https://github.com/jesec/flood/issues/498) |
| **Impact** | Cannot start torrents when seeding limits are configured |

---

### 🟠 qBittorrent — Category support missing

| | |
|-|-|
| **Issue** | [#686](https://github.com/jesec/flood/issues/686) |
| **PR** | [#902](https://github.com/jesec/flood/pull/902) — open, labeled enhancement |
| **Impact** | Users who manage torrents with qBittorrent categories cannot filter in Flood |

**Action: review and merge PR #902.**

---

### 🟠 qBittorrent — Complete/incomplete download path not exposed

| | |
|-|-|
| **Issue** | [#685](https://github.com/jesec/flood/issues/685) |
| **Impact** | Cannot configure separate paths for in-progress vs finished downloads |

---

### 🟠 qBittorrent — Status filter behavior incorrect

| | |
|-|-|
| **PR** | [#237](https://github.com/jesec/flood/pull/237) — open for a long time |
| **Impact** | Torrent status filtering is inconsistent with qBittorrent states |

**Action: review and merge or close PR #237.**

---

### 🟠 rtorrent — Tracker management not supported

| | |
|-|-|
| **Issue** | [#838](https://github.com/jesec/flood/issues/838) |
| **Impact** | Cannot add/edit/remove trackers via Flood on rtorrent backend |

---

### 🟠 Transmission — Start skips queue

| | |
|-|-|
| **Issue** | [#411](https://github.com/jesec/flood/issues/411) |
| **Impact** | "Start" triggers "Start Now", bypassing download queue ordering |

---

### 🟠 Transmission — Path encoding error

| | |
|-|-|
| **Issue** | [#796](https://github.com/jesec/flood/issues/796) |
| **Impact** | transmission-daemon errors due to wrong URL-encoded paths |

---

### 🟠 Transmission — Status display incorrect

| | |
|-|-|
| **Issue** | [#559](https://github.com/jesec/flood/issues/559) |

---

### 🟠 RSS — UI crash when adding torrent from feed fails

| | |
|-|-|
| **Issue** | [#664](https://github.com/jesec/flood/issues/664) |
| **Impact** | A single failed RSS torrent takes down the whole UI |

---

### 🟠 RSS — Duplicate notifications + folder ignored

| | |
|-|-|
| **Issue** | [#642](https://github.com/jesec/flood/issues/642) |
| **Impact** | RSS automation unreliable — wrong folder, double notifications |

---

### 🟠 RSS — Test regex ≠ applied regex

| | |
|-|-|
| **Issue** | [#517](https://github.com/jesec/flood/issues/517) |
| **Impact** | RSS rule testing gives false confidence — rules silently mismatch |

---

### 🟠 File Management — Filter by Location shows wrong torrents (duplicate)

| | |
|-|-|
| **Issues** | [#866](https://github.com/jesec/flood/issues/866) · [#844](https://github.com/jesec/flood/issues/844) — same bug, two reports |
| **Impact** | Location filter leaks torrents from other directories |

---

### 🟠 File Management — "Set torrent location" broken with nested folders

| | |
|-|-|
| **Issue** | [#573](https://github.com/jesec/flood/issues/573) |
| **Impact** | Moving a torrent with internal folder structure fails or moves to wrong path |

---

### 🟠 File Management — No permission checks on move

| | |
|-|-|
| **Issue** | [#507](https://github.com/jesec/flood/issues/507) |
| **Impact** | Moving files to unauthorized paths silently fails or causes partial moves |

---

### 🟠 Mount Points — Reorder not saved

| | |
|-|-|
| **Issue** | [#670](https://github.com/jesec/flood/issues/670) |
| **PR** | [#1056](https://github.com/jesec/flood/pull/1056) — open, fix ready |

**Action: review and merge PR #1056.**

---

### 🟠 Mount Points — Allowed path not tracking mount path

| | |
|-|-|
| **PR** | [#643](https://github.com/jesec/flood/pull/643) — open |

**Action: review and merge or close PR #643.**

---

### 🟠 PWA — Android "Add to Home Screen" broken

| | |
|-|-|
| **Issue** | [#840](https://github.com/jesec/flood/issues/840) |
| **PR** | [#596](https://github.com/jesec/flood/pull/596) — handles magnet/torrent PWA launches |
| **Impact** | Mobile PWA experience degraded |

**Action: review PR #596; may partially address #840.**

---

### 🟠 Speed Limits — Wrong display and can't be modified

| | |
|-|-|
| **Issue** | [#495](https://github.com/jesec/flood/issues/495) — labeled bug |
| **Impact** | Users cannot manage bandwidth from Flood UI |

---

### 🟠 TypeError — containedCount undefined

| | |
|-|-|
| **Issue** | [#872](https://github.com/jesec/flood/issues/872) — labeled bug |
| **Impact** | JS crash on certain torrent list states |

---


### 🟠 Priority Slider & Sequential Check non-functional

| | |
|-|-|
| **Issue** | [#799](https://github.com/jesec/flood/issues/799) |
| **Impact** | Cannot set per-file priority or sequential download mode |

---

### 🟠 Download Contents — broken for multiple torrents

| | |
|-|-|
| **Issue** | [#405](https://github.com/jesec/flood/issues/405) |
| **Impact** | Bulk content download fails |

---

### 🟠 Health Check endpoint missing

| | |
|-|-|
| **Issue** | [#911](https://github.com/jesec/flood/issues/911) |
| **Impact** | Cannot wire Flood into Docker/k8s health checks — container restarts not detected |

---

### 🟠 Add tracker to existing torrent

| | |
|-|-|
| **Issue** | [#568](https://github.com/jesec/flood/issues/568) |
| **Impact** | Common workflow (adding backup trackers) not supported in UI |

---

### 🟠 Download queueing not enabled

| | |
|-|-|
| **PR** | [#414](https://github.com/jesec/flood/pull/414) — open |
| **Impact** | Queue management UI items disabled; scheduling workflows not possible |

**Action: review and merge or close PR #414.**

---

### 🟠 Hover effects broken in Safari

| | |
|-|-|
| **Issue** | [#372](https://github.com/jesec/flood/issues/372) |
| **Impact** | Non-functional UI on Safari — large user segment on macOS/iOS |

---

### 🟠 Setup — Flood doesn't create ~/.local folder

| | |
|-|-|
| **Issue** | [#672](https://github.com/jesec/flood/issues/672) |
| **Impact** | Fresh installs fail silently if `~/.local` doesn't exist |

---

### 🟠 FreeBSD — crash on startup

| | |
|-|-|
| **Issue** | [#636](https://github.com/jesec/flood/issues/636) |
| **Impact** | BSD users cannot run Flood at all |

---

## P3 — Low Priority: Backlog / Nice-to-Have

### 🟡 Show tracker message in qBittorrent

| | |
|-|-|
| **Issue** | [#647](https://github.com/jesec/flood/issues/647) |

---

### 🟡 Expose qBittorrent tracker message in UI

Already partially covered by #647. Related to general tracker display improvements.

---

### 🟡 # Index column in torrent list

| | |
|-|-|
| **Issue** | [#1006](https://github.com/jesec/flood/issues/1006) |

---

### 🟡 Sort peers columns

| | |
|-|-|
| **PR** | [#610](https://github.com/jesec/flood/pull/610) — open |

**Action: review and merge PR #610 — low risk, useful QoL.**

---

### 🟡 Configurable bottom panel for torrent details

| | |
|-|-|
| **PR** | [#1004](https://github.com/jesec/flood/pull/1004) |

---

### 🟡 Individual torrent summary API

| | |
|-|-|
| **PR** | [#555](https://github.com/jesec/flood/pull/555) |

---

### 🟡 Mount path — long path truncated in disk usage

| | |
|-|-|
| **Issue** | [#342](https://github.com/jesec/flood/issues/342) |

---


### 🟡 Ctrl+A with modal open modifies selections

| | |
|-|-|
| **Issue** | [#410](https://github.com/jesec/flood/issues/410) |

---


### 🟡 Cannot clear notification list (too long)

| | |
|-|-|
| **Issue** | [#407](https://github.com/jesec/flood/issues/407) |

---

### 🟡 French translation issues

| | |
|-|-|
| **Issue** | [#663](https://github.com/jesec/flood/issues/663) |
| **PR** | [#1057](https://github.com/jesec/flood/pull/1057) — automatic translation PR open |

---

### 🟡 403 error not descriptive enough on add-files

| | |
|-|-|
| **Issue** | [#867](https://github.com/jesec/flood/issues/867) |

---

### 🟡 Live Tab statistics not updating

| | |
|-|-|
| **Issue** | [#456](https://github.com/jesec/flood/issues/456) |

---

### 🟡 Download file unexpected prompt (single file selection)

| | |
|-|-|
| **Issue** | [#641](https://github.com/jesec/flood/issues/641) |

---


### 🟡 Flood default download directory not honored

| | |
|-|-|
| **Issue** | [#531](https://github.com/jesec/flood/issues/531) |

---

## Themes Summary — Most Impacted Areas

```
qBittorrent Integration  ████████████  7 issues  2 PRs   ← Most active backend
RSS / Feed               █████          4 issues
File/Location Management █████          4 issues
Transmission             █████          4 issues
First-run / Setup        ████           4 issues
rtorrent                 ███            3 issues
UI / TypeErrors          ████████       6 issues
PWA / Mobile             ██             2 issues  1 PR
Memory / Performance     █              1 issue   (CRITICAL)
```

