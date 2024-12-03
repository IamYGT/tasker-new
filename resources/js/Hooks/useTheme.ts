import { getTheme, setTheme } from '@/Utils/themeManager';
import { useEffect, useState } from 'react';

export const useTheme = () => {
    const [isDark, setIsDark] = useState(getTheme());

    useEffect(() => {
        setTheme(isDark);
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    return { isDark, toggleTheme };
};
