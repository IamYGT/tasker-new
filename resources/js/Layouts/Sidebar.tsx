import React, { useEffect, useState, useCallback } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import NavLink from './NavLink';
import { MdDashboard, MdPerson, MdLogout, MdClose } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { useTranslation } from '@/Contexts/TranslationContext';

interface SidebarProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    darkMode: boolean;
    setShowLogoutModal: (show: boolean) => void;
    collapsed: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    setShowLogoutModal,
    collapsed
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
        expanded: { width: '16rem', transition: { duration: 0.1, ease: 'easeInOut' } }, // Hızlandırıldı
        collapsed: { width: '4.5rem', transition: { duration: 0.1, ease: 'easeInOut' } } // Hızlandırıldı
    };

    const contentVariants = {
        expanded: { opacity: 1, x: 0, transition: { duration: 0.05 } }, // Hızlandırıldı
        collapsed: { opacity: collapsed ? 1 : 0, x: collapsed ? 0 : -10, transition: { duration: 0.05 } } // Hızlandırıldı
    };

    const logoVariants = {
        expanded: { rotate: 0, scale: 1, transition: { duration: 0.1 } }, // Hızlandırıldı
        collapsed: { rotate: 360, scale: 0.9, transition: { duration: 0.1 } } // Hızlandırıldı
    };

    const buttonVariants = {
        expanded: { width: '100%', justifyContent: 'flex-start', padding: '0.75rem 1rem' },
        collapsed: { width: '3rem', justifyContent: 'center', padding: '0.75rem' }
    };

    const darkModeClasses = darkMode ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900';
    const headerClasses = darkMode ? 'bg-gray-900 bg-opacity-70' : 'bg-gray-200 bg-opacity-70';
    const closeButtonClasses = darkMode ? 'text-gray-200 hover:bg-gray-700 focus:ring-gray-500' : 'text-gray-900 hover:bg-gray-300 focus:ring-gray-400';
    const logoutButtonClasses = darkMode ? 'bg-gradient-to-r from-red-600 to-red-700 text-white hover:from-red-700 hover:to-red-800' : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700';

    return (
        <AnimatePresence>
            {(sidebarOpen || !isMobile) && (
                <motion.aside
                    initial={collapsed ? 'collapsed' : 'expanded'}
                    animate={collapsed ? 'collapsed' : 'expanded'}
                    variants={sidebarVariants}
                    className={`
                        ${darkModeClasses} 
                        backdrop-filter backdrop-blur-lg
                        min-h-screen flex flex-col 
                        fixed lg:relative 
                        z-50 
                        shadow-lg
                        transition-all duration-100 ease-in-out
                    `}
                    aria-label={t('sidebar.ariaLabel')}
                >
                    {/* Header */}
                    <motion.div
                        className={`
                            flex items-center justify-between h-14 sm:h-[4.5rem] px-3 sm:px-4
                            ${headerClasses}
                            backdrop-filter backdrop-blur-md
                        `}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1 }} // Hızlandırıldı
                    >
                        {/* Logo and Title */}
                        <motion.div
                            variants={contentVariants}
                            transition={{ duration: 0.05 }} // Hızlandırıldı
                            className={`flex items-center overflow-hidden ${collapsed && !isMobile ? 'justify-center w-full' : ''}`}
                        >
                            <motion.div
                                variants={logoVariants}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ApplicationLogo className={`h-8 w-8 sm:h-10 sm:w-10 ${isMobile || !collapsed ? 'mr-3 sm:mr-4' : ''}`} />
                            </motion.div>
                            {(!collapsed || isMobile) && (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    transition={{ duration: 0.05 }} // Hızlandırıldı
                                    className="font-semibold text-lg sm:text-xl"
                                >
                                    {t('sidebar.logoText')}
                                </motion.span>
                            )}
                        </motion.div>
                        {/* Close Button (Mobile Only) */}
                        {isMobile && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setSidebarOpen(false)}
                                className={`
                                    ${closeButtonClasses}
                                    p-2.5 rounded-full transition-colors duration-100
                                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                                `}
                                aria-label={t('sidebar.closeLabel')}
                            >
                                <MdClose className="w-6 h-6" />
                            </motion.button>
                        )}
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.nav
                        className="flex-grow mt-6 px-3 sm:px-4 space-y-2 overflow-y-auto custom-scrollbar"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.1, delay: 0.05 }} // Hızlandırıldı
                    >
                        <Tippy content={collapsed && !isMobile ? t('sidebar.dashboard') : ""} disabled={!collapsed || isMobile} placement="right">
                            <div>
                                <NavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                    darkMode={darkMode}
                                    collapsed={isMobile ? false : collapsed}
                                    icon={<MdDashboard className="w-5 h-5 sm:w-6 sm:h-6" />}
                                    isMobile={isMobile}
                                >
                                    {t('sidebar.dashboard')}
                                </NavLink>
                            </div>
                        </Tippy>
                        <Tippy content={collapsed && !isMobile ? t('sidebar.profile') : ""} disabled={!collapsed || isMobile} placement="right">
                            <div>
                                <NavLink
                                    href={route('profile.edit')}
                                    active={route().current('profile.edit')}
                                    darkMode={darkMode}
                                    collapsed={isMobile ? false : collapsed}
                                    icon={<MdPerson className="w-5 h-5 sm:w-6 sm:h-6" />}
                                    isMobile={isMobile}
                                >
                                    {t('sidebar.profile')}
                                </NavLink>
                            </div>
                        </Tippy>
                    </motion.nav>

                    {/* Logout Button */}
                    <motion.div
                        className="mt-auto p-3 sm:p-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.1, delay: 0.05 }} // Hızlandırıldı
                    >
                        <Tippy content={collapsed && !isMobile ? t('sidebar.logout') : ""} disabled={!collapsed || isMobile} placement="right">
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => setShowLogoutModal(true)}
                                className={`
                                    flex items-center
                                    ${logoutButtonClasses}
                                    rounded-xl transition duration-100 ease-in-out
                                    shadow-md hover:shadow-lg
                                    focus:outline-none focus:ring-2 focus:ring-opacity-50 focus:ring-red-400
                                    backdrop-filter backdrop-blur-sm
                                    font-medium text-sm sm:text-base
                                `}
                                variants={buttonVariants}
                                animate={collapsed && !isMobile ? 'collapsed' : 'expanded'}
                                aria-label={t('sidebar.logout')}
                            >
                                <MdLogout className="w-5 h-5 sm:w-6 sm:h-6" />
                                {(!collapsed || isMobile) && (
                                    <motion.span
                                        variants={contentVariants}
                                        className="ml-2 sm:ml-3 whitespace-nowrap overflow-hidden"
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