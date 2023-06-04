import React from 'react'
import { TagProps } from './types'
import * as styles from './Tag.module.css'
import * as typo from '@/styles/typography.module.css'

type TagButtonProps = TagProps & {
  count: number
  onClick?: () => void
  isSelected: boolean
}

export const TagButton = ({ name, count, onClick, isSelected }: TagButtonProps) => {
  return (
    <button onClick={onClick} className={`${styles.tagButton} ${isSelected ? styles.active : ''}`}>
      <span className={typo.B5}>
        {name} ({count})
      </span>
    </button>
  )
}
