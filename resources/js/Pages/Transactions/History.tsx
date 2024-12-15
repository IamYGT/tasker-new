import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { parseAmount } from '@/format';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import {
    FaArrowDown,
    FaArrowUp,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaDollarSign,
    FaDownload,
    FaMoneyBill,
    FaExchangeAlt,
    FaInfoCircle,
    FaLiraSign,
    FaMoneyBillWave,
    FaSearch,
    FaTimesCircle,
    FaBitcoin,
} from 'react-icons/fa';
import { Link } from '@inertiajs/react';

interface Transaction {
    id: number;
    amount_usd: string | number;
    exchange_rate: string | number | null;
    type: string;
    status: string;
    description: string;
    bank_account?: string;
    crypto_address?: string;
    reference_id: string;
    created_at: string;
    notes?: string;
    customer_name?: string;
    customer_surname?: string;
    customer_meta_id?: string;
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
        };
    };
    transactions: {
        data: Transaction[];
        meta: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
    };
    stats: {
        total_amount_usd: number;
        pending_count: number;
        completed_count: number;
    };
}

// İşlem kartı komponenti
const TransactionCard = ({
    transaction,
}: {
    transaction: Transaction;
}) => {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'rejected':
                return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
            case 'cancelled':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="h-5 w-5" />;
            case 'pending':
            case 'waiting':
                return <FaClock className="h-5 w-5" />;
            case 'rejected':
                return <FaTimesCircle className="h-5 w-5" />;
            default:
                return <FaInfoCircle className="h-5 w-5" />;
        }
    };

    const getTypeIcon = (type: string, transaction: Transaction) => {
        if (type === 'bank_withdrawal') {
            return <FaMoneyBill className="h-5 w-5 text-blue-500" />;
        }
        if (type === 'crypto_withdrawal') {
            return <FaBitcoin className="h-5 w-5 text-orange-500" />;
        }
        return <FaMoneyBillWave className="h-5 w-5 text-gray-500" />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-700">
                            {getTypeIcon(transaction.type, transaction)}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {t(`transaction.type.${transaction.type}`)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(transaction.created_at).toLocaleDateString('tr-TR', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                            <FaDollarSign className="mr-1 inline h-4 w-4" />
                            {parseAmount(transaction.amount_usd).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span
                            className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(transaction.status)}`}
                        >
                            {getStatusIcon(transaction.status)}
                            <span>{t(`status.${transaction.status}`)}</span>
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{transaction.reference_id}
                        </span>
                    </div>
                    <Link
                        href={route('transactions.show', transaction.id)}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        {t('common.details')}
                    </Link>
                </div>
            </div>
        </motion.div>
    );
};

export default function TransactionHistory({
    auth,
    transactions,
    stats,
}: Props) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // İşlemleri filtrele
    const filteredTransactions = transactions.data.filter((transaction) => {
        const matchesSearch =
            transaction.reference_id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.amount_usd.toString().includes(searchTerm);

        const matchesFilter =
            filterType === 'all' ||
            transaction.status === filterType ||
            transaction.type === filterType;

        return matchesSearch && matchesFilter;
    });

    // CSV olarak dışa aktar
    const exportToCSV = () => {
        const headers = [
            t('transaction.date'),
            t('transaction.type'),
            t('transaction.amountUSD'),
            t('transaction.status'),
            t('transaction.referenceId'),
        ];

        const csvContent = [
            headers.join(','),
            ...filteredTransactions.map((tx) =>
                [
                    new Date(tx.created_at).toLocaleDateString(),
                    t(`transaction.type.${tx.type}`),
                    tx.amount_usd,
                    t(`status.${tx.status}`),
                    tx.reference_id,
                ].join(','),
            ),
        ].join('\n');

        const blob = new Blob([csvContent], {
            type: 'text/csv;charset=utf-8;',
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        toast.success(t('transaction.exported'));
    };

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('transaction.history')}
                </h2>
            }
        >
            <Head title={t('transaction.history')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 dark:from-green-900/30 dark:to-green-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                        {t('transaction.totalAmountUSD')}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">
                                        ${parseAmount(stats.total_amount_usd).toFixed(2)}
                                    </p>
                                </div>
                                <FaMoneyBillWave className="h-12 w-12 text-green-500/50" />
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 dark:from-yellow-900/30 dark:to-yellow-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                                        {t('transaction.pendingCount')}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-yellow-700 dark:text-yellow-300">
                                        {stats.pending_count}
                                    </p>
                                </div>
                                <FaClock className="h-12 w-12 text-yellow-500/50" />
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 dark:from-purple-900/30 dark:to-purple-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        {t('transaction.completedCount')}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">
                                        {stats.completed_count}
                                    </p>
                                </div>
                                <FaCheckCircle className="h-12 w-12 text-purple-500/50" />
                            </div>
                        </motion.div>
                    </div>

                    {/* Filtreler ve Arama */}
                    <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-1 items-center space-x-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    placeholder={t(
                                        'transaction.searchPlaceholder',
                                    )}
                                    className="w-full rounded-lg border-gray-300 pl-10 pr-4 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                />
                                <FaSearch className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                            </div>
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className="rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            >
                                <option value="all">{t('common.all')}</option>
                                <optgroup label={t('transaction.statusGroup')}>
                                    <option value="pending">{t('status.pending')}</option>
                                    <option value="cancelled">{t('status.cancelled')}</option>
                                    <option value="completed">{t('status.completed')}</option>
                                    <option value="rejected">{t('status.rejected')}</option>
                                </optgroup>
                                <optgroup label={t('transaction.accountGroup')}>
                                    <option value="crypto_withdrawal">{t('transaction.type.crypto')}</option>
                                    <option value="bank_withdrawal">{t('transaction.type.bank')}</option>
                                </optgroup>
                            </select>
                        </div>
                        <button
                            onClick={exportToCSV}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <FaDownload className="mr-2 h-4 w-4" />
                            {t('common.export')}
                        </button>
                    </div>

                    {/* İşlem Listesi */}
                    <div className="space-y-4">
                        {filteredTransactions.length > 0 ? (
                            filteredTransactions.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center dark:bg-gray-800">
                                <FaInfoCircle className="mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.noResults')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t('transaction.tryDifferentSearch')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
