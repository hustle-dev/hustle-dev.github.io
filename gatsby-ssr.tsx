import type { WrapPageElementNodeArgs, RenderBodyArgs } from 'gatsby'
import React from 'react'
import Layout from './src/layouts/Layout'
import { ThemeProvider } from './src/contexts'

export const wrapPageElement = ({ element, props }: WrapPageElementNodeArgs) => (
  <ThemeProvider>
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
)

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/Pretendard-Bold.subset.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Pretendard-Bold"
    />,
    <link
      rel="preload"
      href="/fonts/Pretendard-SemiBold.subset.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Pretendard-SemiBold"
    />,
    <link
      rel="preload"
      href="/fonts/Pretendard-Medium.subset.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Pretendard-Medium"
    />,
    <link
      rel="preload"
      href="/fonts/Pretendard-Regular.subset.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Pretendard-Regular"
    />,
    <link rel="preload" href="/fonts/Tenada.woff2" as="font" type="font/woff2" crossOrigin="anonymous" key="Tenada" />,
  ])
}
