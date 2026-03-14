import { c as useI18n, v as useRoute, _ as __nuxt_component_0$2, d as _sfc_main$d } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { u as useAddTorrentModal } from './useAddTorrentModal-DDQMBj5g.mjs';
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

const appName = "Ogawa";
const appVersion = "1.0.0";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    const route = useRoute();
    const addTorrentModal = useAddTorrentModal();
    const navItems = computed(() => [
      { name: t("nav.torrents"), path: "/", icon: "i-heroicons-arrow-down-circle" },
      { name: t("nav.add"), icon: "i-heroicons-plus-circle", action: () => addTorrentModal.value.show = true },
      { name: t("nav.feeds"), path: "/feeds", icon: "i-heroicons-rss" }
    ]);
    const settingsItem = { name: t("nav.settings"), path: "/settings", icon: "i-heroicons-cog-6-tooth" };
    const isMobile = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen min-h-[100dvh] bg-bg text-ink-1 font-karla" }, _attrs))}><main class="pb-20 md:pb-16 md:ml-14">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (unref(isMobile)) {
        _push(`<nav class="fixed bottom-0 left-0 right-0 bg-surface-h/95 backdrop-blur-sm border-t border-line safe-area-inset-bottom z-50"><div class="flex justify-around items-center h-16"><!--[-->`);
        ssrRenderList(unref(navItems), (item) => {
          _push(`<!--[-->`);
          if (!item.action) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: item.path,
              class: ["flex flex-col items-center justify-center w-full h-full transition-colors duration-200", unref(route).path === item.path ? "text-accent" : "text-ink-3 hover:text-ink-1"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: item.icon,
                    class: "w-6 h-6"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-[10px] mt-1 font-semibold uppercase tracking-wide"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: item.icon,
                      class: "w-6 h-6"
                    }, null, 8, ["name"]),
                    createVNode("span", { class: "text-[10px] mt-1 font-semibold uppercase tracking-wide" }, toDisplayString(item.name), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<button class="flex flex-col items-center justify-center w-full h-full transition-colors duration-200 text-ink-3 hover:text-ink-1">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: item.icon,
              class: "w-6 h-6"
            }, null, _parent));
            _push(`<span class="text-[10px] mt-1 font-semibold uppercase tracking-wide">${ssrInterpolate(item.name)}</span></button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMobile)) {
        _push(`<aside class="fixed left-0 top-0 bottom-0 w-14 bg-surface-h border-r border-line p-2 hidden md:flex flex-col"><div class="flex items-center justify-center h-12 mb-4">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-cloud-arrow-down",
          class: "w-6 h-6 text-accent"
        }, null, _parent));
        _push(`</div><nav class="flex-1 space-y-0"><!--[-->`);
        ssrRenderList(unref(navItems), (item) => {
          _push(`<!--[-->`);
          if (!item.action) {
            _push(ssrRenderComponent(_component_NuxtLink, {
              to: item.path,
              class: ["flex flex-col items-center justify-center py-3 transition-colors", unref(route).path === item.path ? "text-accent" : "text-ink-3 hover:text-ink-1"]
            }, {
              default: withCtx((_, _push2, _parent2, _scopeId) => {
                if (_push2) {
                  _push2(ssrRenderComponent(_component_UIcon, {
                    name: item.icon,
                    class: "w-5 h-5"
                  }, null, _parent2, _scopeId));
                  _push2(`<span class="text-[9px] mt-1 font-semibold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(item.name.charAt(0))}</span>`);
                } else {
                  return [
                    createVNode(_component_UIcon, {
                      name: item.icon,
                      class: "w-5 h-5"
                    }, null, 8, ["name"]),
                    createVNode("span", { class: "text-[9px] mt-1 font-semibold uppercase tracking-wider" }, toDisplayString(item.name.charAt(0)), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          } else {
            _push(`<button class="flex flex-col items-center justify-center py-3 transition-colors text-ink-3 hover:text-ink-1">`);
            _push(ssrRenderComponent(_component_UIcon, {
              name: item.icon,
              class: "w-5 h-5"
            }, null, _parent));
            _push(`<span class="text-[9px] mt-1 font-semibold uppercase tracking-wider">${ssrInterpolate(item.name.charAt(0))}</span></button>`);
          }
          _push(`<!--]-->`);
        });
        _push(`<!--]--></nav><div class="mt-auto">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: settingsItem.path,
          class: ["flex flex-col items-center justify-center py-3 transition-colors", unref(route).path === settingsItem.path ? "text-accent" : "text-ink-3 hover:text-ink-1"]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UIcon, {
                name: settingsItem.icon,
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(`<span class="text-[9px] mt-1 font-semibold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(settingsItem.name.charAt(0))}</span>`);
            } else {
              return [
                createVNode(_component_UIcon, {
                  name: settingsItem.icon,
                  class: "w-5 h-5"
                }, null, 8, ["name"]),
                createVNode("span", { class: "text-[9px] mt-1 font-semibold uppercase tracking-wider" }, toDisplayString(settingsItem.name.charAt(0)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></aside>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<footer class="fixed bottom-0 left-0 right-0 md:left-14 status-strip z-40"><div class="flex items-center gap-2"><span class="status-dot"></span><span>daemon: connected</span></div><span>feeds: 0</span><span>watch: off</span><span>disk: -- GB free</span><span class="ml-auto">${ssrInterpolate(appName)} v${ssrInterpolate(appVersion)}</span></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=default-Ddp57XZa.mjs.map
