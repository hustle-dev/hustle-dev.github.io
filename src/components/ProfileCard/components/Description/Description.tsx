import React from 'react'
import clsx from 'clsx'
import * as styles from './Description.module.css'
import * as typo from '@/styles/typography.module.css'

type DescriptionProps = {
  className?: string
}

export const Description = ({ className }: DescriptionProps) => (
  <p className={clsx(styles.description, typo.B3, className)}>
    It is possible for ordinary people to choose to be extraordinary.
  </p>
)
