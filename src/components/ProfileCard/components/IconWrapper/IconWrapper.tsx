import React, { type ReactNode } from 'react'
import * as styles from './IconWrapper.module.css'

type IconWrapperProps = {
  href: string
  children: ReactNode
}

export const IconWrapper = ({ href, children }: IconWrapperProps) => {
  return (
    <a href={href} target="_blank" className={styles.profileIcon} rel="noreferrer">
      {children}
    </a>
  )
}
