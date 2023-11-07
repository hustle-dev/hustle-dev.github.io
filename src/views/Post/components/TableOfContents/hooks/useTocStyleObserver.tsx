import { useEffect, useRef } from 'react'

import * as styles from '../TableOfContents.module.scss'

export const useTocStyleObserver = () => {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const tocItem = ref.current?.querySelector(`a[href="#${encodeURI(id)}"]`)

            if (!tocItem) return

            const prevActiveItem = ref.current?.querySelector(`.${styles.active}`)
            if (prevActiveItem) prevActiveItem.classList.remove(styles.active)

            tocItem.classList.add(styles.active)
          }
        })
      },
      {
        rootMargin: '0% 0% -90% 0%',
        threshold: 0,
      }
    )

    const headings = document.querySelectorAll('h2[id], h3[id]')
    headings.forEach((heading) => observer.observe(heading))
    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [ref])

  return { ref }
}
