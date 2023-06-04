import { type IGatsbyImageData } from 'gatsby-plugin-image'

export const getRefinedImage = (heroImage: IGatsbyImageData | undefined) => {
  if (heroImage === undefined) throw new Error('이미지가 존재하지 않습니다.')

  return heroImage
}

export const getRefinedTagValue = (value: string | null) => {
  if (value === null) throw new Error('값이 존재하지 않습니다.')

  return value
}
