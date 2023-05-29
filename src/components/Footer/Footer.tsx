import React from 'react'
import clsx from 'clsx'
import * as styles from './Footer.module.css'
import * as typo from '@/styles/typography.module.css'

export const Footer = () => {
  return (
    <footer className={clsx(styles.footer, typo.D1)}>
      <span className={styles.copyRight}>Copyright © 2023. hustle-dev. All rights reserved.</span>
      <span className={styles.designedBy}>Designed by Julie</span>
    </footer>
  )
}
