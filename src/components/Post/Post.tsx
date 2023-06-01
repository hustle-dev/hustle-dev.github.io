import { Link } from 'gatsby'
import { GatsbyImage, type IGatsbyImageData } from 'gatsby-plugin-image'
import React from 'react'
import clsx from 'clsx'
import { match } from 'ts-pattern'
import { Date, Description, TagList, Title } from './components'
import { getRefinedImage } from './utils'
import * as styles from './Post.module.css'
import * as typo from '@/styles/typography.module.css'

type PostProps = {
  variants: 'card' | 'item'
  title: string
  description: string
  date: string
  tags: readonly string[]
  slug: string
  heroImage: IGatsbyImageData
  heroImageAlt: string
}

export const Post = ({ variants, title, description, date, tags, slug, heroImage, heroImageAlt }: PostProps) => {
  const image = getRefinedImage(heroImage)

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      {match(variants)
        .with('card', () => (
          <article className={styles.card}>
            <figure>
              <GatsbyImage image={image} alt={heroImageAlt} className={styles.cardImage} />
              <figcaption className={styles.cardCaption}>
                <Date date={date} className={clsx(styles.cardDate, typo.B7)} />
                <TagList tags={tags} className={styles.cardTagList} />
                <Title title={title} className={clsx(styles.cardTitle, typo.H1)} />
                <Description description={description} className={clsx(styles.cardDescription, typo.B5)} />
              </figcaption>
            </figure>
          </article>
        ))
        .with('item', () => (
          <article className={styles.item}>
            <figure className={styles.itemFigure}>
              <GatsbyImage image={image} alt={heroImageAlt} className={styles.itemImage} />
              <figcaption className={styles.itemCaption}>
                <TagList tags={tags} />
                <Title title={title} className={clsx(styles.itemTitle, typo.T1)} />
                <Description description={description} className={clsx(styles.itemDescription, typo.B5)} />
                <Date date={date} className={clsx(styles.itemDate, typo.B6)} />
              </figcaption>
            </figure>
          </article>
        ))
        .exhaustive()}
    </Link>
  )
}
