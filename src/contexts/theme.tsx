import React, { useState, useCallback, useContext, createContext } from 'react'
import type { ReactNode } from 'react'
import { isBrowser } from '@/utils'

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}

type ThemeContextType = {
  theme: Theme
  toggleDarkMode: () => void
}

const defaultThemeContextValue = {
  theme: Theme.LIGHT,
  toggleDarkMode: () => {},
}

const ThemeContext = createContext<ThemeContextType>(defaultThemeContextValue)

const isDarkMode = (theme: Theme) => theme === Theme.DARK

const getInitialTheme = () => {
  const localTheme = window.localStorage.getItem('theme') as Theme | null
  const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.DARK : Theme.LIGHT
  return localTheme || prefersColorScheme
}

const setThemeAttribute = (theme: Theme) => {
  if (!isBrowser) return

  document.documentElement.toggleAttribute('dark-mode', isDarkMode(theme))
  localStorage.setItem('theme', theme)
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>(isBrowser ? getInitialTheme() : Theme.LIGHT)
  setThemeAttribute(theme)

  const toggleDarkMode = useCallback(() => {
    const newTheme = isDarkMode(theme) ? Theme.LIGHT : Theme.DARK
    setTheme(newTheme)
  }, [theme])

  return <ThemeContext.Provider value={{ theme, toggleDarkMode }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => {
  const value = useContext(ThemeContext)
  if (value === undefined) {
    throw new Error('useTheme must be used within a ThemeContextProvider')
  }
  return value
}
