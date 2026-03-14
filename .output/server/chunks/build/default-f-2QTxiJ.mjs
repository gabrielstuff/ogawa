import { r as useRoute, _ as __nuxt_component_0$2, e as _sfc_main$d } from './server.mjs';
import { defineComponent, ref, mergeProps, unref, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
  __name: "default",
  __ssrInlineRender: true,
  setup(__props) {
    const route = useRoute();
    const navItems = [
      { name: "Torrents", path: "/", icon: "i-heroicons-arrow-down-circle" },
      { name: "Add", path: "/add", icon: "i-heroicons-plus-circle" },
      { name: "Feeds", path: "/feeds", icon: "i-heroicons-rss" },
      { name: "Settings", path: "/settings", icon: "i-heroicons-cog-6-tooth" }
    ];
    const isMobile = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen min-h-[100dvh] bg-gray-900 text-gray-100" }, _attrs))}><main class="pb-20 md:pb-4">`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (unref(isMobile)) {
        _push(`<nav class="fixed bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-sm border-t border-gray-700 safe-area-inset-bottom z-50"><div class="flex justify-around items-center h-16"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: ["flex flex-col items-center justify-center w-full h-full transition-colors duration-200", unref(route).path === item.path ? "text-primary-500" : "text-gray-400 hover:text-gray-200"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-6 h-6"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-xs mt-1"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-6 h-6"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "text-xs mt-1" }, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></div></nav>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMobile)) {
        _push(`<aside class="fixed left-0 top-0 bottom-0 w-56 bg-gray-800 border-r border-gray-700 p-3 hidden md:block"><div class="flex items-center gap-2 mb-6 px-2">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-cloud-arrow-down",
          class: "w-6 h-6 text-primary-500"
        }, null, _parent));
        _push(`<h1 class="text-lg font-semibold">Ogawa</h1></div><nav class="space-y-0.5"><!--[-->`);
        ssrRenderList(navItems, (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: ["flex items-center gap-2.5 px-3 py-2 rounded-md transition-colors text-sm", unref(route).path === item.path ? "bg-primary-500/20 text-primary-400" : "text-gray-400 hover:bg-gray-700 hover:text-gray-200"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-4 h-4"
                }, null, _parent2, _scopeId));
                _push2(`<span${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-4 h-4"
                  }, null, 8, ["name"]),
                  createVNode("span", null, toDisplayString(item.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav></aside>`);
      } else {
        _push(`<!---->`);
      }
      if (!unref(isMobile)) {
        _push(`<div class="md:ml-56"></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
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
//# sourceMappingURL=default-f-2QTxiJ.mjs.map
