import React from 'react';
import { FaCheck, FaTimes, FaClock } from 'react-icons/fa';
import { TransactionType, TransactionStatus } from '@/types';

export const getTypeColor = (type: TransactionType): string => {
    switch (type) {
        case 'withdrawal':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
        case 'deposit':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        case 'transfer':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
};

export const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
        case 'pending':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
        case 'cancelled':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
};

export const getStatusIcon = (status: TransactionStatus): JSX.Element | null => {
    const iconProps = { className: "w-3 h-3" };
    
    switch (status) {
        case 'completed':
            return React.createElement(FaCheck, iconProps);
        case 'pending':
            return React.createElement(FaClock, iconProps);
        case 'cancelled':
            return React.createElement(FaTimes, iconProps);
        default:
            return null;
    }
}; 