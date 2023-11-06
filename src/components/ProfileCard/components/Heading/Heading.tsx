import * as styles from './Heading.module.scss'

type HeadingProps = {
  text: string
}

export const Heading = ({ text }: HeadingProps) => <h1 className={styles.name}>{text}</h1>
