import type { PageProps } from 'gatsby'
import React from 'react'
import { PostList, RecentPost, TagList } from './components'
import { usePostInfiniteScroll, useTag } from './hooks'
import { FloatingButton, ProfileCard } from '@/components'
import * as styles from './Home.module.css'

const Home = ({ data, location: { pathname } }: PageProps<Queries.HomeQuery>) => {
  const { nodes: allPosts, totalCount, group } = data.allMarkdownRemark
  const recentPosts = allPosts.slice(0, 2)
  const { tags, selectedTag, clickTag } = useTag(totalCount, group)
  const { visiblePosts } = usePostInfiniteScroll(allPosts, selectedTag, totalCount)

  return (
    <main className={styles.main}>
      <aside className={styles.aside}>
        <ProfileCard pathname={pathname} />
      </aside>
      <div className={styles.shrinkSpace}></div>
      <section className={styles.wrapper}>
        <RecentPost posts={recentPosts} />
        <hr className={styles.divider}></hr>
        <TagList tags={tags} selectedTag={selectedTag} clickTag={clickTag} className={styles.tagList} />
        <PostList posts={visiblePosts} className={styles.postList} />
      </section>
      <FloatingButton />
    </main>
  )
}

export default Home
