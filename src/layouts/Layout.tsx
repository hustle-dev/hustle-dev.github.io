import type { PropsWithChildren } from 'react'

import { Footer, Header } from './components'

type LayoutProps = PropsWithChildren<{ pathname: string }>

const Layout = ({ pathname, children }: LayoutProps) => {
  return (
    <>
      <Header pathname={pathname} />
      {children}
      <Footer />
    </>
  )
}

export default Layout
