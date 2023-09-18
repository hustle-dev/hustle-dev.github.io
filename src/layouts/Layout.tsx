import { PageProps } from 'gatsby'
import { type ReactNode } from 'react'

import { Footer, Header } from './components'

type LayoutProps = {
  children: ReactNode
}

const Layout = ({ location, children }: Omit<PageProps, 'children'> & LayoutProps) => {
  return (
    <>
      <Header pathname={location.pathname} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
