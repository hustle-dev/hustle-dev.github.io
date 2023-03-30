import { useState } from 'react';

const isBrowser = typeof window !== 'undefined';

const getInitialTheme = () => {
  const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const localTheme = localStorage.getItem('theme');
  return localTheme || prefersColorScheme;
};

const setThemeAttribute = (theme: string) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
};

export const useTheme = () => {
  if (!isBrowser) return;

  const [theme, setTheme] = useState<string>(getInitialTheme());
  setThemeAttribute(theme);

  const toggleDarkMode = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return toggleDarkMode;
};
