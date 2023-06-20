import { graphql } from 'gatsby'

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

export { Head } from '../views/Post'
export { default } from '../views/Post'
