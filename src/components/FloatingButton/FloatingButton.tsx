import clsx from 'clsx'

import Arrow from '@/images/arrow.svg'

import * as styles from './FloatingButton.module.css'
import { useFloatingButton } from './hooks'

export const FloatingButton = () => {
  const { isVisible, scrollToTop } = useFloatingButton()

  return (
    <button className={clsx(styles.floatingButton, { [styles.visible]: isVisible })} onClick={scrollToTop}>
      <Arrow />
    </button>
  )
}
