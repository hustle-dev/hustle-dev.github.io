import { Tag } from '@/components'
import { Link } from 'gatsby'
import { GatsbyImage, getImage, type IGatsbyImageData } from 'gatsby-plugin-image'
import React from 'react'
import * as styles from './ArticleCard.module.css'
import * as typo from '@/styles/typography.module.css'
import type { ArticleProps } from './types'
import clsx from 'clsx'

export const ArticleCard = ({ title, description, date, tags, slug, heroImage, heroImageAlt }: ArticleProps) => {
  const image = getImage(heroImage) as IGatsbyImageData

  return (
    <Link to={`/posts${slug}`} className={styles.articleLink}>
      <article className={styles.wrapper}>
        <figure>
          <GatsbyImage image={image} alt={heroImageAlt} className={styles.gatsbyImage} />
          <figcaption className={styles.figcaption}>
            <span className={clsx(styles.date, typo.B7)}>{date}</span>
            <ul className={styles.tagList}>
              {tags.map((tag) => (
                <Tag key={tag} name={tag}></Tag>
              ))}
            </ul>
            <h3 className={clsx(styles.title, typo.H1)}>{title}</h3>
            <p className={clsx(styles.description, typo.B5)}>{description}</p>
          </figcaption>
        </figure>
      </article>
    </Link>
  )
}
