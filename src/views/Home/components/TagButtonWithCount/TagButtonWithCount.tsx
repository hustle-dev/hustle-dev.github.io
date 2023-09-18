import clsx from 'clsx'

import * as typo from '@/styles/typography.module.css'

import * as styles from './TagButtonWithCount.module.css'

type TagButtonWithCountProps = {
  name: string
  count: number
  onClick?: () => void
  isSelected: boolean
}

export const TagButtonWithCount = ({ name, count, isSelected, onClick }: TagButtonWithCountProps) => (
  <button onClick={onClick} className={clsx(styles.tagButton, { [styles.active]: isSelected })}>
    <span className={typo.B5}>
      {name} ({count})
    </span>
  </button>
)
