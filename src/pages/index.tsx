import { graphql } from 'gatsby'
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

export { default } from '../views/Home'
