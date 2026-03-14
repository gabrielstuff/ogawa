import { useMediaQuery } from '@vueuse/core'

export const useResponsive = () => {
  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
  }

  const isMobile = useMediaQuery(`(max-width: ${breakpoints.md - 1}px)`)
  const isDesktop = useMediaQuery(`(min-width: ${breakpoints.md}px)`)

  return { isMobile, isDesktop, breakpoints }
}
