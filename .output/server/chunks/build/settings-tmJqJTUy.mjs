import { h as useI18n, u as useHead, l as useFetch, e as _sfc_main$d, i as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Select-Ctcwl8W9.mjs';
import { _ as _sfc_main$2 } from './Input-Ce9v83s4.mjs';
import { _ as _sfc_main$3 } from './Alert-COvzudqC.mjs';
import { defineComponent, computed, withAsyncContext, ref, mergeProps, unref, isRef, withCtx, createTextVNode, toDisplayString, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "settings",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { t } = useI18n();
    useHead({
      title: computed(() => `${t("settings.title")} - Ogawa`)
    });
    const { data: settings, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/settings",
      "$30WfwEn-ZB"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const isLoading = ref(false);
    const testStatus = ref("idle");
    const testMessage = ref("");
    const clientType = ref("qBittorrent");
    const clientUrl = ref("");
    const clientUsername = ref("");
    const clientPassword = ref("");
    const clientHost = ref("");
    const clientPort = ref(58846);
    const theme = ref("system");
    const itemsPerPage = ref(20);
    const defaultDownloadPath = ref("");
    const maxActiveDownloads = ref(3);
    const downloadSpeedLimit = ref(0);
    const uploadSpeedLimit = ref(0);
    const themeOptions = computed(() => [
      { value: "system", label: t("settings.themeSystem") },
      { value: "light", label: t("settings.themeLight") },
      { value: "dark", label: t("settings.themeDark") }
    ]);
    const clientOptions = [
      { value: "qBittorrent", label: "qBittorrent" },
      { value: "Transmission", label: "Transmission" },
      { value: "rTorrent", label: "rTorrent" },
      { value: "Deluge", label: "Deluge" }
    ];
    const showQBitFields = computed(() => clientType.value === "qBittorrent");
    const showTransmissionFields = computed(() => clientType.value === "Transmission");
    const showRTorrentFields = computed(() => clientType.value === "rTorrent");
    const showDelugeFields = computed(() => clientType.value === "Deluge");
    async function saveSettings() {
      isLoading.value = true;
      try {
        const clientData = {
          client: clientType.value
        };
        if (showQBitFields.value) {
          clientData.url = clientUrl.value;
          clientData.username = clientUsername.value;
          clientData.password = clientPassword.value;
        } else if (showTransmissionFields.value) {
          clientData.url = clientUrl.value;
          clientData.username = clientUsername.value;
          clientData.password = clientPassword.value;
        } else if (showRTorrentFields.value) {
          clientData.url = clientUrl.value;
        } else if (showDelugeFields.value) {
          clientData.host = clientHost.value;
          clientData.port = clientPort.value;
          clientData.password = clientPassword.value;
        }
        await $fetch("/api/settings", {
          method: "PATCH",
          body: {
            client: clientData,
            ui: {
              theme: theme.value,
              itemsPerPage: itemsPerPage.value
            },
            download: {
              defaultPath: defaultDownloadPath.value,
              maxActive: maxActiveDownloads.value,
              downloadSpeedLimit: downloadSpeedLimit.value,
              uploadSpeedLimit: uploadSpeedLimit.value
            }
          }
        });
        refresh();
      } catch (e) {
        console.error("Failed to save settings:", e);
      } finally {
        isLoading.value = false;
      }
    }
    async function testConnection() {
      testStatus.value = "testing";
      testMessage.value = "";
      try {
        await $fetch("/api/client/test", {
          method: "POST",
          body: {
            client: clientType.value,
            url: clientUrl.value,
            username: clientUsername.value,
            password: clientPassword.value,
            host: clientHost.value,
            port: clientPort.value
          }
        });
        testStatus.value = "success";
        testMessage.value = t("settings.connectionSuccess");
      } catch (e) {
        testStatus.value = "error";
        testMessage.value = e.message || t("settings.connectionFailed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_USelect = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$8;
      const _component_UAlert = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 max-w-2xl mx-auto" }, _attrs))}><div class="mb-6 bracket-lg px-4 py-3"><h1 class="text-2xl font-bold text-phosphor">${ssrInterpolate(unref(t)("settings.title"))}</h1><p class="header-meta"> Configure torrent client connection and download settings </p><span class="bl"></span><span class="br2"></span></div>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-halation"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-4"><div class="bracket p-4"><div class="flex items-center gap-2 mb-4">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-server-stack",
          class: "w-5 h-5 text-halation"
        }, null, _parent));
        _push(`<h2 class="text-lg font-bold text-phosphor">${ssrInterpolate(unref(t)("settings.connection"))}</h2></div><div class="space-y-4"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.torrentClient"))}</label>`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: unref(clientType),
          "onUpdate:modelValue": ($event) => isRef(clientType) ? clientType.value = $event : null,
          options: clientOptions,
          "option-attribute": "label",
          "value-attribute": "value",
          color: "neutral",
          variant: "outline",
          class: "w-full"
        }, null, _parent));
        _push(`</div>`);
        if (unref(showQBitFields)) {
          _push(`<div class="space-y-3"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.clientUrl", { client: "qBittorrent" }))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientUrl),
            "onUpdate:modelValue": ($event) => isRef(clientUrl) ? clientUrl.value = $event : null,
            placeholder: "http://localhost:8080",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.username"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientUsername),
            "onUpdate:modelValue": ($event) => isRef(clientUsername) ? clientUsername.value = $event : null,
            placeholder: "admin",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.password"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientPassword),
            "onUpdate:modelValue": ($event) => isRef(clientPassword) ? clientPassword.value = $event : null,
            type: "password",
            placeholder: "••••••••",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showTransmissionFields)) {
          _push(`<div class="space-y-3"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.clientUrl", { client: "Transmission" }))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientUrl),
            "onUpdate:modelValue": ($event) => isRef(clientUrl) ? clientUrl.value = $event : null,
            placeholder: "http://localhost:9091",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.username"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientUsername),
            "onUpdate:modelValue": ($event) => isRef(clientUsername) ? clientUsername.value = $event : null,
            placeholder: "admin",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.password"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientPassword),
            "onUpdate:modelValue": ($event) => isRef(clientPassword) ? clientPassword.value = $event : null,
            type: "password",
            placeholder: "••••••••",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showRTorrentFields)) {
          _push(`<div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.scgiUrl"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientUrl),
            "onUpdate:modelValue": ($event) => isRef(clientUrl) ? clientUrl.value = $event : null,
            placeholder: "localhost:5000",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div>`);
        } else {
          _push(`<!---->`);
        }
        if (unref(showDelugeFields)) {
          _push(`<div class="space-y-3"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.host"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientHost),
            "onUpdate:modelValue": ($event) => isRef(clientHost) ? clientHost.value = $event : null,
            placeholder: "localhost",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.port"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientPort),
            "onUpdate:modelValue": ($event) => isRef(clientPort) ? clientPort.value = $event : null,
            type: "number",
            placeholder: "58846",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.password"))}</label>`);
          _push(ssrRenderComponent(_component_UInput, {
            modelValue: unref(clientPassword),
            "onUpdate:modelValue": ($event) => isRef(clientPassword) ? clientPassword.value = $event : null,
            type: "password",
            placeholder: "••••••••",
            color: "neutral",
            variant: "outline"
          }, null, _parent));
          _push(`</div></div>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="flex gap-2 pt-2">`);
        _push(ssrRenderComponent(_component_UButton, {
          class: "btn-ghost",
          loading: unref(testStatus) === "testing",
          onClick: testConnection
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("settings.testConnection"))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("settings.testConnection")), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        if (unref(testStatus) === "success") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "success",
            variant: "solid",
            class: "font-mono"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(testMessage))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(testMessage)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (unref(testStatus) === "error") {
          _push(ssrRenderComponent(_component_UAlert, {
            color: "error",
            variant: "solid",
            class: "font-mono"
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(unref(testMessage))}`);
              } else {
                return [
                  createTextVNode(toDisplayString(unref(testMessage)), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</div><span class="bl"></span><span class="br2"></span></div><div class="bracket p-4"><div class="flex items-center gap-2 mb-4">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-paint-brush",
          class: "w-5 h-5 text-halation"
        }, null, _parent));
        _push(`<h2 class="text-lg font-bold text-phosphor">${ssrInterpolate(unref(t)("settings.interface"))}</h2></div><div class="space-y-4"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.theme"))}</label>`);
        _push(ssrRenderComponent(_component_USelect, {
          modelValue: unref(theme),
          "onUpdate:modelValue": ($event) => isRef(theme) ? theme.value = $event : null,
          options: unref(themeOptions),
          "option-attribute": "label",
          "value-attribute": "value",
          color: "neutral",
          variant: "outline",
          class: "w-full"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.itemsPerPage"))}</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(itemsPerPage),
          "onUpdate:modelValue": ($event) => isRef(itemsPerPage) ? itemsPerPage.value = $event : null,
          type: "number",
          min: "10",
          max: "100",
          color: "neutral",
          variant: "outline"
        }, null, _parent));
        _push(`</div></div><span class="bl"></span><span class="br2"></span></div><div class="bracket p-4"><div class="flex items-center gap-2 mb-4">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-down-circle",
          class: "w-5 h-5 text-halation"
        }, null, _parent));
        _push(`<h2 class="text-lg font-bold text-phosphor">${ssrInterpolate(unref(t)("settings.downloads"))}</h2></div><div class="space-y-4"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.defaultDownloadPath"))}</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(defaultDownloadPath),
          "onUpdate:modelValue": ($event) => isRef(defaultDownloadPath) ? defaultDownloadPath.value = $event : null,
          placeholder: "/downloads",
          color: "neutral",
          variant: "outline"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.maxActiveDownloads"))}</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(maxActiveDownloads),
          "onUpdate:modelValue": ($event) => isRef(maxActiveDownloads) ? maxActiveDownloads.value = $event : null,
          type: "number",
          min: "1",
          max: "50",
          color: "neutral",
          variant: "outline"
        }, null, _parent));
        _push(`</div><div class="grid grid-cols-2 gap-4"><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.downloadSpeedLimit"))}</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(downloadSpeedLimit),
          "onUpdate:modelValue": ($event) => isRef(downloadSpeedLimit) ? downloadSpeedLimit.value = $event : null,
          type: "number",
          min: "0",
          placeholder: unref(t)("settings.unlimited"),
          color: "neutral",
          variant: "outline"
        }, null, _parent));
        _push(`</div><div><label class="block text-sm font-bold mb-2 text-ghost">${ssrInterpolate(unref(t)("settings.uploadSpeedLimit"))}</label>`);
        _push(ssrRenderComponent(_component_UInput, {
          modelValue: unref(uploadSpeedLimit),
          "onUpdate:modelValue": ($event) => isRef(uploadSpeedLimit) ? uploadSpeedLimit.value = $event : null,
          type: "number",
          min: "0",
          placeholder: unref(t)("settings.unlimited"),
          color: "neutral",
          variant: "outline"
        }, null, _parent));
        _push(`</div></div></div><span class="bl"></span><span class="br2"></span></div><div class="flex justify-end">`);
        _push(ssrRenderComponent(_component_UButton, {
          class: "btn-bracket",
          loading: unref(isLoading),
          size: "lg",
          onClick: saveSettings
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(t)("settings.save"))} <span class="bl"${_scopeId}></span><span class="br2"${_scopeId}></span>`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(t)("settings.save")) + " ", 1),
                createVNode("span", { class: "bl" }),
                createVNode("span", { class: "br2" })
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div>`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-tmJqJTUy.mjs.map
