import './src/styles/reset.css';
import './src/styles/global.css';

import React from 'react';
import Layout from './src/layouts/Layout';
import type { WrapPageElementBrowserArgs } from 'gatsby';

/**
 * 페이지 변경 시 중복해서 사용되는 Layout이 unmount되는 것을 막아줌.
 * @link https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/#wrapPageElement
 */
export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => {
  return <Layout {...props}>{element}</Layout>;
};
