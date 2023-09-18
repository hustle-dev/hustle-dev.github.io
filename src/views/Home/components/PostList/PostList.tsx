import clsx from 'clsx'

import { Post } from '../Post'
import * as styles from './PostList.module.css'

type PostListProps = {
  posts: Queries.HomeQuery['allMarkdownRemark']['nodes']
  className?: string
}

export const PostList = ({ posts, className }: PostListProps) => {
  return (
    <ul className={clsx(styles.postList, className)}>
      {posts.map(({ frontmatter: { title, description, date, tags, slug, heroImage, heroImageAlt }, id }) => (
        <Post
          key={id}
          variants="item"
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
  )
}
