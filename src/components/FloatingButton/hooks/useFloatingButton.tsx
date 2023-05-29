import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 200

export const useFloatingButton = () => {
  const [isVisible, setIsVisible] = useState<boolean>(false)

  const handleScroll = () => {
    const currentScrollY = window.scrollY
    setIsVisible(currentScrollY > SCROLL_THRESHOLD)
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return { isVisible, scrollToTop }
}
