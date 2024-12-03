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
