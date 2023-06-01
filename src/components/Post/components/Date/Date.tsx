import clsx from 'clsx'
import React from 'react'
import * as styles from './Date.module.css'

type DateProps = {
  date: string
  className?: string
}

export const Date = ({ date, className }: DateProps) => {
  const classNames = clsx(styles.date, className)
  return <h3 className={classNames}>{date}</h3>
}
