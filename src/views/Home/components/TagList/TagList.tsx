import clsx from 'clsx'
import type { KeyboardEvent, MouseEvent } from 'react'

import { getRefinedStringValue } from '@/utils'

import { TagButtonWithCount } from '../TagButtonWithCount'
import * as styles from './TagList.module.scss'

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
      const value = getRefinedStringValue(fieldValue)

      return (
        <li key={value} className={styles.tagItem} data-tag={value}>
          <TagButtonWithCount name={value} count={totalCount} isSelected={selectedTag === value} />
        </li>
      )
    })}
  </ul>
)
