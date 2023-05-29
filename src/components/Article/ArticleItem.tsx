import { GatsbyImage, getImage, type IGatsbyImageData } from 'gatsby-plugin-image'
import React from 'react'
import type { ArticleProps } from './types'
import * as styles from './ArticleItem.module.css'
import { Link } from 'gatsby'
import * as typo from '@/styles/typography.module.css'
import { Tag } from '@/components'
import clsx from 'clsx'

export const ArticleItem = ({ title, description, date, tags, slug, heroImage, heroImageAlt }: ArticleProps) => {
  const image = getImage(heroImage) as IGatsbyImageData

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      <article className={styles.wrapper}>
        <figure className={styles.figure}>
          <GatsbyImage image={image} alt={heroImageAlt} className={styles.gatsbyImage} />
          <figcaption className={styles.figcaption}>
            <ul className={styles.tagList}>
              {tags.map((tag) => (
                <Tag key={tag} name={tag}></Tag>
              ))}
            </ul>
            <h3 className={clsx(styles.title, typo.T1)}>{title}</h3>
            <p className={clsx(styles.description, typo.B5)}>{description}</p>
            <span className={clsx(styles.date, typo.B6)}>{date}</span>
          </figcaption>
        </figure>
      </article>
    </Link>
  )
}
