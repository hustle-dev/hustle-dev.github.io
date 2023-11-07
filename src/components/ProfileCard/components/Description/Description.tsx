import clsx from 'clsx'

import * as styles from './Description.module.scss'

type DescriptionProps = {
  className?: string
}

export const Description = ({ className }: DescriptionProps) => (
  <p className={clsx(styles.description, className)}>
    It is possible for ordinary people to choose to be extraordinary.
  </p>
)
