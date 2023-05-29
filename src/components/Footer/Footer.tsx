import React from 'react'
import * as styles from './Footer.module.css'
import * as typo from '@/styles/typography.module.css'
import clsx from 'clsx'

export const Footer = () => {
  return (
    <footer className={clsx(styles.footer, typo.D1)}>
      <span className={styles.copyRight}>Copyright © 2023. hustle-dev. All rights reserved.</span>
      <p className={styles.shoutOut}>Designed by Julie</p>
    </footer>
  )
}
