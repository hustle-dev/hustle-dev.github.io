import React from 'react'
import { Seo } from '@/components'
import { graphql, type HeadProps } from 'gatsby'
import { getRefinedStringValue } from '@/utils'
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

export const Head = ({ location: { pathname }, data: { site, file } }: HeadProps<Queries.HomeQuery>) => {
  const seo = {
    title: site?.siteMetadata.title,
    description: site?.siteMetadata.description,
    heroImage: getRefinedStringValue(file?.publicURL),
  }

  return <Seo title={seo.title} description={seo.description} heroImage={seo.heroImage} pathname={pathname}></Seo>
}

export { default } from '../views/Home'
