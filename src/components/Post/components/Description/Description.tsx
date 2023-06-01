import clsx from 'clsx'
import React from 'react'
import * as styles from './Description.module.css'

type DescriptionProps = {
  description: string
  className?: string
}

export const Description = ({ description, className }: DescriptionProps) => {
  const classNames = clsx(styles.description, className)
  return <p className={classNames}>{description}</p>
}
