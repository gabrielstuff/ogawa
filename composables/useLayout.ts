export const useLayout = () => {
  const config = useAppConfig()
  const device = useDevice()
  const sidebarCollapsed = useState('sidebarCollapsed', () => false)

  const isMobile = computed(() => device.isMobile)
  const isDesktop = computed(() => device.isDesktop)

  const navItems = computed(() => device.isMobile 
    ? (config.layout?.mobileNavItems || [])
    : (config.layout?.desktopNavItems || [])
  )
  const settingsItem = computed(() => config.layout?.settingsItem)
  const mobileBreakpoint = computed(() => config.layout?.mobileBreakpoint || 768)
  const sidebarWidth = computed(() => config.layout?.sidebarWidth || 56)

  return {
    navItems,
    settingsItem,
    isMobile,
    isDesktop,
    sidebarCollapsed,
    mobileBreakpoint,
    sidebarWidth,
  }
}
