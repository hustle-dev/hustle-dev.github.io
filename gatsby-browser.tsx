import 'prismjs/themes/prism-tomorrow.css'
import '@/styles/index.scss'

import type { WrapPageElementBrowserArgs } from 'gatsby'

import { ThemeProvider } from '@/contexts'

export const wrapPageElement = ({ element, props }: WrapPageElementBrowserArgs) => (
  <ThemeProvider>{element}</ThemeProvider>
)
