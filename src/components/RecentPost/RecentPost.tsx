import type { IGatsbyImageData } from 'gatsby-plugin-image'
import clsx from 'clsx'
import React from 'react'
import { Post } from '../Post'
import * as styles from './RecentPost.module.css'
import * as typo from '@/styles/typography.module.css'

type RecentPostProps = {
  posts: {
    readonly id: string
    readonly frontmatter: {
      readonly tags: readonly string[]
      readonly slug: string
      readonly description: string
      readonly date: string
      readonly title: string
      readonly heroImageAlt: string
      readonly heroImage: {
        readonly childImageSharp: {
          readonly gatsbyImageData: IGatsbyImageData | null
        } | null
      } | null
    }
  }[]
}

export const RecentPost = ({ posts }: RecentPostProps) => {
  return (
    <>
      <h2 className={clsx(styles.heading, typo.T2)}>New posts 📑</h2>
      <ul className={styles.articleRowList}>
        {posts.map(({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageAlt }, id }) => (
          <Post
            key={id}
            variants="card"
            title={title}
            description={description}
            date={date}
            tags={tags}
            slug={slug}
            heroImage={heroImage?.childImageSharp?.gatsbyImageData as IGatsbyImageData}
            heroImageAlt={heroImageAlt}
          />
        ))}
      </ul>
    </>
  )
}
