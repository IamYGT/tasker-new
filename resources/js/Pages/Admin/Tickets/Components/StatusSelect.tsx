import React from 'react';
import { FaCircle, FaSpinner } from 'react-icons/fa';
import { Menu } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';

interface StatusSelectProps {
    currentStatus: string;
    statuses: string[];
    onChange: (status: string) => void;
    isLoading?: boolean;
    t: (key: string) => string;
}

export default function StatusSelect({ 
    currentStatus, 
    statuses, 
    onChange, 
    isLoading = false,
    t 
}: StatusSelectProps) {
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'text-blue-500';
            case 'answered': return 'text-green-500';
            case 'closed': return 'text-gray-500';
            default: return 'text-gray-500';
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium 
                    border-2 hover:border-gray-300 dark:hover:border-gray-600 transition-colors
                    bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700
                    disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? (
                    <FaSpinner className="w-4 h-4 animate-spin" />
                ) : (
                    <FaCircle className={`w-2 h-2 ${getStatusColor(currentStatus)}`} />
                )}
                <span>{t(`ticket.status.${currentStatus}`)}</span>
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </Menu.Button>

            <AnimatePresence>
                <Menu.Items as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 rounded-xl overflow-hidden 
                        bg-white dark:bg-gray-800 shadow-lg border border-gray-200 
                        dark:border-gray-700 z-50"
                >
                    <div className="py-1">
                        {statuses.map((status) => (
                            <Menu.Item key={status}>
                                {({ active }) => (
                                    <button
                                        onClick={() => onChange(status)}
                                        disabled={isLoading || status === currentStatus}
                                        className={`${
                                            active ? 'bg-gray-100 dark:bg-gray-700' : ''
                                        } ${
                                            currentStatus === status ? 'bg-gray-50 dark:bg-gray-700' : ''
                                        } ${
                                            isLoading ? 'opacity-50 cursor-not-allowed' : ''
                                        } flex items-center gap-2 w-full px-4 py-2 text-sm`}
                                    >
                                        <FaCircle className={`w-2 h-2 ${getStatusColor(status)}`} />
                                        {t(`ticket.status.${status}`)}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </AnimatePresence>
        </Menu>
    );
} 