import { HeadProps } from 'gatsby'

import { FloatingButton, Giscus, Seo } from '@/components'
import { getRefinedStringValue } from '@/utils'

import * as styles from './GuestBook.module.scss'

const GuestBook = () => {
  return (
    <main className={styles.wrapper}>
      <h1 className={styles.title}>GuestBook | 방명록</h1>
      <p className={styles.description}>
        안녕하세요, hustle-dev입니다. 제 블로그에 방문해주셔서 감사합니다. 🤗 {'\n'}
        이곳 방명록에 여러분의 생각이나 의견, 아니면 그냥 인사 한 마디도 좋아요. 자유롭게 글을 남겨주세요! 😎
      </p>
      <Giscus />
      <FloatingButton />
    </main>
  )
}

export const Head = ({ location: { pathname }, data: { file } }: HeadProps<Queries.GuestBookQuery>) => {
  const seo = {
    title: 'GuestBook | hustle-dev',
    description: 'hustle-dev 블로그의 방명록 페이지입니다.',
    heroImage: getRefinedStringValue(file?.publicURL),
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname} />
}

export default GuestBook
