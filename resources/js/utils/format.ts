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

export const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

type TransactionStatus = 'waiting' | 'pending' | 'approved' | 'completed' | 'cancelled' | 'rejected';

export const getStatusColor = (status: TransactionStatus): string => {
    const colors: Record<TransactionStatus, string> = {
        waiting: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
        pending: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
        approved: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400',
        completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
        cancelled: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
        rejected: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    };
    return colors[status] || colors.pending;
};
