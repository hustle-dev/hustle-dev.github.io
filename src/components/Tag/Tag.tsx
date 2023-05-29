import React from 'react'
import * as typo from '@/styles/typography.module.css'
import * as styles from './Tag.module.css'
import type { TagProps } from './types'

export const Tag = ({ name, style }: TagProps) => {
  return (
    <div style={style} className={styles.tag}>
      <span className={typo.B7}>{name}</span>
    </div>
  )
}
