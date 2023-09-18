import { useEffect, useMemo, useState } from 'react'

import { $ } from '@/utils'

import { TAGS } from '../constants'

export const usePostInfiniteScroll = (
  allPosts: Queries.HomeQuery['allMarkdownRemark']['nodes'],
  selectedTag: string,
  totalCount: number
) => {
  const posts = useMemo(
    () => allPosts.filter(({ frontmatter: { tags } }) => selectedTag === TAGS.ALL || tags.includes(selectedTag)),
    [allPosts, selectedTag]
  )
  const [displayedItems, setDisplayedItems] = useState(8)
  const visiblePosts = posts.slice(0, displayedItems)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) return

        if (displayedItems <= totalCount) {
          setDisplayedItems((prev) => prev + 8)
        } else {
          observer.disconnect()
        }
      },
      { threshold: 0 }
    )
    observer.observe($<HTMLElement>('footer'))
    return () => observer.disconnect()
  }, [displayedItems, totalCount])

  return { visiblePosts }
}
