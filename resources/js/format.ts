import type { TransactionStatus } from '@/types';

/**
 * Format a number with thousands separator
 */
export function formatNumber(value: number): string {
    return new Intl.NumberFormat('tr-TR').format(value);
}

/**
 * Format a number as currency (TL)
 */
export function formatCurrency(value: number): string {
    return new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
    }).format(value);
}

export const parseAmount = (amount: string | number): number => {
    if (typeof amount === 'string') {
        return parseFloat(amount);
    }
    return amount;
};

export const formatDateTime = (date: string) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Geçersiz Tarih';

    return dateObj.toLocaleString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const formatDate = (date: string) => {
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) return 'Geçersiz Tarih';

    return dateObj.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

export const getStatusColor = (status: TransactionStatus): string => {
    switch (status) {
        case 'completed':
            return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
        case 'pending':
        case 'waiting':
            return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
        case 'rejected':
            return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
};
