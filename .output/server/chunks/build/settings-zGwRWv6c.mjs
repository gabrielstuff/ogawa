import { u as useHead, k as useFetch, e as _sfc_main$d, h as _sfc_main$8 } from './server.mjs';
import { _ as _sfc_main$1 } from './Card-BG0rlUjH.mjs';
import { _ as _sfc_main$2 } from './Input-DLjUUt2w.mjs';
import { _ as _sfc_main$3 } from './Alert-DHABDpit.mjs';
import { _ as _sfc_main$4 } from './Select-UBs4tq0q.mjs';
import { defineComponent, withAsyncContext, ref, mergeProps, unref, withCtx, isRef, createTextVNode, toDisplayString, createVNode, openBlock, createBlock, createCommentVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
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
    useHead({
      title: "Settings - Ogawa"
    });
    const { data: settings, pending, refresh } = ([__temp, __restore] = withAsyncContext(() => useFetch(
      "/api/settings",
      "$30WfwEn-ZB"
      /* nuxt-injected */
    )), __temp = await __temp, __restore(), __temp);
    const isLoading = ref(false);
    const testStatus = ref("idle");
    const testMessage = ref("");
    const clientUrl = ref("");
    const clientUsername = ref("");
    const clientPassword = ref("");
    const theme = ref("system");
    const itemsPerPage = ref(20);
    const defaultDownloadPath = ref("");
    const maxActiveDownloads = ref(3);
    const downloadSpeedLimit = ref(0);
    const uploadSpeedLimit = ref(0);
    const themeOptions = [
      { value: "system", label: "System" },
      { value: "light", label: "Light" },
      { value: "dark", label: "Dark" }
    ];
    async function saveSettings() {
      isLoading.value = true;
      try {
        await $fetch("/api/settings", {
          method: "PATCH",
          body: {
            client: {
              url: clientUrl.value,
              username: clientUsername.value,
              password: clientPassword.value
            },
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
            url: clientUrl.value,
            username: clientUsername.value,
            password: clientPassword.value
          }
        });
        testStatus.value = "success";
        testMessage.value = "Connection successful!";
      } catch (e) {
        testStatus.value = "error";
        testMessage.value = e.message || "Connection failed";
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UIcon = _sfc_main$d;
      const _component_UCard = _sfc_main$1;
      const _component_UInput = _sfc_main$2;
      const _component_UButton = _sfc_main$8;
      const _component_UAlert = _sfc_main$3;
      const _component_USelect = _sfc_main$4;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4 max-w-2xl mx-auto" }, _attrs))}><h1 class="text-2xl font-bold mb-6">Settings</h1>`);
      if (unref(pending)) {
        _push(`<div class="flex justify-center py-8">`);
        _push(ssrRenderComponent(_component_UIcon, {
          name: "i-heroicons-arrow-path",
          class: "w-8 h-8 animate-spin text-primary-500"
        }, null, _parent));
        _push(`</div>`);
      } else {
        _push(`<div class="space-y-6">`);
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-lg font-semibold flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-server-stack",
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(` Connection </h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-lg font-semibold flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-server-stack",
                    class: "w-5 h-5"
                  }),
                  createTextVNode(" Connection ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>qBittorrent URL</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(clientUrl),
                "onUpdate:modelValue": ($event) => isRef(clientUrl) ? clientUrl.value = $event : null,
                placeholder: "http://localhost:8080"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Username</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(clientUsername),
                "onUpdate:modelValue": ($event) => isRef(clientUsername) ? clientUsername.value = $event : null,
                placeholder: "admin"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Password</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(clientPassword),
                "onUpdate:modelValue": ($event) => isRef(clientPassword) ? clientPassword.value = $event : null,
                type: "password",
                placeholder: "••••••••"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="flex gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UButton, {
                loading: unref(testStatus) === "testing",
                variant: "outline",
                onClick: testConnection
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(` Test Connection `);
                  } else {
                    return [
                      createTextVNode(" Test Connection ")
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
              _push2(`</div>`);
              if (unref(testStatus) === "success") {
                _push2(ssrRenderComponent(_component_UAlert, {
                  color: "success",
                  variant: "solid"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(testMessage))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(testMessage)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              if (unref(testStatus) === "error") {
                _push2(ssrRenderComponent(_component_UAlert, {
                  color: "error",
                  variant: "solid"
                }, {
                  default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                    if (_push3) {
                      _push3(`${ssrInterpolate(unref(testMessage))}`);
                    } else {
                      return [
                        createTextVNode(toDisplayString(unref(testMessage)), 1)
                      ];
                    }
                  }),
                  _: 1
                }, _parent2, _scopeId));
              } else {
                _push2(`<!---->`);
              }
              _push2(`</div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "qBittorrent URL"),
                    createVNode(_component_UInput, {
                      modelValue: unref(clientUrl),
                      "onUpdate:modelValue": ($event) => isRef(clientUrl) ? clientUrl.value = $event : null,
                      placeholder: "http://localhost:8080"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Username"),
                    createVNode(_component_UInput, {
                      modelValue: unref(clientUsername),
                      "onUpdate:modelValue": ($event) => isRef(clientUsername) ? clientUsername.value = $event : null,
                      placeholder: "admin"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Password"),
                    createVNode(_component_UInput, {
                      modelValue: unref(clientPassword),
                      "onUpdate:modelValue": ($event) => isRef(clientPassword) ? clientPassword.value = $event : null,
                      type: "password",
                      placeholder: "••••••••"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "flex gap-2" }, [
                    createVNode(_component_UButton, {
                      loading: unref(testStatus) === "testing",
                      variant: "outline",
                      onClick: testConnection
                    }, {
                      default: withCtx(() => [
                        createTextVNode(" Test Connection ")
                      ]),
                      _: 1
                    }, 8, ["loading"])
                  ]),
                  unref(testStatus) === "success" ? (openBlock(), createBlock(_component_UAlert, {
                    key: 0,
                    color: "success",
                    variant: "solid"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(testMessage)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true),
                  unref(testStatus) === "error" ? (openBlock(), createBlock(_component_UAlert, {
                    key: 1,
                    color: "error",
                    variant: "solid"
                  }, {
                    default: withCtx(() => [
                      createTextVNode(toDisplayString(unref(testMessage)), 1)
                    ]),
                    _: 1
                  })) : createCommentVNode("", true)
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-lg font-semibold flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-paint-brush",
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(` Interface </h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-lg font-semibold flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-paint-brush",
                    class: "w-5 h-5"
                  }),
                  createTextVNode(" Interface ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Theme</label>`);
              _push2(ssrRenderComponent(_component_USelect, {
                modelValue: unref(theme),
                "onUpdate:modelValue": ($event) => isRef(theme) ? theme.value = $event : null,
                options: themeOptions,
                "option-attribute": "label",
                "value-attribute": "value"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Items per page</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(itemsPerPage),
                "onUpdate:modelValue": ($event) => isRef(itemsPerPage) ? itemsPerPage.value = $event : null,
                type: "number",
                min: "10",
                max: "100"
              }, null, _parent2, _scopeId));
              _push2(`</div></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Theme"),
                    createVNode(_component_USelect, {
                      modelValue: unref(theme),
                      "onUpdate:modelValue": ($event) => isRef(theme) ? theme.value = $event : null,
                      options: themeOptions,
                      "option-attribute": "label",
                      "value-attribute": "value"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Items per page"),
                    createVNode(_component_UInput, {
                      modelValue: unref(itemsPerPage),
                      "onUpdate:modelValue": ($event) => isRef(itemsPerPage) ? itemsPerPage.value = $event : null,
                      type: "number",
                      min: "10",
                      max: "100"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(ssrRenderComponent(_component_UCard, null, {
          header: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<h2 class="text-lg font-semibold flex items-center gap-2"${_scopeId}>`);
              _push2(ssrRenderComponent(_component_UIcon, {
                name: "i-heroicons-arrow-down-circle",
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(` Downloads </h2>`);
            } else {
              return [
                createVNode("h2", { class: "text-lg font-semibold flex items-center gap-2" }, [
                  createVNode(_component_UIcon, {
                    name: "i-heroicons-arrow-down-circle",
                    class: "w-5 h-5"
                  }),
                  createTextVNode(" Downloads ")
                ])
              ];
            }
          }),
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<div class="space-y-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Default download path</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(defaultDownloadPath),
                "onUpdate:modelValue": ($event) => isRef(defaultDownloadPath) ? defaultDownloadPath.value = $event : null,
                placeholder: "/downloads"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Max active downloads</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(maxActiveDownloads),
                "onUpdate:modelValue": ($event) => isRef(maxActiveDownloads) ? maxActiveDownloads.value = $event : null,
                type: "number",
                min: "1",
                max: "50"
              }, null, _parent2, _scopeId));
              _push2(`</div><div class="grid grid-cols-2 gap-4"${_scopeId}><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Download speed limit (KB/s)</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(downloadSpeedLimit),
                "onUpdate:modelValue": ($event) => isRef(downloadSpeedLimit) ? downloadSpeedLimit.value = $event : null,
                type: "number",
                min: "0",
                placeholder: "0 = unlimited"
              }, null, _parent2, _scopeId));
              _push2(`</div><div${_scopeId}><label class="block text-sm font-medium mb-2"${_scopeId}>Upload speed limit (KB/s)</label>`);
              _push2(ssrRenderComponent(_component_UInput, {
                modelValue: unref(uploadSpeedLimit),
                "onUpdate:modelValue": ($event) => isRef(uploadSpeedLimit) ? uploadSpeedLimit.value = $event : null,
                type: "number",
                min: "0",
                placeholder: "0 = unlimited"
              }, null, _parent2, _scopeId));
              _push2(`</div></div></div>`);
            } else {
              return [
                createVNode("div", { class: "space-y-4" }, [
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Default download path"),
                    createVNode(_component_UInput, {
                      modelValue: unref(defaultDownloadPath),
                      "onUpdate:modelValue": ($event) => isRef(defaultDownloadPath) ? defaultDownloadPath.value = $event : null,
                      placeholder: "/downloads"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", null, [
                    createVNode("label", { class: "block text-sm font-medium mb-2" }, "Max active downloads"),
                    createVNode(_component_UInput, {
                      modelValue: unref(maxActiveDownloads),
                      "onUpdate:modelValue": ($event) => isRef(maxActiveDownloads) ? maxActiveDownloads.value = $event : null,
                      type: "number",
                      min: "1",
                      max: "50"
                    }, null, 8, ["modelValue", "onUpdate:modelValue"])
                  ]),
                  createVNode("div", { class: "grid grid-cols-2 gap-4" }, [
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-2" }, "Download speed limit (KB/s)"),
                      createVNode(_component_UInput, {
                        modelValue: unref(downloadSpeedLimit),
                        "onUpdate:modelValue": ($event) => isRef(downloadSpeedLimit) ? downloadSpeedLimit.value = $event : null,
                        type: "number",
                        min: "0",
                        placeholder: "0 = unlimited"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ]),
                    createVNode("div", null, [
                      createVNode("label", { class: "block text-sm font-medium mb-2" }, "Upload speed limit (KB/s)"),
                      createVNode(_component_UInput, {
                        modelValue: unref(uploadSpeedLimit),
                        "onUpdate:modelValue": ($event) => isRef(uploadSpeedLimit) ? uploadSpeedLimit.value = $event : null,
                        type: "number",
                        min: "0",
                        placeholder: "0 = unlimited"
                      }, null, 8, ["modelValue", "onUpdate:modelValue"])
                    ])
                  ])
                ])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`<div class="flex justify-end">`);
        _push(ssrRenderComponent(_component_UButton, {
          loading: unref(isLoading),
          size: "lg",
          onClick: saveSettings
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Save Settings `);
            } else {
              return [
                createTextVNode(" Save Settings ")
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
//# sourceMappingURL=settings-zGwRWv6c.mjs.map
