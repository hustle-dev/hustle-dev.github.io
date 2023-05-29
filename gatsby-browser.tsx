import type { WrapPageElementBrowserArgs } from 'gatsby'
import React from 'react'
import './src/styles/reset.css'
import './src/styles/global.css'
import 'prismjs/themes/prism-tomorrow.css'
import './src/styles/code.css'
import Layout from './src/layouts/Layout'
import { ThemeProvider } from './src/contexts'

export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => (
  <ThemeProvider>
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
)
