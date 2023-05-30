import clsx from 'clsx'
import React from 'react'
import * as styles from './Description.module.css'
import * as typo from '@/styles/typography.module.css'

type DescriptionProps = {
  className?: string
}

export const Description = ({ className }: DescriptionProps) => {
  const classNames = clsx(styles.description, typo.B3, className)

  return <p className={classNames}>It is possible for ordinary people to choose to be extraordinary.</p>
}
