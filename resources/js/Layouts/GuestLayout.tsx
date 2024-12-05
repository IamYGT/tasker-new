import ApplicationLogo from '@/Components/ApplicationLogo';
import LanguageSelector from '@/Layouts/LanguageSelector';
import ThemeToggle from '@/Layouts/ThemeToggle';
import { getTheme, setTheme } from '@/Utils/themeManager';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { PropsWithChildren, useEffect, useState } from 'react';

interface Language {
    dil_id: number;
    dil_kod: string;
    dil_baslik: string;
}

interface GuestLayoutProps extends PropsWithChildren {
    languages: Language[];
    secili_dil: Language;
}

export default function Guest({
    children,
    languages,
    secili_dil = {
        dil_id: 1,
        dil_kod: 'tr',
        dil_baslik: 'Türkçe',
    },
}: GuestLayoutProps) {
    const [darkMode, setDarkMode] = useState(getTheme());
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        sessionStorage.setItem('dil_kod', secili_dil.dil_kod);
    }, [secili_dil]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setTheme(darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const handleLanguageChange = (langCode: string) => {
        setIsLoading(true);
        router.get(
            route('language.switch', langCode),
            {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['languages', 'secili_dil'],
                onSuccess: () => {
                    setIsLoading(false);
                    window.location.reload();
                },
                onError: () => {
                    setIsLoading(false);
                },
            },
        );
    };

    return (
        <div
            className={`flex min-h-screen flex-col ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' : 'bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300'} transition-all duration-500 ease-in-out`}
        >
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
                </div>
            )}
            <div className="flex items-center justify-end p-4 sm:p-6">
                <div className="flex space-x-4">
                    <ThemeToggle
                        darkMode={darkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                    <LanguageSelector
                        darkMode={darkMode}
                        languages={languages}
                        secili_dil={secili_dil}
                        isMobile={isMobile}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>
            </div>

            <div className="flex flex-grow items-center justify-center">
                <div className="w-full px-6 py-4 sm:max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="mb-6 flex justify-center">
                            <ApplicationLogo
                                mode={darkMode ? 'dark' : 'light'}
                                className="h-20 w-20 object-contain sm:h-36 sm:w-36"
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="backdrop-blur-lg backdrop-filter"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
