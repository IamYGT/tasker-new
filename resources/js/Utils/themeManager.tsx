export const getTheme = (): boolean => {
    const theme = localStorage.getItem('theme');
    return theme === 'dark';
};

export const setTheme = (isDark: boolean): void => {
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    if (isDark) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
};
