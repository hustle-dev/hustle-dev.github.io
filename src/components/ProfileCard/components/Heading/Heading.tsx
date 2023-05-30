import clsx from 'clsx'
import React from 'react'
import * as styles from './Heading.module.css'
import * as typo from '@/styles/typography.module.css'

type HeadingProps = {
  text: string
}

export const Heading = ({ text }: HeadingProps) => {
  return <h1 className={clsx(styles.name, typo.D1)}>{text}</h1>
}
