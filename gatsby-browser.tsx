import '@/styles/reset.css'
import '@/styles/global.css'
import 'prismjs/themes/prism-tomorrow.css'
import '@/styles/code.css'

import type { WrapPageElementBrowserArgs } from 'gatsby'

import { ThemeProvider } from '@/contexts'

import Layout from './src/layouts/Layout'

// TODO: provider는 wrapRootElement에 적용하는게 좋을듯?
export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => (
  <ThemeProvider>
    <Layout {...props}>{element}</Layout>
  </ThemeProvider>
)
