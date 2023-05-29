import React from 'react'
import clsx from 'clsx'
import { useFloatingButton } from './hooks'
import Arrow from '@/images/arrow.svg'
import * as styles from './FloatingButton.module.css'

export const FloatingButton = () => {
  const { isVisible, scrollToTop } = useFloatingButton()

  return (
    <button className={clsx(styles.floatingButton, { [styles.visible]: isVisible })} onClick={scrollToTop}>
      <Arrow />
    </button>
  )
}
