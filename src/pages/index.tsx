import { graphql } from 'gatsby'
import type { HeadProps, PageProps } from 'gatsby'
import React from 'react'
import { PostList, RecentPost, TagList } from './Home/components'
import { usePostInfiniteScroll, useTag } from './Home/hooks'
import { FloatingButton, ProfileCard, Seo } from '@/components'
import * as styles from './Home/Home.module.css'

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

export const query = graphql`
  query Home {
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      totalCount
      nodes {
        frontmatter {
          tags
          slug
          description
          date(formatString: "YY.MM.DD")
          title
          heroImage {
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED)
            }
          }
          heroImageAlt
        }
        id
      }
      group(field: { frontmatter: { tags: SELECT } }) {
        fieldValue
        totalCount
      }
    }
    site {
      siteMetadata {
        siteUrl
        description
        title
        keywords
      }
    }
    file(relativePath: { eq: "blogImage.png" }) {
      publicURL
    }
  }
`

export default Home

export const Head = ({ location: { pathname }, data: { site, file } }: HeadProps<Queries.HomeQuery>) => {
  const seo = {
    title: site?.siteMetadata.title,
    description: site?.siteMetadata.description,
    heroImage: file?.publicURL as string,
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname}></Seo>
}
