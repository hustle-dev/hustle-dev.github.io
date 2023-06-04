import React, { useEffect, useRef } from 'react'
import clsx from 'clsx'
import Pen from '@/images/pen.svg'
import * as styles from './TableOfContents.module.css'
import * as typo from '@/styles/typography.module.css'

type TableOfContentsProps = {
  html: string
}

export const TableOfContents = ({ html }: TableOfContentsProps) => {
  const tocRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.id
            const tocItem = tocRef.current?.querySelector(`a[href="#${encodeURI(id)}"]`)

            if (!tocItem) return

            const prevActiveItem = tocRef.current?.querySelector(`.${styles.active}`)
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

    const headings = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id]')
    headings.forEach((heading) => observer.observe(heading))

    return () => {
      headings.forEach((heading) => observer.unobserve(heading))
    }
  }, [])

  return (
    <div className={styles.wrapper}>
      <Pen className={styles.pen} />
      <div
        ref={tocRef}
        className={clsx(styles.tableOfContents, typo.B7)}
        dangerouslySetInnerHTML={{ __html: html }}
      ></div>
    </div>
  )
}
