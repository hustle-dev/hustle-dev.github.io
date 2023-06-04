import React from 'react'
import clsx from 'clsx'
import { Post } from '../Post'
import * as styles from './RecentPost.module.css'
import * as typo from '@/styles/typography.module.css'

type RecentPostProps = Queries.HomeQuery['allMarkdownRemark']['nodes']

export const RecentPost = (posts: RecentPostProps) => (
  <>
    <h2 className={clsx(styles.heading, typo.T2)}>New posts 📑</h2>
    <ul className={styles.recentPostList}>
      {posts.map(({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageAlt }, id }) => (
        <Post
          key={id}
          variants="card"
          title={title}
          description={description}
          date={date}
          tags={tags}
          slug={slug}
          heroImage={heroImage?.childImageSharp?.gatsbyImageData}
          heroImageAlt={heroImageAlt}
        />
      ))}
    </ul>
  </>
)
