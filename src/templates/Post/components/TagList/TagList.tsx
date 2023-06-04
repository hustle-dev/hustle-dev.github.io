import React from 'react'
import clsx from 'clsx'
import { Tag } from '@/components'
import * as styles from './TagList.module.css'

type TagListProps = {
  tags: readonly string[]
  className?: string
}

export const TagList = ({ tags, className }: TagListProps) => (
  <ul className={clsx(styles.tagList, className)}>
    {tags.map((tag) => (
      <Tag key={tag} name={tag} className={styles.tag}></Tag>
    ))}
  </ul>
)
