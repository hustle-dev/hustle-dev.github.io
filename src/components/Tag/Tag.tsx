import clsx from 'clsx'

import * as typo from '@/styles/typography.module.css'

import * as styles from './Tag.module.css'

type TagProps = {
  name: string
  className?: string
}

export const Tag = ({ name, className }: TagProps) => (
  <div className={clsx(styles.tag, className)}>
    <span className={typo.B7}>{name}</span>
  </div>
)
