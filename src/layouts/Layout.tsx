import React, { type ReactNode } from 'react'
import { Footer, Header } from './components'
import { PageProps } from 'gatsby'

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
