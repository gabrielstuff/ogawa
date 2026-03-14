import { _ as _sfc_main$1 } from './Select-Ctcwl8W9.mjs';
import { h as useI18n, p as useRoute, _ as __nuxt_component_0$2, e as _sfc_main$d } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, isRef, withCtx, createVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import 'reka-ui';
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
import '@vueuse/core';
import 'pinia';
import 'perfect-debounce';
import '@vue/shared';
import '@iconify/vue';
import 'tailwindcss/colors';
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
    const { t, locale, locales, setLocale } = useI18n();
    const route = useRoute();
    const navItems = computed(() => [
      { name: t("nav.torrents"), path: "/", icon: "i-heroicons-arrow-down-circle" },
      { name: t("nav.add"), path: "/add", icon: "i-heroicons-plus-circle" },
      { name: t("nav.feeds"), path: "/feeds", icon: "i-heroicons-rss" },
      { name: t("nav.settings"), path: "/settings", icon: "i-heroicons-cog-6-tooth" }
    ]);
    const localeOptions = computed(
      () => locales.value.map((l) => ({
        value: l.code,
        label: l.name
      }))
    );
    const currentLocale = computed({
      get: () => locale.value,
      set: (val) => {
        setLocale(val);
      }
    });
    const isMobile = ref(true);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_USelect = _sfc_main$1;
      const _component_NuxtLink = __nuxt_component_0$2;
      const _component_UIcon = _sfc_main$d;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen min-h-[100dvh] bg-blue text-phosphor font-karla" }, _attrs))}><main class="pb-20 md:pb-16 md:ml-14">`);
      if (unref(isMobile)) {
        _push(`<div class="p-2 flex justify-end">`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: unref(currentLocale),
          "onUpdate:modelValue": ($event) => isRef(currentLocale) ? currentLocale.value = $event : null,
          items: unref(localeOptions),
          "option-attribute": "label",
          "value-attribute": "value",
          size: "xs",
          color: "neutral",
          variant: "outline",
          class: "w-28"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
      if (unref(isMobile)) {
        _push(`<nav class="fixed bottom-0 left-0 right-0 bg-deep/95 backdrop-blur-sm border-t border-scan/20 safe-area-inset-bottom z-50"><div class="flex justify-around items-center h-16"><!--[-->`);
        ssrRenderList(unref(navItems), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: ["flex flex-col items-center justify-center w-full h-full transition-colors duration-200", unref(route).path === item.path ? "text-halation" : "text-ghost hover:text-phosphor"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-6 h-6"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-[10px] mt-1 font-bold uppercase tracking-wide"${_scopeId}>${ssrInterpolate(item.name)}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-6 h-6"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "text-[10px] mt-1 font-bold uppercase tracking-wide" }, toDisplayString(item.name), 1)
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
        _push(`<aside class="fixed left-0 top-0 bottom-0 w-14 bg-deep border-r border-scan/20 p-2 hidden md:flex flex-col"><div class="flex items-center justify-center h-12 mb-4">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-cloud-arrow-down",
          class: "w-6 h-6 text-halation"
        }, null, _parent));
        _push(`</div><nav class="flex-1 space-y-0"><!--[-->`);
        ssrRenderList(unref(navItems), (item) => {
          _push(ssrRenderComponent(_component_NuxtLink, {
            key: item.path,
            to: item.path,
            class: ["flex flex-col items-center justify-center py-3 transition-colors", unref(route).path === item.path ? "text-halation" : "text-ghost hover:text-phosphor"]
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(ssrRenderComponent(_component_UIcon, {
                  name: item.icon,
                  class: "w-5 h-5"
                }, null, _parent2, _scopeId));
                _push2(`<span class="text-[9px] mt-1 font-bold uppercase tracking-wider"${_scopeId}>${ssrInterpolate(item.name.charAt(0))}</span>`);
              } else {
                return [
                  createVNode(_component_UIcon, {
                    name: item.icon,
                    class: "w-5 h-5"
                  }, null, 8, ["name"]),
                  createVNode("span", { class: "text-[9px] mt-1 font-bold uppercase tracking-wider" }, toDisplayString(item.name.charAt(0)), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
        });
        _push(`<!--]--></nav><div class="mt-auto">`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: unref(currentLocale),
          "onUpdate:modelValue": ($event) => isRef(currentLocale) ? currentLocale.value = $event : null,
          items: unref(localeOptions),
          "option-attribute": "label",
          "value-attribute": "value",
          size: "xs",
          color: "neutral",
          variant: "outline"
        }, null, _parent));
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
//# sourceMappingURL=default-1dxY_FKM.mjs.map
