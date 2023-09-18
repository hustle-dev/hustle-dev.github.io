import clsx from 'clsx'

import * as typo from '@/styles/typography.module.css'

import * as styles from './Heading.module.css'

type HeadingProps = {
  text: string
}

export const Heading = ({ text }: HeadingProps) => <h1 className={clsx(styles.name, typo.D1)}>{text}</h1>
