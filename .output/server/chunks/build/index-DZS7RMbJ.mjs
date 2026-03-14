import { u as useHead, k as useFetch, h as _sfc_main$8, e as _sfc_main$d, _ as __nuxt_component_0$2 } from './server.mjs';
import { _ as _sfc_main$1 } from './Input-DLjUUt2w.mjs';
import { _ as _sfc_main$2 } from './Select-UBs4tq0q.mjs';
import { defineComponent, withAsyncContext, ref, computed, mergeProps, unref, isRef, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderClass, ssrRenderStyle, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
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
    useHead({
      title: "Torrents - Ogawa"
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
        result = result.filter((t) => (t.name || "").toLowerCase().includes(query));
      }
      if (statusFilter.value !== "all") {
        result = result.filter((t) => t.state === statusFilter.value);
      }
      return result;
    });
    const statusOptions = [
      { value: "all", label: "All" },
      { value: "downloading", label: "Downloading" },
      { value: "seeding", label: "Seeding" },
      { value: "paused", label: "Paused" },
      { value: "stopped", label: "Stopped" },
      { value: "error", label: "Error" }
    ];
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
      return Math.round(completed / total * 100);
    }
    function getProgressColor(state) {
      switch (state) {
        case "seeding":
          return "success";
        case "downloading":
          return "primary";
        case "paused":
          return "warning";
        case "error":
          return "error";
        default:
          return "neutral";
      }
    }
    ref(/* @__PURE__ */ new Set());
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      const _component_UInput = _sfc_main$1;
      const _component_USelect = _sfc_main$2;
      const _component_UIcon = _sfc_main$d;
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-2 sm:p-3" }, _attrs))}><div class="flex items-center justify-between mb-3"><h1 class="text-xl font-semibold">Torrents</h1>`);
      _push(ssrRenderComponent(_component_UButton, {
        icon: "i-heroicons-arrow-path",
        variant: "ghost",
        size: "sm",
        onClick: ($event) => unref(refresh)()
      }, null, _parent));
      _push(`</div><div class="flex flex-col sm:flex-row gap-2 mb-3">`);
      _push(ssrRenderComponent(_component_UInput, {
        modelValue: unref(searchQuery),
        "onUpdate:modelValue": ($event) => isRef(searchQuery) ? searchQuery.value = $event : null,
        placeholder: "Search...",
        icon: "i-heroicons-magnifying-glass",
        size: "sm",
        class: "flex-1"
      }, null, _parent));
      _push(ssrRenderComponent(_component_USelect, {
        modelValue: unref(statusFilter),
        "onUpdate:modelValue": ($event) => isRef(statusFilter) ? statusFilter.value = $event : null,
        options: statusOptions,
        "option-attribute": "label",
        "value-attribute": "value",
        size: "sm",
        class: "w-full sm:w-32"
      }, null, _parent));
      _push(`</div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-6 h-6 animate-spin text-primary-500"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(filteredTorrents).length === 0) {
        _push(`<div class="text-center py-12">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-cloud-arrow-down",
          class: "w-12 h-12 mx-auto text-gray-600 mb-3"
        }, null, _parent));
        _push(`<p class="text-gray-400 text-sm mb-4">No torrents yet</p>`);
        _push(ssrRenderComponent(_component_NuxtLink, { to: "/add" }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButton, { size: "sm" }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`Add torrent`);
                  } else {
                    return [
                      createTextVNode("Add torrent")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButton, { size: "sm" }, {
                  default: withCtx(() => [
                    createTextVNode("Add torrent")
                  ]),
                  _: 1
                })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<div><div class="hidden md:grid grid-cols-12 gap-2 px-2 py-1.5 text-[11px] text-gray-500 font-medium uppercase tracking-wide"><div class="col-span-3">Name</div><div class="col-span-1 text-right">Size</div><div class="col-span-1 text-right">Down</div><div class="col-span-1 text-right">Up</div><div class="col-span-1 text-right">S/P</div><div class="col-span-1 text-right">Ratio</div><div class="col-span-1 text-center">%</div><div class="col-span-3 text-right">Added</div></div><div class="hidden md:block space-y-0.5"><!--[-->`);
        ssrRenderList(unref(filteredTorrents), (torrent) => {
          _push(`<div class="grid grid-cols-12 gap-2 px-2 py-1.5 text-xs rounded hover:bg-gray-800/60 transition-colors items-center"><div class="col-span-3 flex items-center gap-2 min-w-0"><div class="w-14 h-1.5 bg-gray-700 rounded-full overflow-hidden flex-shrink-0"><div class="${ssrRenderClass([`bg-${getProgressColor(torrent.state)}-500`, "h-full transition-all"])}" style="${ssrRenderStyle({ width: `${getProgressPercent(torrent.completed, torrent.size)}%` })}"></div></div><span class="truncate">${ssrInterpolate(torrent.name || "Unknown")}</span></div><div class="col-span-1 text-right text-gray-400">${ssrInterpolate(formatSize(torrent.size))}</div><div class="col-span-1 text-right text-gray-400">${ssrInterpolate(formatSpeed(torrent.downloadSpeed))}</div><div class="col-span-1 text-right text-gray-400">${ssrInterpolate(formatSpeed(torrent.uploadSpeed))}</div><div class="col-span-1 text-right text-gray-400">${ssrInterpolate(torrent.seeds || 0)}/${ssrInterpolate(torrent.peers || 0)}</div><div class="col-span-1 text-right text-gray-400">${ssrInterpolate((torrent.ratio || 0).toFixed(2))}</div><div class="col-span-1 text-center"><span class="${ssrRenderClass([{
            "bg-primary-500/20 text-primary-400": torrent.state === "downloading",
            "bg-success-500/20 text-success-400": torrent.state === "seeding",
            "bg-warning-500/20 text-warning-400": torrent.state === "paused",
            "bg-error-500/20 text-error-400": torrent.state === "error",
            "bg-gray-700 text-gray-400": !torrent.state || torrent.state === "stopped"
          }, "text-[10px] font-medium px-1.5 py-0.5 rounded"])}">${ssrInterpolate(getProgressPercent(torrent.completed, torrent.size))}% </span></div><div class="col-span-3 text-right text-gray-500">${ssrInterpolate(torrent.addedAt ? new Date(torrent.addedAt).toLocaleDateString() : "-")}</div></div>`);
        });
        _push(`<!--]--></div><div class="md:hidden space-y-2"><!--[-->`);
        ssrRenderList(unref(filteredTorrents), (torrent) => {
          _push(`<div class="bg-gray-800/50 rounded-lg p-3"><div class="flex items-center gap-3"><div class="relative flex-shrink-0"><div class="w-10 h-10"><svg class="w-full h-full -rotate-90" viewBox="0 0 36 36"><path class="text-gray-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"></path><path class="${ssrRenderClass(`text-${getProgressColor(torrent.state)}-500`)}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3"${ssrRenderAttr("stroke-dasharray", `${getProgressPercent(torrent.completed, torrent.size)}, 100`)}></path></svg><span class="absolute inset-0 flex items-center justify-center text-[10px] font-medium">${ssrInterpolate(getProgressPercent(torrent.completed, torrent.size))}% </span></div></div><div class="flex-1 min-w-0"><p class="text-sm font-medium truncate">${ssrInterpolate(torrent.name || "Unknown")}</p><div class="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-gray-400 mt-1"><span>${ssrInterpolate(formatSize(torrent.size))}</span>`);
          if (torrent.downloadSpeed) {
            _push(`<span>↓ ${ssrInterpolate(formatSpeed(torrent.downloadSpeed))}/s</span>`);
          } else {
            _push(`<!---->`);
          }
          if (torrent.uploadSpeed) {
            _push(`<span>↑ ${ssrInterpolate(formatSpeed(torrent.uploadSpeed))}/s</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`<span>${ssrInterpolate(torrent.seeds || 0)}S / ${ssrInterpolate(torrent.peers || 0)}P</span></div></div><span class="${ssrRenderClass([{
            "bg-primary-500/20 text-primary-400": torrent.state === "downloading",
            "bg-success-500/20 text-success-400": torrent.state === "seeding",
            "bg-warning-500/20 text-warning-400": torrent.state === "paused",
            "bg-error-500/20 text-error-400": torrent.state === "error",
            "bg-gray-700 text-gray-400": !torrent.state || torrent.state === "stopped"
          }, "text-[10px] font-medium px-2 py-1 rounded flex-shrink-0"])}">${ssrInterpolate(torrent.state || "stopped")}</span></div></div>`);
        });
        _push(`<!--]--></div></div>`);
      }
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/add",
        class: "fixed right-3 bottom-16 sm:bottom-3 w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-primary-400 transition-colors md:hidden"
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
//# sourceMappingURL=index-DZS7RMbJ.mjs.map
