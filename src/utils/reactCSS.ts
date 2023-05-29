import { CSSProperties } from 'react'

interface ReactCssWithCustomVars extends CSSProperties {
  [key: `--${string}`]: string | number | undefined
}

export function reactCss(css: ReactCssWithCustomVars): CSSProperties {
  return css
}
