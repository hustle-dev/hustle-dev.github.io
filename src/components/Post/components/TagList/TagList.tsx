import clsx from 'clsx'
import React from 'react'
import { Tag } from '@/components'
import * as styles from './TagList.module.css'

type TagListProps = {
  tags: readonly string[]
  className?: string
}

export const TagList = ({ tags, className }: TagListProps) => {
  const classNames = clsx(styles.tagList, className)
  return (
    <ul className={classNames}>
      {tags.map((tag) => (
        <Tag key={tag} name={tag}></Tag>
      ))}
    </ul>
  )
}
