export default defineAppConfig({
  ui: {
    primary: 'phosphor',
    gray: 'slate',
    
    button: {
      slots: {
        base: 'font-karla font-bold tracking-wide uppercase text-xs',
      },
      variants: {
        color: {
          primary: 'bg-phosphor text-deep-field hover:bg-static',
          neutral: 'bg-transparent border border-white/25 text-phosphor hover:bg-white/5',
        },
        variant: {
          solid: '',
          outline: 'border border-scan text-phosphor',
          ghost: 'text-phosphor hover:bg-white/5',
        },
        size: {
          xs: 'px-2 py-1 text-[10px]',
          sm: 'px-3 py-1.5 text-[11px]',
          md: 'px-4 py-2 text-xs',
          lg: 'px-5 py-2.5 text-sm',
        }
      },
      defaultVariants: {
        color: 'primary',
        variant: 'solid',
        size: 'md',
      }
    },

    input: {
      slots: {
        base: 'font-mono text-sm bg-transparent border-b border-white/20 text-phosphor placeholder:text-flicker/50 focus:border-halation',
      },
      variants: {
        size: {
          xs: 'h-7 text-xs px-2',
          sm: 'h-8 text-sm px-2.5',
          md: 'h-9 text-sm px-3',
          lg: 'h-10 text-base px-4',
        }
      }
    },

    select: {
      slots: {
        base: 'font-mono text-sm bg-transparent border border-scan text-phosphor rounded-none',
        placeholder: 'text-ghost/60',
        value: 'text-phosphor',
        trailingIcon: 'text-ghost/60',
        content: 'bg-deep-field border border-scan/50 rounded-none shadow-lg',
        viewport: 'divide-y divide-scan/20',
        item: 'font-karla text-sm text-ghost hover:bg-electric hover:text-phosphor rounded-none',
        itemLabel: 'text-ghost',
        itemTrailingIcon: 'text-halation',
        label: 'font-karla text-sm text-ghost',
        separator: 'bg-scan/30',
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
          outline: 'border-scan text-phosphor',
          ghost: 'border-transparent text-phosphor hover:bg-electric/20',
        },
      },
      defaultVariants: {
        size: 'md',
        color: 'primary',
        variant: 'outline',
      }
    },

    card: {
      slots: {
        root: 'bg-deep-field border border-scan/30',
        header: 'p-3 border-b border-scan/20',
        body: 'p-3',
        footer: 'p-3 border-t border-scan/20',
      },
    },

    tabs: {
      slots: {
        list: 'gap-0 border-b border-scan/30',
        trigger: 'font-karla text-xs font-bold uppercase tracking-wide text-ghost hover:text-phosphor data-[active=true]:text-halation data-[active=true]:border-b-2 data-[active=true]:border-halation -mb-px',
      },
    },

    modal: {
      slots: {
        overlay: 'bg-void/80',
        content: 'bg-deep-field border border-scan/50',
        header: 'p-4 border-b border-scan/30',
        body: 'p-4',
        footer: 'p-4 border-t border-scan/30',
      },
    },

    dropdown: {
      slots: {
        root: 'bg-deep-field border border-scan/50',
        label: 'font-karla text-sm text-ghost hover:bg-electric hover:text-phosphor',
      },
    },

    table: {
      slots: {
        root: 'border-collapse',
        th: 'font-mono text-[10px] uppercase tracking-widest text-ghost/60 border-b border-scan/30 px-3 py-2 text-left',
        td: 'font-karla text-sm text-ghost border-b border-scan/20 px-3 py-2',
      },
    },

    alert: {
      slots: {
        root: 'border font-mono text-xs rounded-none',
        title: 'font-bold text-phosphor',
        description: 'text-ghost',
        icon: 'shrink-0',
      },
      variants: {
        color: {
          error: 'bg-[#EFF3FF] text-[#0E1E8A] border-[#EFF3FF]',
          success: 'bg-[rgba(100,255,180,0.1)] text-[#80FFB8] border-[rgba(100,255,180,0.2)]',
          warning: 'bg-[rgba(255,209,102,0.1)] text-[#FFD166] border-[rgba(255,209,102,0.25)]',
          info: 'bg-[rgba(150,170,255,0.1)] text-[#96AAFF] border-[rgba(150,170,255,0.2)]',
        },
        variant: {
          solid: '',
          outline: 'bg-transparent',
        }
      },
      defaultVariants: {
        color: 'error',
        variant: 'outline',
      }
    },

    badge: {
      slots: {
        base: 'font-mono text-[10px] uppercase tracking-wider',
      },
    },

    tooltip: {
      slots: {
        content: 'bg-deep-field border border-scan/50 font-karla text-xs text-phosphor',
      },
    },
  }
})
