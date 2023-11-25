import { graphql } from 'gatsby'

export const query = graphql`
  query GuestBook {
    file(relativePath: { eq: "OGguestbook.png" }) {
      publicURL
    }
  }
`

export { Head } from '../views/GuestBook'
export { default } from '../views/GuestBook'
