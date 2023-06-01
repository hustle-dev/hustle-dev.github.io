import clsx from 'clsx'
import React from 'react'
import * as styles from './Title.module.css'

type TitleProps = {
  title: string
  className?: string
}

export const Title = ({ title, className }: TitleProps) => {
  const classNames = clsx(styles.title, className)
  return <h3 className={classNames}>{title}</h3>
}
