import React from 'react';
import { MdLightMode, MdDarkMode } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';

interface ThemeToggleProps {
    darkMode: boolean;
    toggleDarkMode: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ darkMode, toggleDarkMode }) => {
    return (
        <button
            onClick={toggleDarkMode}
            className={`
                flex items-center justify-center p-2 sm:p-2.5 rounded-full transition-all duration-300 ease-in-out
                focus:outline-none focus:ring-2 focus:ring-opacity-50
                shadow-md hover:shadow-lg backdrop-filter backdrop-blur-lg
                ${darkMode
                    ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-600'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300'
                }
            `}
            aria-label="Tema değiştir"
        >
            <AnimatePresence mode="wait">
                {darkMode ? (
                    <motion.div
                        key="light"
                        initial={{ opacity: 0, rotate: -180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MdLightMode className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                ) : (
                    <motion.div
                        key="dark"
                        initial={{ opacity: 0, rotate: 180 }}
                        animate={{ opacity: 1, rotate: 0 }}
                        exit={{ opacity: 0, rotate: -180 }}
                        transition={{ duration: 0.3 }}
                    >
                        <MdDarkMode className="w-5 h-5 sm:w-6 sm:h-6" />
                    </motion.div>
                )}
            </AnimatePresence>
        </button>
    );
};

export default ThemeToggle;