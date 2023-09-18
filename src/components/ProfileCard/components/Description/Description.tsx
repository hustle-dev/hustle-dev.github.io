import clsx from 'clsx'

import * as typo from '@/styles/typography.module.css'

import * as styles from './Description.module.css'

type DescriptionProps = {
  className?: string
}

export const Description = ({ className }: DescriptionProps) => (
  <p className={clsx(styles.description, typo.B3, className)}>
    It is possible for ordinary people to choose to be extraordinary.
  </p>
)
