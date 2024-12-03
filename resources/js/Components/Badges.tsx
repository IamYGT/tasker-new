import React from 'react';

interface BadgeProps {
    priority?: string;
    status?: string;
}

export const PriorityBadge = ({ priority }: BadgeProps) => {
    const colors = {
        low: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[priority as keyof typeof colors]}`}>
            {priority}
        </span>
    );
};

export const StatusBadge = ({ status }: BadgeProps) => {
    const colors = {
        open: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        answered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300'
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}>
            {status}
        </span>
    );
};
