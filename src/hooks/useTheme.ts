import { useState } from 'react';

const isDarkMode = (theme: string) => theme === 'dark';

const getInitialTheme = () => {
  const prefersColorScheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const localTheme = localStorage.getItem('theme');
  return localTheme || prefersColorScheme;
};

const setThemeAttribute = (theme: string) => {
  document.documentElement.toggleAttribute('dark-mode', isDarkMode(theme));
  localStorage.setItem('theme', theme);
};

export const useTheme = () => {
  const [theme, setTheme] = useState<string>(getInitialTheme());
  setThemeAttribute(theme);

  const toggleDarkMode = () => {
    const newTheme = isDarkMode(theme) ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return toggleDarkMode;
};
