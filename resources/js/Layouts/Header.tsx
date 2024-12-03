import { useTranslation } from '@/Contexts/TranslationContext';
import { User } from '@/types';
import { Link } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import {
    MdAccountCircle,
    MdChevronLeft,
    MdChevronRight,
    MdClose,
    MdExitToApp,
    MdExpandMore,
    MdMenu,
    MdPerson,
} from 'react-icons/md';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import useOnClickOutside from './useOnClickOutside';

interface Language {
    dil_id: number;
    dil_baslik: string;
    dil_kod: string;
}

interface HeaderProps {
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    darkMode: boolean;
    toggleDarkMode: () => void;
    auth: {
        user: User;
    };
    languages: Language[];
    secili_dil: Language;
    header?: React.ReactNode;
    collapsed: boolean;
    setCollapsed: (collapsed: boolean) => void;
    toggleCollapse: () => void;
    isMobile: boolean;
    setShowLogoutModal: (show: boolean) => void;
    onLanguageChange: (langCode: string) => void; // Yeni prop eklendi
}

const Dropdown: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
    triggerRef?: React.RefObject<HTMLElement>;
}> = memo(({ isOpen, onClose, children, className = '', triggerRef }) => {
    const ref = useRef<HTMLDivElement>(null);
    useOnClickOutside(ref, onClose, triggerRef ? [triggerRef] : undefined);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute right-0 z-30 mt-2 w-60 rounded-xl p-3 shadow-xl backdrop-blur-xl ${className}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
});

const Header: React.FC<HeaderProps> = ({
    sidebarOpen,
    setSidebarOpen,
    darkMode,
    toggleDarkMode,
    auth,
    languages,
    secili_dil,
    header,
    collapsed,
    toggleCollapse,
    isMobile,
    setShowLogoutModal,
    onLanguageChange, // Prop eklendi
}) => {
    const { t } = useTranslation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);

    const getInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    }, []);

    const dropdownItemClasses = useCallback(
        (isSelected = false) => `
      flex items-center w-full text-left px-3 py-2 text-sm transition-colors duration-200 ease-in-out
      ${
          darkMode
              ? `${isSelected ? 'bg-gray-700 text-gray-200' : 'text-gray-400'} hover:bg-gray-600`
              : `${isSelected ? 'bg-gray-300 text-gray-900' : 'text-gray-600'} hover:bg-gray-200`
      }
      rounded-lg
    `,
        [darkMode],
    );

    useEffect(() => {
        const handleResize = () => {
            if (!isMobile) {
                setLanguageDropdownOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMobile]);

    useEffect(() => {
        if (!dropdownOpen) {
            setLanguageDropdownOpen(false);
        }
    }, [dropdownOpen]);

    // Kullanıcı bilgilerinin var olduğundan emin olalım
    const user = auth?.user;

    if (!user) {
        return null; // veya bir loading state gösterebilirsiniz
    }

    return (
        <header
            className={`sticky top-0 z-10 w-full transition-all duration-500 ease-in-out ${
                darkMode ? 'bg-gray-800/80' : 'bg-gray-100/80'
            } border-b backdrop-blur-md ${
                darkMode ? 'border-gray-700/20' : 'border-gray-300/20'
            } shadow-lg`}
        >
            <div className="mx-auto max-w-full px-3 py-2 sm:px-4 sm:py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {!isMobile && (
                            <button
                                onClick={toggleCollapse}
                                className={`flex items-center justify-center rounded-full p-2 shadow-md backdrop-blur-lg backdrop-filter transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:p-2.5 ${
                                    darkMode
                                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-600'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300'
                                } `}
                                aria-label={
                                    collapsed
                                        ? t('header.expandSidebar')
                                        : t('header.collapseSidebar')
                                }
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {collapsed ? (
                                        <motion.div
                                            key="expand"
                                            initial={{
                                                opacity: 0,
                                                rotate: -180,
                                            }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MdChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="collapse"
                                            initial={{
                                                opacity: 0,
                                                rotate: 180,
                                            }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MdChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        )}

                        {isMobile && (
                            <button
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className={`flex items-center justify-center rounded-full p-2 shadow-md backdrop-blur-lg backdrop-filter transition-all duration-300 ease-in-out hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 sm:p-2.5 ${
                                    darkMode
                                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-600'
                                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300'
                                } `}
                                aria-label={t('header.toggleSidebar')}
                            >
                                <AnimatePresence mode="wait" initial={false}>
                                    {sidebarOpen ? (
                                        <motion.div
                                            key="close"
                                            initial={{
                                                opacity: 0,
                                                rotate: -180,
                                            }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: 180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MdClose className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="open"
                                            initial={{
                                                opacity: 0,
                                                rotate: 180,
                                            }}
                                            animate={{ opacity: 1, rotate: 0 }}
                                            exit={{ opacity: 0, rotate: -180 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <MdMenu className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </button>
                        )}
                        {header}
                    </div>

                    <div className="flex items-center space-x-3 sm:space-x-4">
                        {!isMobile && (
                            <LanguageSelector
                                darkMode={darkMode}
                                languages={languages}
                                secili_dil={secili_dil}
                                isMobile={isMobile}
                                onLanguageChange={onLanguageChange} // Düzenlendi
                            />
                        )}
                        <ThemeToggle
                            darkMode={darkMode}
                            toggleDarkMode={toggleDarkMode}
                        />

                        <div className="relative">
                            <button
                                ref={buttonRef}
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="group relative flex items-center focus:outline-none"
                            >
                                <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full sm:h-10 sm:w-10">
                                    {auth.user.avatar ? (
                                        <img
                                            src={auth.user.avatar}
                                            alt={auth.user.name}
                                            className="h-full w-full object-cover transition-all duration-300"
                                            onError={(e) => {
                                                const target =
                                                    e.target as HTMLImageElement;
                                                target.style.display = 'none';
                                                target.nextElementSibling?.classList.remove(
                                                    'hidden',
                                                );
                                            }}
                                        />
                                    ) : (
                                        <MdAccountCircle
                                            className={`h-full w-full ${darkMode ? 'text-gray-300' : 'text-gray-600'} transition-colors duration-300`}
                                        />
                                    )}
                                </div>
                                <MdExpandMore
                                    className={`ml-1 h-4 w-4 transition-transform duration-300 sm:h-5 sm:w-5 ${dropdownOpen ? 'rotate-180' : 'rotate-0'} ${darkMode ? 'text-gray-300' : 'text-gray-600'} `}
                                />
                            </button>

                            <Dropdown
                                isOpen={dropdownOpen}
                                onClose={() => setDropdownOpen(false)}
                                triggerRef={buttonRef}
                                className={`${
                                    darkMode
                                        ? 'border-gray-700 bg-gray-800 text-gray-200'
                                        : 'border-gray-100 bg-white text-gray-900'
                                } w-72 overflow-hidden rounded-2xl border-2 shadow-2xl transition-all duration-300 ease-in-out sm:w-80`}
                            >
                                <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700 sm:px-5 sm:py-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex-shrink-0">
                                            {auth.user.avatar ? (
                                                <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700 sm:h-14 sm:w-14">
                                                    <img
                                                        src={auth.user.avatar}
                                                        alt={auth.user.name}
                                                        className="h-full w-full object-cover"
                                                        onError={(e) => {
                                                            const target =
                                                                e.target as HTMLImageElement;
                                                            target.style.display =
                                                                'none';
                                                            target.parentElement?.classList.add(
                                                                'hidden',
                                                            );
                                                            target.parentElement?.nextElementSibling?.classList.remove(
                                                                'hidden',
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            ) : (
                                                <div
                                                    className={`flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14 ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'} `}
                                                >
                                                    <MdAccountCircle className="h-full w-full" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <div className="text-base font-bold sm:text-lg">
                                                {auth.user.name}
                                            </div>
                                            <div className="truncate text-xs text-gray-500 dark:text-gray-400 sm:text-sm">
                                                {auth.user.email}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-1 p-2">
                                    {isMobile && (
                                        <div className="mb-2 px-1">
                                            <button
                                                onClick={() =>
                                                    setLanguageDropdownOpen(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className={`flex w-full items-center justify-between px-3 py-2 text-sm transition-colors duration-200 ease-in-out ${
                                                    darkMode
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                                        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                                                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400`}
                                            >
                                                <div className="flex items-center">
                                                    <img
                                                        src={`https://flagcdn.com/w40/${secili_dil.dil_kod === 'en' ? 'gb' : secili_dil.dil_kod}.png`}
                                                        alt={`${secili_dil.dil_baslik} bayrağı`}
                                                        className="mr-2 h-6 w-6 rounded-full object-contain shadow-sm"
                                                    />
                                                    <span className="font-medium">
                                                        {secili_dil.dil_baslik}
                                                    </span>
                                                </div>
                                                <MdExpandMore
                                                    className={`h-5 w-5 transition-transform duration-300 ${languageDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                                />
                                            </button>

                                            {languageDropdownOpen && (
                                                <div className="mt-1">
                                                    <LanguageSelector
                                                        darkMode={darkMode}
                                                        languages={languages}
                                                        secili_dil={secili_dil}
                                                        isMobile={isMobile}
                                                        embedded
                                                        onLanguageChange={
                                                            onLanguageChange
                                                        }
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <Link
                                        href={route('profile.edit')}
                                        className={dropdownItemClasses()}
                                    >
                                        <MdPerson className="mr-2 h-5 w-5" />
                                        <span className="font-medium">
                                            {t('header.profile')}
                                        </span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            setDropdownOpen(false);
                                            setShowLogoutModal(true);
                                        }}
                                        className={`${dropdownItemClasses()} w-full text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300`}
                                    >
                                        <MdExitToApp className="mr-2 h-5 w-5 text-red-500 dark:text-red-400" />
                                        <span className="font-medium">
                                            {t('header.logout')}
                                        </span>
                                    </button>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default memo(Header);
