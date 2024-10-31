import { useState, useEffect } from 'react';
import { getTheme, setTheme } from '@/Utils/themeManager';

export const useTheme = () => {
  const [isDark, setIsDark] = useState(getTheme());

  useEffect(() => {
    setTheme(isDark);
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return { isDark, toggleTheme };
};