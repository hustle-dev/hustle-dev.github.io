import clsx from 'clsx'
import { Link } from 'gatsby'
import { match } from 'ts-pattern'

import { useTheme } from '@/contexts'
import DarkMode from '@/images/darkmode.svg'
import Logo from '@/images/logo.svg'
import Rss from '@/images/rss.svg'
import { reactCss } from '@/utils'

import * as styles from './Header.module.css'
import { useScrollIndicator } from './hooks'

type HeaderProps = {
  pathname: string
}

export const Header = ({ pathname }: HeaderProps) => {
  const { toggleDarkMode } = useTheme()
  const { isHome, progressWidth } = useScrollIndicator(pathname)

  return (
    <header className={clsx(styles.header, { [styles.fixed]: !isHome })}>
      <div className={styles.wrapper}>
        <Link to="/" className={styles.headingLink}>
          <h1 className={styles.headingWrapper}>
            <Logo />
            <span className={styles.heading}>Hustle-devlog</span>
          </h1>
        </Link>
        <div className={styles.headerButtons}>
          <a href="/rss.xml" rel="noopener noreferrer">
            <Rss className={styles.icon} />
          </a>
          <button className={styles.iconButton} onClick={toggleDarkMode} tabIndex={0}>
            <DarkMode className={styles.icon} />
          </button>
        </div>
      </div>
      {match(isHome)
        .with(false, () => (
          <div style={reactCss({ '--progress-width': `${progressWidth}%` })} className={styles.progressBar} />
        ))
        .otherwise(() => null)}
    </header>
  )
}
