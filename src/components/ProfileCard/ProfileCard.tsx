import { StaticImage } from 'gatsby-plugin-image'
import React from 'react'
import { match } from 'ts-pattern'
import { Description, Heading, IconList } from './components'
import * as styles from './ProfileCard.module.css'

type ProfileCardProps = {
  pathname: string
}

export const ProfileCard = ({ pathname }: ProfileCardProps) => {
  const isPost = pathname.includes('/posts/')

  return match(isPost)
    .with(true, () => (
      <div className={styles.wrapper}>
        <StaticImage
          src="../../images/elon.jpeg"
          alt="일론 머스크"
          objectFit="fill"
          className={styles.postProfileImage}
          width={100}
          height={100}
        ></StaticImage>
        <div>
          <Heading text="Hustle-dev" />
          <Description className={styles.postDescription} />
          <div className={styles.iconWrapper}>
            <IconList />
          </div>
        </div>
      </div>
    ))
    .with(false, () => (
      <div className={styles.card}>
        <Heading text="Hustle-devlog" />
        <Description />
        <div className={styles.info}>
          <StaticImage
            src="../../images/elon.jpeg"
            alt="일론 머스크"
            className={styles.profileImage}
            width={100}
            height={100}
          ></StaticImage>
          <IconList />
        </div>
      </div>
    ))
    .exhaustive()
}
