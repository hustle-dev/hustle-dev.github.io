import { useCallback, useEffect, useState } from 'react'
import { optimizedScroll } from '@/utils'

export const useScrollIndicator = (pathname: string) => {
  const isHome = pathname === '/'
  const [progressWidth, setProgressWidth] = useState<number>(0)

  const updateProgress = useCallback(() => {
    const $html = document.documentElement
    const scrollHeight = $html.scrollHeight - $html.clientHeight
    const scrollPosition = window.scrollY
    const scrollProgress = (scrollPosition / scrollHeight) * 100
    setProgressWidth(scrollProgress)
  }, [])

  useEffect(() => {
    if (isHome) return

    window.addEventListener('scroll', optimizedScroll(updateProgress))
    return () => window.removeEventListener('scroll', optimizedScroll(updateProgress))
  }, [isHome, updateProgress])

  return { isHome, progressWidth }
}
