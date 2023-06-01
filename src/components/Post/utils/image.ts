import { getImage, type IGatsbyImageData } from 'gatsby-plugin-image'

export const getRefinedImage = (heroImage: IGatsbyImageData) => {
  const image = getImage(heroImage)

  if (image === undefined) throw new Error('Post에 들어갈 이미지가 존재하지 않습니다.')

  return image
}
