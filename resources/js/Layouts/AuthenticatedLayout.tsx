import { useRole } from '@/Hooks/useRole';
import { User } from '@/types';
import { getTheme, setTheme } from '@/Utils/themeManager';
import { router, usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import LogoutModal from './LogoutModal';
import Sidebar from './Sidebar';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{ name: string }>;
        };
    };
    header?: React.ReactNode;
    children: React.ReactNode;
}

export default function Authenticated({ auth, header, children }: Props) {
    const { languages, secili_dil, scroll } = usePage().props as any;
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [darkMode, setDarkMode] = useState(getTheme());
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [collapsed, setCollapsed] = useState(() => {
        const savedCollapsed = localStorage.getItem('sidebarCollapsed');
        return savedCollapsed ? JSON.parse(savedCollapsed) : false;
    });
    const { isAdmin } = useRole();

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

    useEffect(() => {
        if (scroll?.y) {
            window.scrollTo(0, scroll.y);
        }
    }, [scroll]);

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
            className={`flex h-screen ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-blue-900' : 'bg-gradient-to-br from-blue-100 via-blue-200 to-indigo-300'} animate-gradient transition-all duration-500 ease-in-out`}
        >
            {isLoading && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-white"></div>
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
                isAdmin={isAdmin()}
            />

            <div className="flex flex-1 flex-col overflow-hidden">
                <Header
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    darkMode={darkMode}
                    toggleDarkMode={toggleDarkMode}
                    auth={{ user: auth?.user as User }}
                    languages={languages}
                    secili_dil={secili_dil}
                    header={header}
                    collapsed={isMobile ? false : collapsed}
                    setCollapsed={setCollapsed}
                    toggleCollapse={toggleCollapse}
                    isMobile={isMobile}
                    setShowLogoutModal={setShowLogoutModal}
                    onLanguageChange={handleLanguageChange}
                />

                <main
                    className={`flex-1 overflow-y-auto overflow-x-hidden p-6 backdrop-blur-md backdrop-filter sm:p-8 lg:p-10 ${darkMode ? 'text-gray-100' : 'text-gray-900'} transition-all duration-500 ease-in-out`}
                >
                    <div className="container mx-auto">{children}</div>
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
