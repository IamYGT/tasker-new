import React, { useState, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { getTheme, setTheme } from '@/Utils/themeManager';
import Sidebar from './Sidebar';
import Header from './Header';
import LogoutModal from './LogoutModal';
import { motion } from 'framer-motion';

interface AuthenticatedProps {
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function AuthenticatedLayout({ header, children }: AuthenticatedProps) {
    const { auth, languages, secili_dil } = usePage().props as any;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(getTheme());
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        return savedCollapsed ? JSON.parse(savedCollapsed) : false;
    });

    useEffect(() => {
        const handleResize = () => {
            const newIsMobile = window.innerWidth < 1024;
            setIsMobile(newIsMobile);
            if (newIsMobile) {
                setCollapsed(false);
            } else {
                setSidebarOpen(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setTheme(darkMode);
    }, [darkMode]);

    useEffect(() => {
        if (!isMobile) {
            localStorage.setItem('sidebarCollapsed', JSON.stringify(collapsed));
        }
    }, [collapsed, isMobile]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    const toggleCollapse = () => {
        if (!isMobile) {
            setCollapsed(!collapsed);
        }
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
        <div className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' : 'bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300'} transition-all duration-500 ease-in-out`}>
            {isLoading && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
                </div>
            )}
            
            {sidebarOpen && isMobile && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                ></div>
            )}

            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                darkMode={darkMode}
                setShowLogoutModal={setShowLogoutModal}
                collapsed={isMobile ? false : collapsed}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    auth={auth}
                    languages={languages}
                    secili_dil={secili_dil}
                    header={header}
                    collapsed={isMobile ? false : collapsed}
                    setCollapsed={setCollapsed}
                    toggleCollapse={toggleCollapse}
                    isMobile={isMobile}
                    setShowLogoutModal={setShowLogoutModal}
                    onLanguageChange={handleLanguageChange} // Yeni prop eklendi
                />

                <main className={`flex-1 overflow-x-hidden overflow-y-auto p-6 sm:p-8 lg:p-10 backdrop-filter backdrop-blur-md ${darkMode ? 'text-gray-100' : 'text-gray-900'} transition-all duration-500 ease-in-out`}>
                    <div className="container mx-auto">
                        {children}
                    </div>
                </main>
            </div>

            <LogoutModal
                showLogoutModal={showLogoutModal}
                setShowLogoutModal={setShowLogoutModal}
                darkMode={darkMode}
            />
        </div>
    );
}