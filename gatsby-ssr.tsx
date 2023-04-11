import React from 'react';
import Layout from './src/layouts/Layout';
import type { WrapPageElementNodeArgs, RenderBodyArgs } from 'gatsby';
import { ThemeProvider } from './src/contexts';
import { isBrowser } from './src/utils';

/**
 * 페이지 변경 시 중복해서 사용되는 Layout이 unmount되는 것을 막아줌.
 * @link https://www.gatsbyjs.com/docs/reference/config-files/gatsby-ssr/#wrapPageElement
 */
export const wrapPageElement = ({ element, props }: WrapPageElementNodeArgs) => {
  if (!isBrowser) return <Layout {...props}>{element}</Layout>;

  return (
    <ThemeProvider>
      <Layout {...props}>{element}</Layout>
    </ThemeProvider>
  );
};

export const onRenderBody = ({ setHeadComponents }: RenderBodyArgs) => {
  setHeadComponents([
    <link
      rel="preload"
      href="/fonts/PretendardVariable.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
      key="Pretendard"
    />,
    <link rel="preload" href="/fonts/Tenada.woff2" as="font" type="font/woff2" crossOrigin="anonymous" key="Tenada" />,
  ]);
};
