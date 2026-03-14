import { h as useI18n, u as useHead, l as useFetch, i as _sfc_main$8, e as _sfc_main$d, _ as __nuxt_component_0$2 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-Ce9v83s4.mjs';
import { _ as _sfc_main$2 } from './Select-Ctcwl8W9.mjs';
import { defineComponent, computed, withAsyncContext, ref, mergeProps, unref, withCtx, createVNode, isRef, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrRenderAttr } from 'vue/server-renderer';
import '../nitro/nitro.mjs';
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
import 'pinia';
import 'perfect-debounce';
import '@vue/shared';
import '@iconify/vue';
import 'tailwindcss/colors';
import 'reka-ui';
import '@vueuse/core';
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t } = useI18n();
    useHead({
      title: computed(() => `${t("nav.torrents")} - Ogawa`)
    });
    const { data: torrents, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/torrents",
      "$RpwCWjSfeg"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const searchQuery = ref("");
    const statusFilter = ref("all");
    const filteredTorrents = computed(() => {
      if (!torrents.value) return [];
      let result = torrents.value;
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((t2) => (t2.name || "").toLowerCase().includes(query));
      }
      if (statusFilter.value !== "all") {
        result = result.filter((t2) => t2.state === statusFilter.value);
      }
      return result;
    });
    const statusOptions = computed(() => [
      { value: "all", label: t("status.all") },
      { value: "downloading", label: t("status.downloading") },
      { value: "seeding", label: t("status.seeding") },
      { value: "paused", label: t("status.paused") },
      { value: "stopped", label: t("status.stopped") },
      { value: "error", label: t("status.error") }
    ]);
    function formatSize(bytes) {
      if (!bytes || bytes === 0) return "0 B";
      const k = 1024;
      const sizes = ["B", "KB", "MB", "GB", "TB"];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
    }
    function formatSpeed(bytesPerSecond) {
      if (!bytesPerSecond || bytesPerSecond === 0) return "0";
      return formatSize(bytesPerSecond);
    }
    function getProgressPercent(completed, total) {
      if (!total || total === 0) return 0;
      if (!completed) return 0;
      return Math.min(100, Math.round(completed / total * 100));
    }
    const queueCount = computed(() => filteredTorrents.value.length);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_UIcon = _sfc_main$d;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-2 sm:p-3" }, _attrs))}><div class="mb-4 bracket-lg px-4 py-3"><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-phosphor">${ssrInterpolate(unref(t)("torrents.title"))}</h1><p class="header-meta">${ssrInterpolate(unref(queueCount))} in queue · rtorrent connected · 0.0 MB/s ↓ · 0.0 MB/s ↑ </p></div>`);
      _push(ssrRenderComponent(_component_UButton, {
        class: "btn-bracket",
        icon: "i-heroicons-arrow-path",
        variant: "ghost",
        size: "sm",
        onClick: ($event) => unref(refresh)()
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<span class="bl"${_scopeId}></span><span class="br2"${_scopeId}></span>`);
          } else {
            return [
              createVNode("span", { class: "bl" }),
              createVNode("span", { class: "br2" })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><span class="bl"></span><span class="br2"></span></div><div class="flex flex-col sm:flex-row gap-2 mb-3"><div class="input-bracket flex-1">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(searchQuery),
        "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
        placeholder: unref(t)("torrents.search"),
        icon: "i-heroicons-magnifying-glass",
        size: "sm",
        class: "w-full"
      }, null, _parent));
      _push(`<span class="bl"></span><span class="br2"></span></div>`);
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(statusFilter),
        "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
        options: unref(statusOptions),
        "option-attribute": "label",
        "value-attribute": "value",
        size: "sm",
        color: "neutral",
        variant: "outline",
        class: "w-full sm:w-32"
      }, null, _parent));
      _push(`</div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-6 h-6 animate-spin text-halation"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(filteredTorrents).length === 0) {
        _push(`<div class="empty-state bracket-lg"><div class="empty-state-title">${ssrInterpolate(unref(t)("torrents.noResults"))}</div><div class="empty-state-sub"> Add a .torrent file, paste a magnet link, or pull items from a feed. </div><div class="flex gap-3 justify-center mb-4">`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/add" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, { class: "btn-bracket" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` + Add torrent <span class="bl"${_scopeId2}></span><span class="br2"${_scopeId2}></span>`);
                  } else {
                    return [
                      createTextVNode(" + Add torrent "),
                      createVNode("span", { class: "bl" }),
                      createVNode("span", { class: "br2" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, { class: "btn-bracket" }, {
                  default: withCtx(() => [
                    createTextVNode(" + Add torrent "),
                    createVNode("span", { class: "bl" }),
                    createVNode("span", { class: "br2" })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/add?tab=magnet" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, { class: "btn-bracket" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Paste magnet <span class="opacity-60"${_scopeId2}>↗</span><span class="bl"${_scopeId2}></span><span class="br2"${_scopeId2}></span>`);
                  } else {
                    return [
                      createTextVNode(" Paste magnet "),
                      createVNode("span", { class: "opacity-60" }, "↗"),
                      createVNode("span", { class: "bl" }),
                      createVNode("span", { class: "br2" })
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, { class: "btn-bracket" }, {
                  default: withCtx(() => [
                    createTextVNode(" Paste magnet "),
                    createVNode("span", { class: "opacity-60" }, "↗"),
                    createVNode("span", { class: "bl" }),
                    createVNode("span", { class: "br2" })
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div><div class="empty-state-meta"> rtorrent connected · watch folder off · disk free -- </div><span class="bl"></span><span class="br2"></span></div>`);
      } else {
        _push(`<div><div class="hidden md:grid grid-cols-12 gap-2 px-2 py-1.5 text-[10px] text-ghost font-mono uppercase tracking-widest"><div class="col-span-4">${ssrInterpolate(unref(t)("torrents.name"))}</div><div class="col-span-1 text-right">${ssrInterpolate(unref(t)("torrents.size"))}</div><div class="col-span-1 text-right">${ssrInterpolate(unref(t)("torrents.down"))}</div><div class="col-span-1 text-right">${ssrInterpolate(unref(t)("torrents.up"))}</div><div class="col-span-1 text-right">${ssrInterpolate(unref(t)("torrents.sp"))}</div><div class="col-span-1 text-right">${ssrInterpolate(unref(t)("torrents.ratio"))}</div><div class="col-span-1 text-center">${ssrInterpolate(unref(t)("torrents.percent"))}</div><div class="col-span-2 text-right">${ssrInterpolate(unref(t)("torrents.added"))}</div></div><div class="hidden md:block space-y-0.5"><!--[-->`);
        ssrRenderList(unref(filteredTorrents), (torrent) => {
          _push(`<div class="grid grid-cols-12 gap-2 px-2 py-2 text-xs transition-colors items-center border-b border-scan/10 hover:bg-electric/20"><div class="col-span-4 flex items-center gap-2 min-w-0"><div class="w-14 h-1.5 bg-scan/30 overflow-hidden flex-shrink-0"><div class="${ssrRenderClass([{
            "bg-halation": torrent.state === "downloading",
            "bg-phosphor": torrent.state === "seeding",
            "bg-flicker": torrent.state === "paused",
            "bg-red-500": torrent.state === "error"
          }, "h-full transition-all"])}" style="${ssrRenderStyle({ width: `${getProgressPercent(torrent.completed, torrent.size)}%` })}"></div></div><span class="truncate text-ghost">${ssrInterpolate(torrent.name || unref(t)("torrents.unknown"))}</span></div><div class="col-span-1 text-right font-mono text-ghost/70">${ssrInterpolate(formatSize(torrent.size))}</div><div class="col-span-1 text-right font-mono text-halation">${ssrInterpolate(formatSpeed(torrent.downloadSpeed))}/s </div><div class="col-span-1 text-right font-mono text-ghost/70">${ssrInterpolate(formatSpeed(torrent.uploadSpeed))}/s </div><div class="col-span-1 text-right font-mono text-ghost/60">${ssrInterpolate(torrent.seeds || 0)}/${ssrInterpolate(torrent.peers || 0)}</div><div class="col-span-1 text-right font-mono text-ghost/70">${ssrInterpolate((torrent.ratio || 0).toFixed(2))}</div><div class="col-span-1 text-center"><span class="${ssrRenderClass([{
            "bg-halation/20 text-halation": torrent.state === "downloading",
            "bg-phosphor/20 text-phosphor": torrent.state === "seeding",
            "bg-flicker/20 text-flicker": torrent.state === "paused",
            "bg-red-500/20 text-red-400": torrent.state === "error",
            "bg-scan/30 text-ghost/50": !torrent.state || torrent.state === "stopped"
          }, "text-[10px] font-mono font-medium px-1.5 py-0.5"])}">${ssrInterpolate(getProgressPercent(torrent.completed, torrent.size))}% </span></div><div class="col-span-2 text-right font-mono text-ghost/50">${ssrInterpolate(torrent.addedAt ? new Date(torrent.addedAt).toLocaleDateString() : "-")}</div></div>`);
        });
        _push(`<!--]--></div><div class="md:hidden space-y-2"><!--[-->`);
        ssrRenderList(unref(filteredTorrents), (torrent) => {
          _push(`<div class="bracket p-3"><div class="flex items-center gap-3"><div class="relative flex-shrink-0"><div class="w-10 h-10"><svg class="w-full h-full -rotate-90" viewBox="0 0 36 36"><path class="text-scan/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path><path class="${ssrRenderClass({
            "text-halation": torrent.state === "downloading",
            "text-phosphor": torrent.state === "seeding",
            "text-flicker": torrent.state === "paused",
            "text-red-400": torrent.state === "error"
          })}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"${ssrRenderAttr("stroke-dasharray", `${getProgressPercent(torrent.completed, torrent.size)}, 100`)}></path></svg><span class="absolute inset-0 flex items-center justify-center text-[10px] font-mono font-medium text-phosphor">${ssrInterpolate(getProgressPercent(torrent.completed, torrent.size))}% </span></div></div><div class="flex-1 min-w-0"><p class="text-sm font-bold truncate text-phosphor">${ssrInterpolate(torrent.name || unref(t)("torrents.unknown"))}</p><div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] font-mono text-ghost/60 mt-1"><span>${ssrInterpolate(formatSize(torrent.size))}</span>`);
          if (torrent.downloadSpeed) {
            _push(`<span class="text-halation">↓ ${ssrInterpolate(formatSpeed(torrent.downloadSpeed))}/s</span>`);
          } else {
            _push(`<!---->`);
          }
          if (torrent.uploadSpeed) {
            _push(`<span>↑ ${ssrInterpolate(formatSpeed(torrent.uploadSpeed))}/s</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(torrent.seeds || 0)}/${ssrInterpolate(torrent.peers || 0)} peers</span></div></div><span class="${ssrRenderClass([{
            "bg-halation/20 text-halation": torrent.state === "downloading",
            "bg-phosphor/20 text-phosphor": torrent.state === "seeding",
            "bg-flicker/20 text-flicker": torrent.state === "paused",
            "bg-red-500/20 text-red-400": torrent.state === "error",
            "bg-scan/30 text-ghost/50": !torrent.state || torrent.state === "stopped"
          }, "text-[10px] font-mono font-medium px-2 py-1 flex-shrink-0"])}">${ssrInterpolate(torrent.state ? unref(t)(`status.${torrent.state}`) : unref(t)("status.stopped"))}</span></div><span class="bl"></span><span class="br2"></span></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/add",
        class: "fixed right-3 bottom-16 sm:bottom-20 w-12 h-12 flex items-center justify-center shadow-lg transition-colors md:hidden btn-primary"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UIcon, {
              name: "i-heroicons-plus",
              class: "w-5 h-5"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UIcon, {
                name: "i-heroicons-plus",
                class: "w-5 h-5"
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BWWOelHf.mjs.map
