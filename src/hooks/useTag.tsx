import { useCallback, useMemo, useState } from 'react'
import type { KeyboardEvent, MouseEvent } from 'react'
import { TAGS } from '@/constants'

export const useTag = (totalCount: number, group: Queries.HomeQuery['allMarkdownRemark']['group']) => {
  const tags = useMemo(
    () => [{ fieldValue: TAGS.ALL, totalCount }, ...group].sort((a, b) => b.totalCount - a.totalCount),
    [group, totalCount]
  )
  const [selectedTag, setSelectedTag] = useState<string>(TAGS.ALL)
  const clickTag = useCallback(({ target }: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>) => {
    if (!(target instanceof HTMLElement)) return
    const $tagItem = target.closest('li')
    if (!$tagItem) return
    $tagItem?.dataset.tag && setSelectedTag($tagItem.dataset.tag)
  }, [])

  return { tags, selectedTag, clickTag }
}
