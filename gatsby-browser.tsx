import 'prismjs/themes/prism-tomorrow.css'
import '@/styles/index.scss'

import type { WrapPageElementBrowserArgs } from 'gatsby'

import { ThemeProvider } from '@/contexts'

import Layout from './src/layouts/Layout'

export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => (
  <ThemeProvider>
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
)
