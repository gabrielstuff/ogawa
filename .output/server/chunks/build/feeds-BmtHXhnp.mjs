import { _ as __nuxt_component_0$1, a as _sfc_main$1$1, b as _sfc_main$4 } from './Input-BFyyn_nu.mjs';
import { _ as __nuxt_component_3$1, a as _sfc_main$1$2, b as _sfc_main$3 } from './Card-DpS2aBpy.mjs';
import { c as useI18n, u as useHead, a as _sfc_main$8, b as useFetch } from './server.mjs';
import { defineComponent, computed, ref, mergeProps, unref, withCtx, createTextVNode, toDisplayString, createVNode, isRef, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
import 'reka-ui';
import '@vueuse/core';
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
import 'tailwind-variants';
import '@iconify/utils/lib/css/icon';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "FeedCard",
  __ssrInlineRender: true,
  props: {
    feed: {}
  },
  emits: ["delete"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bracket p-4" }, _attrs))}><div class="flex items-center justify-between"><div class="flex-1 min-w-0"><h3 class="font-bold text-ink-0 truncate">${ssrInterpolate(__props.feed.title)}</h3><p class="text-sm font-mono text-ink-3/60 truncate">${ssrInterpolate(__props.feed.url)}</p><div class="flex gap-4 mt-2 text-xs font-mono text-ink-3/40"><span>${ssrInterpolate(__props.feed.items?.length || 0)} items</span><span>${ssrInterpolate(__props.feed.lastUpdated ? new Date(__props.feed.lastUpdated).toLocaleDateString() : "never")}</span></div></div><div class="flex gap-2 ml-4">`);
      _push(ssrRenderComponent(_component_UButton, {
        variant: "ghost",
        color: "error",
        icon: "i-heroicons-trash",
        onClick: ($event) => emit("delete", __props.feed.id)
      }, null, _parent));
      _push(`</div></div><span class="bl"></span><span class="br2"></span></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeedCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = Object.assign(_sfc_main$2, { __name: "FeedCard" });
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "FeedList",
  __ssrInlineRender: true,
  props: {
    feeds: {}
  },
  emits: ["delete"],
  setup(__props, { emit: __emit }) {
    const emit = __emit;
    return (_ctx, _push, _parent, _attrs) => {
      const _component_FeedCard = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "space-y-3" }, _attrs))}><!--[-->`);
      ssrRenderList(__props.feeds, (feed) => {
        _push(ssrRenderComponent(_component_FeedCard, {
          key: feed.id,
          feed,
          onDelete: ($event) => emit("delete", $event)
        }, null, _parent));
      });
      _push(`<!--]--></div>`);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeedList.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = Object.assign(_sfc_main$1, { __name: "FeedList" });
const useFeeds = () => {
  const { data: feeds, refresh } = useFetch(
    "/api/feeds",
    "$BOzRuXDAwL"
    /* nuxt-injected */
  );
  const addFeed = async (url) => {
    await $fetch("/api/feeds", {
      method: "POST",
      body: { url }
    });
    refresh();
  };
  const deleteFeed = async (id) => {
    await $fetch(`/api/feeds/${id}`, {
      method: "DELETE"
    });
    refresh();
  };
  return {
    feeds,
    refresh,
    addFeed,
    deleteFeed
  };
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "feeds",
  __ssrInlineRender: true,
  setup(__props) {
    const { t } = useI18n();
    useHead({
      title: computed(() => `${t("feeds.title")} - Ogawa`)
    });
    const { feeds, addFeed, deleteFeed } = useFeeds();
    const showAddModal = ref(false);
    const newFeedUrl = ref("");
    const isLoading = ref(false);
    const error = ref("");
    async function handleAddFeed() {
      if (!newFeedUrl.value) return;
      isLoading.value = true;
      error.value = "";
      try {
        await addFeed(newFeedUrl.value);
        showAddModal.value = false;
        newFeedUrl.value = "";
      } catch (e) {
        const err = e;
        error.value = err.message || t("feeds.addFailed");
      } finally {
        isLoading.value = false;
      }
    }
    async function handleDeleteFeed(id) {
      try {
        await deleteFeed(id);
      } catch (e) {
        const err = e;
        error.value = err.message || t("feeds.deleteFailed");
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_UButtonBracket = __nuxt_component_0$1;
      const _component_UAlert = _sfc_main$1$1;
      const _component_EmptyState = __nuxt_component_3$1;
      const _component_FeedList = __nuxt_component_3;
      const _component_UModal = _sfc_main$1$2;
      const _component_UCard = _sfc_main$3;
      const _component_UInput = _sfc_main$4;
      const _component_UButton = _sfc_main$8;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-4" }, _attrs))}><div class="mb-6 bracket-lg px-4 py-3"><div class="flex items-center justify-between"><h1 class="text-2xl font-bold text-ink-0">${ssrInterpolate(unref(t)("feeds.title"))}</h1>`);
      _push(ssrRenderComponent(_component_UButtonBracket, {
        variant: "bracket",
        icon: "i-heroicons-plus",
        onClick: ($event) => showAddModal.value = true
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(unref(t)("feeds.addFeed"))}`);
          } else {
            return [
              createTextVNode(toDisplayString(unref(t)("feeds.addFeed")), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><p class="header-meta"> RSS feed management for automated torrent downloads </p><span class="bl"></span><span class="br2"></span></div>`);
      if (unref(error)) {
        _push(ssrRenderComponent(_component_UAlert, {
          color: "error",
          variant: "solid",
          class: "mb-4 font-mono"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(unref(error))}`);
            } else {
              return [
                createTextVNode(toDisplayString(unref(error)), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      if (!unref(feeds) || unref(feeds).length === 0) {
        _push(ssrRenderComponent(_component_EmptyState, {
          title: unref(t)("feeds.noFeeds"),
          subtitle: "Add RSS feeds to automatically download torrents",
          icon: unref(t)("feeds.noFeeds") ? "" : "i-heroicons-rss"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_UButtonBracket, {
                variant: "bracket",
                onClick: ($event) => showAddModal.value = true
              }, {
                default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                  if (_push3) {
                    _push3(`${ssrInterpolate(unref(t)("feeds.addFirstFeed"))}`);
                  } else {
                    return [
                      createTextVNode(toDisplayString(unref(t)("feeds.addFirstFeed")), 1)
                    ];
                  }
                }),
                _: 1
              }, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_UButtonBracket, {
                  variant: "bracket",
                  onClick: ($event) => showAddModal.value = true
                }, {
                  default: withCtx(() => [
                    createTextVNode(toDisplayString(unref(t)("feeds.addFirstFeed")), 1)
                  ]),
                  _: 1
                }, 8, ["onClick"])
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(ssrRenderComponent(_component_FeedList, {
          feeds: unref(feeds),
          onDelete: handleDeleteFeed
        }, null, _parent));
      }
      _push(ssrRenderComponent(_component_UModal, {
        modelValue: unref(showAddModal),
        "onUpdate:modelValue": ($event) => isRef(showAddModal) ? showAddModal.value = $event : null
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_UCard, null, {
              header: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<h2 class="text-lg font-bold text-ink-0"${_scopeId2}>${ssrInterpolate(unref(t)("feeds.addRssFeed"))}</h2>`);
                } else {
                  return [
                    createVNode("h2", { class: "text-lg font-bold text-ink-0" }, toDisplayString(unref(t)("feeds.addRssFeed")), 1)
                  ];
                }
              }),
              footer: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="flex justify-end gap-2"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UButton, {
                    class: "btn-ghost",
                    onClick: ($event) => showAddModal.value = false
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(t)("feeds.cancel"))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(t)("feeds.cancel")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(ssrRenderComponent(_component_UButtonBracket, {
                    variant: "bracket",
                    loading: unref(isLoading),
                    disabled: !unref(newFeedUrl),
                    onClick: handleAddFeed
                  }, {
                    default: withCtx((_3, _push4, _parent4, _scopeId3) => {
                      if (_push4) {
                        _push4(`${ssrInterpolate(unref(t)("feeds.addFeed"))}`);
                      } else {
                        return [
                          createTextVNode(toDisplayString(unref(t)("feeds.addFeed")), 1)
                        ];
                      }
                    }),
                    _: 1
                  }, _parent3, _scopeId2));
                  _push3(`</div>`);
                } else {
                  return [
                    createVNode("div", { class: "flex justify-end gap-2" }, [
                      createVNode(_component_UButton, {
                        class: "btn-ghost",
                        onClick: ($event) => showAddModal.value = false
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t)("feeds.cancel")), 1)
                        ]),
                        _: 1
                      }, 8, ["onClick"]),
                      createVNode(_component_UButtonBracket, {
                        variant: "bracket",
                        loading: unref(isLoading),
                        disabled: !unref(newFeedUrl),
                        onClick: handleAddFeed
                      }, {
                        default: withCtx(() => [
                          createTextVNode(toDisplayString(unref(t)("feeds.addFeed")), 1)
                        ]),
                        _: 1
                      }, 8, ["loading", "disabled"])
                    ])
                  ];
                }
              }),
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(`<div class="space-y-4"${_scopeId2}><div class="input-bracket"${_scopeId2}>`);
                  _push3(ssrRenderComponent(_component_UInput, {
                    modelValue: unref(newFeedUrl),
                    "onUpdate:modelValue": ($event) => isRef(newFeedUrl) ? newFeedUrl.value = $event : null,
                    placeholder: unref(t)("feeds.feedUrlPlaceholder"),
                    size: "lg",
                    class: "w-full"
                  }, null, _parent3, _scopeId2));
                  _push3(`<span class="bl"${_scopeId2}></span><span class="br2"${_scopeId2}></span></div></div>`);
                } else {
                  return [
                    createVNode("div", { class: "space-y-4" }, [
                      createVNode("div", { class: "input-bracket" }, [
                        createVNode(_component_UInput, {
                          modelValue: unref(newFeedUrl),
                          "onUpdate:modelValue": ($event) => isRef(newFeedUrl) ? newFeedUrl.value = $event : null,
                          placeholder: unref(t)("feeds.feedUrlPlaceholder"),
                          size: "lg",
                          class: "w-full"
                        }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                        createVNode("span", { class: "bl" }),
                        createVNode("span", { class: "br2" })
                      ])
                    ])
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_UCard, null, {
                header: withCtx(() => [
                  createVNode("h2", { class: "text-lg font-bold text-ink-0" }, toDisplayString(unref(t)("feeds.addRssFeed")), 1)
                ]),
                footer: withCtx(() => [
                  createVNode("div", { class: "flex justify-end gap-2" }, [
                    createVNode(_component_UButton, {
                      class: "btn-ghost",
                      onClick: ($event) => showAddModal.value = false
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("feeds.cancel")), 1)
                      ]),
                      _: 1
                    }, 8, ["onClick"]),
                    createVNode(_component_UButtonBracket, {
                      variant: "bracket",
                      loading: unref(isLoading),
                      disabled: !unref(newFeedUrl),
                      onClick: handleAddFeed
                    }, {
                      default: withCtx(() => [
                        createTextVNode(toDisplayString(unref(t)("feeds.addFeed")), 1)
                      ]),
                      _: 1
                    }, 8, ["loading", "disabled"])
                  ])
                ]),
                default: withCtx(() => [
                  createVNode("div", { class: "space-y-4" }, [
                    createVNode("div", { class: "input-bracket" }, [
                      createVNode(_component_UInput, {
                        modelValue: unref(newFeedUrl),
                        "onUpdate:modelValue": ($event) => isRef(newFeedUrl) ? newFeedUrl.value = $event : null,
                        placeholder: unref(t)("feeds.feedUrlPlaceholder"),
                        size: "lg",
                        class: "w-full"
                      }, null, 8, ["modelValue", "onUpdate:modelValue", "placeholder"]),
                      createVNode("span", { class: "bl" }),
                      createVNode("span", { class: "br2" })
                    ])
                  ])
                ]),
                _: 1
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/feeds.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=feeds-BmtHXhnp.mjs.map
