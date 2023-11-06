import 'prismjs/themes/prism-tomorrow.css'
import '@/styles/index.scss'

import type { WrapPageElementBrowserArgs, WrapRootElementBrowserArgs } from 'gatsby'

import { ThemeProvider } from '@/contexts'

import Layout from './src/layouts/Layout'

export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => <Layout {...props}>{element}</Layout>
export const wrapRootElement = ({ element }: WrapRootElementBrowserArgs) => <ThemeProvider>{element}</ThemeProvider>
