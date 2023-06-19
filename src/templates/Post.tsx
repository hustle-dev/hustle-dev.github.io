import { graphql } from 'gatsby'
import type { HeadProps } from 'gatsby'
import { getSrc } from 'gatsby-plugin-image'
import React from 'react'
import { Seo } from '@/components'
import { getRefinedImage } from '@/utils'

export const query = graphql`
  query Post($id: String) {
    markdownRemark(id: { eq: $id }) {
      html
      frontmatter {
        date(formatString: "YY.MM.DD")
        description
        heroImage {
          childImageSharp {
            gatsbyImageData(placeholder: BLURRED)
          }
        }
        heroImageAlt
        tags
        title
      }
      tableOfContents
    }
  }
`

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

export { default } from '../views/Post'
