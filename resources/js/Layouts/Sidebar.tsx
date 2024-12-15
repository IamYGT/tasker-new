import ApplicationLogo from '@/Components/ApplicationLogo';
import { useTranslation } from '@/Contexts/TranslationContext';

import Tippy from '@tippyjs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useState } from 'react';

import {
    MdAccountBalance,
    MdClose,
    MdConfirmationNumber,
    MdDashboard,
    MdGroup,
    MdLogout,
    MdMoneyOff,
    MdPayment,
    MdPending,
    MdPerson,
} from 'react-icons/md';
import 'tippy.js/dist/tippy.css';
import NavLink from './NavLink';

// Menü öğesi tipi
interface MenuItem {
    name: string;
    route: string;
    icon: JSX.Element;
}

// User menü öğeleri
const userMenuItems: MenuItem[] = [
    {
        name: 'sidebar.dashboard',
        route: 'dashboard',
        icon: <MdDashboard className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.transactions',
        route: 'transactions.history',
        icon: <MdPayment className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.withdrawals',
        route: 'withdrawal.request',
        icon: <MdMoneyOff className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.tickets',
        route: 'tickets.index',
        icon: <MdConfirmationNumber className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.ibans',
        route: 'profile.ibans.index',
        icon: <MdAccountBalance className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
];

// Admin menü öğeleri
const adminMenuItems: MenuItem[] = [
    {
        name: 'sidebar.dashboard',
        route: 'admin.dashboard',
        icon: <MdDashboard className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.userManagement',
        route: 'admin.users.index',
        icon: <MdGroup className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.transactions',
        route: 'admin.transactions.index',
        icon: <MdPayment className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
    {
        name: 'sidebar.tickets',
        route: 'admin.tickets.index',
        icon: <MdConfirmationNumber className="h-5 w-5 sm:h-6 sm:w-6" />,
    },
];

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    darkMode: boolean;
    setShowLogoutModal: (show: boolean) => void;
    collapsed: boolean;
    isAdmin: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    setShowLogoutModal,
    collapsed,
    isAdmin,
}) => {
    const { t } = useTranslation();
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 1024);

    const checkMobile = useCallback(() => {
        setIsMobile(window.innerWidth < 1024);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [checkMobile]);

    const sidebarVariants = {
        expanded: {
            width: '16rem',
            transition: { duration: 0.1, ease: 'easeInOut' },
        }, // Hızlandırıldı
        collapsed: {
            width: '4.5rem',
            transition: { duration: 0.1, ease: 'easeInOut' },
        }, // Hızlandırıldı
    };

    const contentVariants = {
        expanded: { opacity: 1, x: 0, transition: { duration: 0.05 } }, // Hızlandırıldı
        collapsed: {
            opacity: collapsed ? 1 : 0,
            x: collapsed ? 0 : -10,
            transition: { duration: 0.05 },
        }, // Hızlandırıldı
    };

    const logoVariants = {
        expanded: { rotate: 0, scale: 1, transition: { duration: 0.1 } }, // Hızlandırıldı
        collapsed: { rotate: 360, scale: 0.9, transition: { duration: 0.1 } }, // Hızlandırıldı
    };

    const buttonVariants = {
        expanded: {
            width: '100%',
            justifyContent: 'flex-start',
            padding: '0.75rem 1rem',
        },
        collapsed: {
            width: '3rem',
            justifyContent: 'center',
            padding: '0.75rem',
        },
    };

    const darkModeClasses = darkMode
        ? 'bg-gray-800 text-gray-200'
        : 'bg-gray-100 text-gray-900';
    const headerClasses = darkMode
        ? 'bg-gray-900 bg-opacity-70'
        : 'bg-gray-200 bg-opacity-70';
    const closeButtonClasses = darkMode
        ? 'text-gray-200 hover:bg-gray-700 focus:ring-gray-500'
        : 'text-gray-900 hover:bg-gray-300 focus:ring-gray-400';
    const logoutButtonClasses = darkMode
        ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800'
        : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700';

    // Menü öğelerini seç
    const menuItems = isAdmin ? adminMenuItems : userMenuItems;

    return (
        <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
                <motion.aside
                    initial={collapsed ? 'collapsed' : 'expanded'}
                    animate={collapsed ? 'collapsed' : 'expanded'}
                    variants={sidebarVariants}
                    className={` ${darkModeClasses} fixed z-50 flex min-h-screen flex-col shadow-lg backdrop-blur-lg backdrop-filter transition-all duration-100 ease-in-out lg:relative`}
                    aria-label={t('sidebar.ariaLabel')}
                >
                    {/* Header */}
                    <motion.div
                        className={`flex h-14 items-center justify-between px-3 sm:h-[4.5rem] sm:px-4 ${headerClasses} backdrop-blur-md backdrop-filter`}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }} // Hızlandırıldı
                    >
                        {/* Logo and Title */}
                        <motion.div
                            variants={contentVariants}
                            transition={{ duration: 0.05 }}
                            className={`flex w-full items-center justify-center overflow-hidden`}
                        >
                            <motion.div
                                variants={logoVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex w-full justify-center"
                            >
                                <ApplicationLogo
                                    mode={darkMode ? 'dark' : 'light'}
                                    size="large"
                                    collapsed={collapsed && !isMobile}
                                    className={`${collapsed ? 'h-10 sm:h-12' : 'h-12 sm:h-16'} w-auto transition-all duration-200`}
                                />
                            </motion.div>
                        </motion.div>
                        {/* Close Button (Mobile Only) */}
                        {isMobile && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSidebarOpen(false)}
                                className={` ${closeButtonClasses} rounded-full p-2.5 transition-colors duration-100 focus:outline-none focus:ring-2 focus:ring-opacity-50`}
                                aria-label={t('sidebar.closeLabel')}
                            >
                                <MdClose className="h-6 w-6" />
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.nav
                        className="custom-scrollbar mt-6 flex-grow space-y-1 overflow-y-auto px-3 sm:px-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1, delay: 0.05 }}
                    >
                        {/* Ana Menü Öğeleri */}
                        <div className="space-y-2">
                            {menuItems.map((item, index) => (
                                <Tippy
                                    key={index}
                                    content={
                                        collapsed && !isMobile
                                            ? t(item.name)
                                            : ''
                                    }
                                    disabled={!collapsed || isMobile}
                                    placement="right"
                                >
                                    <div>
                                        <NavLink
                                            href={route(item.route)}
                                            active={route().current(item.route)}
                                            darkMode={darkMode}
                                            collapsed={
                                                isMobile ? false : collapsed
                                            }
                                            icon={item.icon}
                                            isMobile={isMobile}
                                        >
                                            {t(item.name)}
                                        </NavLink>
                                    </div>
                                </Tippy>
                            ))}
                        </div>

                        {/* Profil Linki - Her iki rol için de görünür */}
                        <div className="mt-6 space-y-2">
                            <div
                                className={`${collapsed && !isMobile ? 'my-2 border-b border-gray-600 dark:border-gray-400' : 'px-3 py-2 text-xs font-semibold uppercase tracking-wider ' + (darkMode ? 'text-gray-400' : 'text-gray-500')}`}
                            >
                                {!collapsed && t('sidebar.settings')}
                            </div>
                            <Tippy
                                content={
                                    collapsed && !isMobile
                                        ? t('sidebar.profile')
                                        : ''
                                }
                                disabled={!collapsed || isMobile}
                                placement="right"
                            >
                                <div>
                                    <NavLink
                                        href={route('profile.edit')}
                                        active={route().current('profile.edit')}
                                        darkMode={darkMode}
                                        collapsed={isMobile ? false : collapsed}
                                        icon={
                                            <MdPerson className="h-5 w-5 sm:h-6 sm:w-6" />
                                        }
                                        isMobile={isMobile}
                                    >
                                        {t('sidebar.profile')}
                                    </NavLink>
                                </div>
                            </Tippy>
                        </div>
                    </motion.nav>

                    {/* Logout Button */}
                    <motion.div
                        className="mt-auto p-3 sm:p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.05 }} // Hızlandırıldı
                    >
                        <Tippy
                            content={
                                collapsed && !isMobile
                                    ? t('sidebar.logout')
                                    : ''
                            }
                            disabled={!collapsed || isMobile}
                            placement="right"
                        >
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowLogoutModal(true)}
                                className={`flex items-center ${logoutButtonClasses} rounded-xl text-sm font-medium shadow-md backdrop-blur-sm backdrop-filter transition duration-100 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 sm:text-base`}
                                variants={buttonVariants}
                                animate={
                                    collapsed && !isMobile
                                        ? 'collapsed'
                                        : 'expanded'
                                }
                                aria-label={t('sidebar.logout')}
                            >
                                <MdLogout className="h-5 w-5 sm:h-6 sm:w-6" />
                                {(!collapsed || isMobile) && (
                                    <motion.span
                                        variants={contentVariants}
                                        className="ml-2 overflow-hidden whitespace-nowrap sm:ml-3"
                                    >
                                        {t('sidebar.logout')}
                                    </motion.span>
                                )}
                            </motion.button>
                        </Tippy>
                    </motion.div>
                </motion.aside>
            )}
        </AnimatePresence>
    );
};

export default Sidebar;
