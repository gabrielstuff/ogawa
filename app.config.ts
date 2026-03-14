export default defineAppConfig({
  layout: {
    mobileBreakpoint: 768,
    sidebarWidth: 56,
    mobileNavItems: [
      { name: 'nav.torrents', path: '/', icon: 'i-heroicons-arrow-down-circle' },
      { name: 'nav.add', icon: 'i-heroicons-plus-circle', action: 'addTorrent' },
      { name: 'nav.feeds', path: '/feeds', icon: 'i-heroicons-rss' },
    ],
    desktopNavItems: [
      { name: 'nav.torrents', path: '/', icon: 'i-heroicons-arrow-down-circle' },
      { name: 'nav.feeds', path: '/feeds', icon: 'i-heroicons-rss' },
    ],
    settingsItem: { name: 'nav.settings', path: '/settings', icon: 'i-heroicons-cog-6-tooth' },
  },

  ui: {
    primary: 'accent',
    gray: 'slate',

    button: {
      slots: {
        base: 'font-karla font-semibold tracking-wide uppercase text-xs',
      },
      variants: {
        color: {
          primary: 'bg-accent text-white hover:bg-accent-h',
          neutral: 'bg-white border border-line-strong text-ink-1 hover:bg-accent-t',
        },
        variant: {
          solid: '',
          outline: 'border border-line-strong text-ink-1 bg-white',
          ghost: 'text-ink-0 bg-white/50 border border-white/85 hover:bg-white/78',
        },
        size: {
          xs: 'px-2 py-1 text-[10px]',
          sm: 'px-3 py-1.5 text-[11px]',
          md: 'px-4 py-2 text-xs',
          lg: 'px-5 py-2.5 text-sm',
        },
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
      },
    },

    input: {
      slots: {
        base: 'font-mono text-sm bg-white border border-line-strong text-ink-1 placeholder:text-ink-4 focus:border-accent',
      },
      variants: {
        size: {
          xs: 'h-7 text-xs px-2',
          sm: 'h-8 text-sm px-2.5',
          md: 'h-9 text-sm px-3',
          lg: 'h-10 text-base px-4',
        },
      },
    },

    select: {
      slots: {
        base: 'font-mono text-sm bg-white border border-line-strong text-ink-1',
        placeholder: 'text-ink-4',
        value: 'text-ink-1',
        trailingIcon: 'text-ink-4',
        content: 'bg-surface border border-line-strong shadow-lg',
        viewport: 'divide-y divide-line/20',
        item: 'font-karla text-sm text-ink-3 hover:bg-accent-t hover:text-ink-1',
        itemLabel: 'text-ink-3',
        itemTrailingIcon: 'text-accent',
        label: 'font-karla text-sm text-ink-3',
        separator: 'bg-line/30',
      },
      variants: {
        size: {
          xs: 'h-7 text-xs px-2',
          sm: 'h-8 text-sm px-2.5',
          md: 'h-9 text-sm px-3',
          lg: 'h-10 text-base px-4',
        },
        color: {
          primary: '',
        },
        variant: {
          outline: 'border-line-strong text-ink-1',
          ghost: 'border-transparent text-ink-1 hover:bg-surface',
        },
      },
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline',
      },
    },

    card: {
      slots: {
        root: 'bg-surface border border-line',
        header: 'p-3 border-b border-line',
        body: 'p-3',
        footer: 'p-3 border-t border-line',
      },
    },

    tabs: {
      slots: {
        list: 'gap-0 border-b border-line',
        trigger: 'font-karla text-xs font-semibold uppercase tracking-wide text-ink-3 hover:text-ink-1 data-[active=true]:text-accent data-[active=true]:border-b-2 data-[active=true]:border-accent -mb-px',
      },
    },

    modal: {
      slots: {
        overlay: 'bg-ink-0/50',
        content: 'bg-surface border border-line-strong',
        header: 'p-4 border-b border-line',
        body: 'p-4',
        footer: 'p-4 border-t border-line',
      },
    },

    dropdown: {
      slots: {
        root: 'bg-surface border border-line-strong',
        label: 'font-karla text-sm text-ink-3 hover:bg-accent-t hover:text-ink-1',
      },
    },

    table: {
      slots: {
        root: 'border-collapse',
        th: 'font-mono text-[10px] uppercase tracking-widest text-ink-3 border-b border-line px-3 py-2 text-left',
        td: 'font-karla text-sm text-ink-2 border-b border-line/50 px-3 py-2',
      },
    },

    toast: {
      slots: {
        root: 'relative group overflow-hidden bg-surface border border-line-strong shadow-lg rounded-none p-4 flex gap-3 focus:outline-none font-mono',
        wrapper: 'w-0 flex-1 flex flex-col gap-0.5',
        title: 'text-xs font-semibold uppercase tracking-widest text-ink-0',
        description: 'text-xs text-ink-3',
        icon: 'shrink-0 size-4 mt-0.5',
        actions: 'flex gap-1.5 shrink-0',
        progress: 'absolute inset-x-0 bottom-0 h-[2px]',
        close: 'p-0',
      },
      variants: {
        color: {
          success: { root: 'border-green-line', icon: 'text-green' },
          error: { root: 'border-red-line', icon: 'text-red' },
          warning: { root: 'border-amber-line', icon: 'text-amber' },
          info: { root: 'border-line-strong', icon: 'text-ink-3' },
          neutral: { root: 'border-line-strong', icon: 'text-ink-2' },
        },
      },
    },

    alert: {
      slots: {
        root: 'border font-mono text-xs',
        title: 'font-semibold',
        description: 'opacity-80',
        icon: 'shrink-0',
      },
      defaultVariants: {
        variant: 'soft',
      },
    },

    badge: {
      slots: {
        base: 'font-mono text-[10px] uppercase tracking-wider',
      },
    },

    tooltip: {
      slots: {
        content: 'bg-surface border border-line-strong font-karla text-xs text-ink-1',
      },
    },
  },
})
