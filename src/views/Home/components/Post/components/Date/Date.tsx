import clsx from 'clsx'

import * as styles from './Date.module.css'

type DateProps = {
  date: string
  className?: string
}

export const Date = ({ date, className }: DateProps) => <h3 className={clsx(styles.date, className)}>{date}</h3>
