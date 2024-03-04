import type { HeadProps, PageProps } from 'gatsby'

import { FloatingButton, ProfileCard, Seo } from '@/components'
import Layout from '@/layouts'
import { getRefinedStringValue } from '@/utils'

import { PostList, RecentPost, TagList } from './components'
import * as styles from './Home.module.scss'
import { usePostInfiniteScroll, useTag } from './hooks'

const Home = ({ data, location: { pathname } }: PageProps<Queries.HomeQuery>) => {
  const { nodes: allPosts, totalCount, group } = data.allMarkdownRemark
  const recentPosts = allPosts.slice(0, 2)
  const { tags, selectedTag, clickTag } = useTag(totalCount, group)
  const { visiblePosts } = usePostInfiniteScroll(allPosts, selectedTag, totalCount)

  return (
    <Layout pathname={pathname}>
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
    </Layout>
  )
}

export const Head = ({ location: { pathname }, data: { site, file } }: HeadProps<Queries.HomeQuery>) => {
  const seo = {
    title: site?.siteMetadata.title,
    description: site?.siteMetadata.description,
    heroImage: getRefinedStringValue(file?.publicURL),
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname}></Seo>
}

export default Home
