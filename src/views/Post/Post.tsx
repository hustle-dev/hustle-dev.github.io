import clsx from 'clsx'
import type { HeadProps, PageProps } from 'gatsby'
import { GatsbyImage, getSrc } from 'gatsby-plugin-image'

import { Giscus, ProfileCard, Seo } from '@/components'
import * as typo from '@/styles/typography.module.css'
import { getRefinedImage, getRefinedStringValue } from '@/utils'

import { TableOfContents, TagList } from './components'
import * as styles from './Post.module.css'

// TODO: pageContext 값을 이용한 prev, next 컴포넌트 생성
const Post = ({ data, pageContext, location: { pathname } }: PageProps<Queries.PostQuery>) => {
  if (!data.markdownRemark) throw new Error('마크다운 데이터가 존재하지 않습니다.')
  const { html, tableOfContents, frontmatter } = data.markdownRemark
  const { title, date, tags, heroImage, heroImageAlt } = frontmatter

  return (
    <>
      <main className={styles.wrapper}>
        <h1 className={clsx(typo.D2, styles.title)}>{title}</h1>
        <p className={clsx(typo.B7, styles.date)}>{date}</p>
        <TagList tags={tags} className={styles.tagList} />
        <GatsbyImage
          image={getRefinedImage(heroImage?.childImageSharp?.gatsbyImageData)}
          alt={heroImageAlt}
          className={styles.heroImage}
          objectFit="contain"
        />
        <div className={styles.contentWrapper}>
          <section className={styles.mainText} dangerouslySetInnerHTML={{ __html: getRefinedStringValue(html) }} />
          <TableOfContents html={getRefinedStringValue(tableOfContents)} />
        </div>
        <hr className={styles.divider} />
        <section className={styles.bio}>
          <ProfileCard pathname={pathname} />
        </section>
        <Giscus />
      </main>
    </>
  )
}

export const Head = ({ data: { markdownRemark }, location: { pathname } }: HeadProps<Queries.PostQuery>) => {
  const seo = {
    title: markdownRemark?.frontmatter.title,
    description: markdownRemark?.frontmatter.description,
    heroImage: markdownRemark?.frontmatter.heroImage,
  }

  return (
    <Seo
      title={seo.title}
      description={seo.description}
      heroImage={getSrc(getRefinedImage(seo.heroImage?.childImageSharp?.gatsbyImageData))}
      pathname={pathname}
    />
  )
}

export default Post
