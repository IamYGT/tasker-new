import React, { useState, useEffect } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link, router } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import ThemeToggle from '@/Layouts/ThemeToggle';
import LanguageSelector from '@/Layouts/LanguageSelector';
import { motion, AnimatePresence } from 'framer-motion';
import { getTheme, setTheme } from '@/Utils/themeManager';
import { useTranslation } from '@/Contexts/TranslationContext';

interface GuestLayoutProps extends PropsWithChildren {
    languages: any;
    secili_dil: any;

}

export default function Guest({ children, languages, secili_dil }: GuestLayoutProps) {
    const { t } = useTranslation();
    const [darkMode, setDarkMode] = useState(getTheme());
    const [isMobile, setIsMobile] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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
        router.get(route('language.switch', langCode), {}, {
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
        });
    };


    return (
        <div className={`flex min-h-screen flex-col ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' : 'bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300'} transition-all duration-500 ease-in-out`}>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            <div className="flex justify-end items-center p-4 sm:p-6">
                <div className="flex space-x-4">
                    <ThemeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
                    <LanguageSelector
                        darkMode={darkMode}
                        languages={languages}
                        secili_dil={secili_dil}
                        isMobile={isMobile}
                        onLanguageChange={handleLanguageChange}
                    />
                </div>
            </div>

            <AnimatePresence>
                {notification && (
                    <motion.div
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                            } text-white`}
                    >
                        {notification.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex flex-grow items-center justify-center">
                <div className="w-full sm:max-w-md px-6 py-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <div className="flex justify-center mb-6">
                            <ApplicationLogo 
                                mode={darkMode ? 'dark' : 'light'}
                                className="w-20 h-20 sm:w-36 sm:h-36 object-contain" 
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="backdrop-filter backdrop-blur-lg"
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}