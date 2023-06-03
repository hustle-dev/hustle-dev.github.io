import React from 'react'
import clsx from 'clsx'
import * as styles from './Title.module.css'

type TitleProps = {
  title: string
  className?: string
}

export const Title = ({ title, className }: TitleProps) => <h3 className={clsx(styles.title, className)}>{title}</h3>
