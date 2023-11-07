import clsx from 'clsx'

import * as styles from './Description.module.scss'

type DescriptionProps = {
  description: string
  className?: string
}

export const Description = ({ description, className }: DescriptionProps) => (
  <p className={clsx(styles.description, className)}>{description}</p>
)
