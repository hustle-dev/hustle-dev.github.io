import { useEffect, useRef } from 'react'

import { Theme, useTheme } from '@/contexts'

export const Giscus = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    if (containerRef.current === null) return

    const $div = containerRef.current

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'hustle-dev/hustle-dev.github.io')
    script.setAttribute('data-repo-id', 'R_kgDOJUJ_0Q')
    script.setAttribute('data-category', 'Comments')
    script.setAttribute('data-category-id', 'DIC_kwDOJUJ_0c4CVoHk')
    script.setAttribute('data-mapping', 'og:title')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'bottom')
    script.setAttribute(
      'data-theme',
      theme === Theme.LIGHT
        ? 'light'
        : 'https://cdn.jsdelivr.net/gh/hustle-dev/hustle-dev.github.io@main/src/components/Giscus/custom-giscus-theme.css'
    )
    script.setAttribute('data-lang', 'ko')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true
    $div.appendChild(script)

    return () => {
      if ($div === null) return
      $div.removeChild(script)
    }
  }, [theme])

  return <div id="comment" ref={containerRef} />
}
