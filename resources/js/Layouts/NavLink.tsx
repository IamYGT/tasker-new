import React from 'react';
import { Link } from '@inertiajs/react';
import { motion } from 'framer-motion';

interface NavLinkProps {
    href: string;
    active: boolean;
    darkMode: boolean;
    collapsed: boolean;
    icon: React.ReactNode;
    children: React.ReactNode;
    isMobile: boolean;
}

const NavLink: React.FC<NavLinkProps> = ({
    href,
    active,
    darkMode,
    collapsed,
    icon,
    children,
    isMobile
}) => {
    const baseClasses = `
        flex items-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-xl transition-all duration-200 ease-in-out
        ${darkMode 
            ? 'hover:bg-gray-700 hover:bg-opacity-50' 
            : 'hover:bg-light-primary hover:bg-opacity-10'
        }
        focus:outline-none focus:ring-2 focus:ring-opacity-50
        backdrop-filter backdrop-blur-sm
    `;

    const activeClasses = darkMode
        ? 'bg-blue-600 bg-opacity-70 text-white'
        : 'bg-light-primary bg-opacity-20 text-light-primary';

    const inactiveClasses = darkMode
        ? 'text-gray-300'
        : 'text-light-text';

    const classes = `${baseClasses} ${active ? activeClasses : inactiveClasses} ${
        isMobile || !collapsed ? 'justify-start' : 'justify-center'
    }`;

    const iconVariants = {
        hover: { scale: 1.2, rotate: 5, transition: { duration: 0.1 } },
        tap: { scale: 0.9, rotate: -5, transition: { duration: 0.1 } }
    };

    const textVariants = {
        hidden: { opacity: 0, x: -5, transition: { duration: 0.1 } },
        visible: { opacity: 1, x: 0, transition: { duration: 0.1 } }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 500, damping: 20 }}
        >
            <Link href={href} className={classes}>
                <motion.span
                    className={`text-xl sm:text-2xl ${isMobile || !collapsed ? 'mr-3 sm:mr-4' : ''}`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                >
                    {icon}
                </motion.span>
                {(isMobile || !collapsed) && (
                    <motion.span
                        variants={textVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        className="font-medium text-sm sm:text-base whitespace-nowrap"
                    >
                        {children}
                    </motion.span>
                )}
            </Link>
        </motion.div>
    );
};

export default NavLink;