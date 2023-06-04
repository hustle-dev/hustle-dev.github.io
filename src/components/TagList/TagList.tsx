import React from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import clsx from 'clsx'
import { TagButton } from '../Tag'
import { getRefinedTagValue } from '@/utils'
import * as styles from './TagList.module.css'

type TagListProps = {
  tags: { fieldValue: string | null; totalCount: number }[]
  selectedTag: string
  clickTag: (e: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => void
  className?: string
}

export const TagList = ({ tags, selectedTag, clickTag, className }: TagListProps) => (
  <ul
    className={clsx(styles.tagList, className)}
    onClick={(e) => clickTag(e)}
    onKeyDown={(e) => clickTag(e)}
    role="presentation"
  >
    {tags.map(({ fieldValue, totalCount }) => {
      const value = getRefinedTagValue(fieldValue)

      return (
        <li key={value} className={styles.tagItem} data-tag={value}>
          <TagButton name={value} count={totalCount} isSelected={selectedTag === value} />
        </li>
      )
    })}
  </ul>
)
