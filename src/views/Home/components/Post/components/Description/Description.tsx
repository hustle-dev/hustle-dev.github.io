import React from 'react'
import clsx from 'clsx'
import * as styles from './Description.module.css'

type DescriptionProps = {
  description: string
  className?: string
}

export const Description = ({ description, className }: DescriptionProps) => (
  <p className={clsx(styles.description, className)}>{description}</p>
)
