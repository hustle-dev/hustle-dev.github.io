import React from 'react'
import clsx from 'clsx'
import Pen from '@/images/pen.svg'
import * as styles from './TableOfContents.module.css'
import * as typo from '@/styles/typography.module.css'
import { useTocStyleObserver } from './hooks'

type TableOfContentsProps = {
  html: string
}

export const TableOfContents = ({ html }: TableOfContentsProps) => {
  const { ref } = useTocStyleObserver()

  return (
    <div className={styles.wrapper}>
      <Pen className={styles.pen} />
      <div ref={ref} className={clsx(styles.tableOfContents, typo.B7)} dangerouslySetInnerHTML={{ __html: html }}></div>
    </div>
  )
}
