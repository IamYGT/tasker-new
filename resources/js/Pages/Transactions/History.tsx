import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { parseAmount } from '@/utils/format';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    FaArrowDown,
    FaArrowUp,
    FaChartLine,
    FaCheckCircle,
    FaClock,
    FaDollarSign,
    FaDownload,
    FaExchangeAlt,
    FaInfoCircle,
    FaLiraSign,
    FaMoneyBillWave,
    FaSearch,
    FaTimesCircle,
} from 'react-icons/fa';

interface Transaction {
    id: number;
    amount: string | number;
    amount_usd: string | number;
    exchange_rate: string | number | null;
    type: string;
    status: string;
    description: string;
    bank_account?: string;
    reference_id: string;
    created_at: string;
    notes?: string;
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
        total_amount_try: number;
        pending_count: number;
        completed_count: number;
    };
}

// Modal Props interface'i
interface ModalProps {
    transaction: Transaction | null;
    onClose: () => void;
}

// İşlem kartı komponenti
const TransactionCard = ({
    transaction,
    onDetails,
}: {
    transaction: Transaction;
    onDetails: (transaction: Transaction) => void;
}) => {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'withdrawal':
                return <FaArrowUp className="h-5 w-5 text-red-500" />;
            case 'deposit':
                return <FaArrowDown className="h-5 w-5 text-green-500" />;
            default:
                return <FaExchangeAlt className="h-5 w-5 text-blue-500" />;
        }
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
                            {getTypeIcon(transaction.type)}
                        </div>
                        <div>
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                {t(`transaction.type.${transaction.type}`)}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(
                                    transaction.created_at,
                                ).toLocaleDateString('tr-TR', {
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
                        <div className="mb-1 text-lg font-bold text-gray-900 dark:text-gray-100">
                            <FaDollarSign className="mr-1 inline h-4 w-4" />
                            {parseAmount(transaction.amount_usd).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            <FaLiraSign className="mr-1 inline h-3 w-3" />
                            {parseAmount(transaction.amount).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span
                            className={`inline-flex items-center space-x-1 rounded-full px-3 py-1 text-sm ${getStatusColor(transaction.status)}`}
                        >
                            {getStatusIcon(transaction.status)}
                            <span>{t(`status.${transaction.status}`)}</span>
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{transaction.reference_id}
                        </span>
                    </div>
                    <button
                        onClick={() => onDetails(transaction)}
                        className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        {t('common.details')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

// İşlem detay modalı
const TransactionDetailModal = ({ transaction, onClose }: ModalProps) => {
    const { t } = useTranslation();
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Modal açıldığında scroll'u en üste al ve kilitle
        window.scrollTo({ top: 0, behavior: 'smooth' });
        document.body.style.overflow = 'hidden';

        // Modal kapandığında scroll'u serbest bırak
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    if (!transaction) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <div className="flex min-h-full items-center justify-center p-4">
                <motion.div
                    ref={modalRef}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ type: 'spring', duration: 0.3 }}
                    className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-xl dark:bg-gray-800"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Modal Header */}
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/95 p-6 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-gray-700 dark:bg-gray-800/95">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                {t('transaction.details')}
                            </h3>
                            <button
                                onClick={onClose}
                                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-gray-300"
                            >
                                <FaTimesCircle className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="max-h-[calc(100vh-16rem)] overflow-y-auto p-6">
                        {/* İşlem Detayları */}
                        <div className="space-y-6">
                            {/* Tutar Bilgileri */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.amounts')}
                                </h4>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transaction.amountUSD')}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            ${' '}
                                            {typeof transaction.amount_usd ===
                                            'number'
                                                ? transaction.amount_usd.toFixed(
                                                      2,
                                                  )
                                                : transaction.amount_usd}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transaction.amountTRY')}
                                        </div>
                                        <div className="mt-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
                                            ₺{' '}
                                            {typeof transaction.amount ===
                                            'number'
                                                ? transaction.amount.toFixed(2)
                                                : transaction.amount}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    {t('transaction.exchangeRate')}:{' '}
                                    {typeof transaction.exchange_rate ===
                                    'number'
                                        ? transaction.exchange_rate.toFixed(4)
                                        : transaction.exchange_rate}
                                </div>
                            </div>

                            {/* İşlem Bilgileri */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                                <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.info')}
                                </h4>
                                <div className="space-y-3">
                                    <div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transaction.referenceId')}
                                        </div>
                                        <div className="mt-1 font-mono text-gray-900 dark:text-gray-100">
                                            {transaction.reference_id}
                                        </div>
                                    </div>
                                    {transaction.bank_account && (
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {t('transaction.bankAccount')}
                                            </div>
                                            <div className="mt-1 font-mono text-gray-900 dark:text-gray-100">
                                                {transaction.bank_account}
                                            </div>
                                        </div>
                                    )}
                                    {transaction.description && (
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {t('transaction.description')}
                                            </div>
                                            <div className="mt-1 text-gray-900 dark:text-gray-100">
                                                {transaction.description}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* İşlem Notları */}
                            {transaction.notes && (
                                <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/30">
                                    <h4 className="mb-3 font-medium text-gray-900 dark:text-gray-100">
                                        {t('transaction.notes')}
                                    </h4>
                                    <div className="text-gray-700 dark:text-gray-300">
                                        {transaction.notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="sticky bottom-0 border-t border-gray-200 bg-gray-50/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-gray-50/80 dark:border-gray-700 dark:bg-gray-800/95">
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                            >
                                {t('common.close')}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default function TransactionHistory({
    auth,
    transactions,
    stats,
}: Props) {
    const { t } = useTranslation();
    const [selectedTransaction, setSelectedTransaction] =
        useState<Transaction | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    // İşlemleri filtrele
    const filteredTransactions = transactions.data.filter((transaction) => {
        const matchesSearch =
            transaction.reference_id
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            transaction.amount_usd.toString().includes(searchTerm) ||
            transaction.amount.toString().includes(searchTerm);

        const matchesType =
            filterType === 'all' || transaction.type === filterType;

        return matchesSearch && matchesType;
    });

    // CSV olarak dışa aktar
    const exportToCSV = () => {
        const headers = [
            t('transaction.date'),
            t('transaction.type'),
            t('transaction.amountUSD'),
            t('transaction.amountTRY'),
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
                    tx.amount,
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

    // Modal açma fonksiyonunu güncelle
    const handleOpenModal = (transaction: Transaction) => {
        // Önce scroll'u en üste al, sonra modalı aç
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setSelectedTransaction(transaction);
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
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                        $
                                        {parseAmount(
                                            stats.total_amount_usd,
                                        ).toFixed(2)}
                                    </p>
                                </div>
                                <FaMoneyBillWave className="h-12 w-12 text-green-500/50" />
                            </div>
                        </motion.div>

                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 dark:from-blue-900/30 dark:to-blue-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {t('transaction.totalAmountTRY')}
                                    </p>
                                    <p className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
                                        ₺
                                        {parseAmount(
                                            stats.total_amount_try,
                                        ).toFixed(2)}
                                    </p>
                                </div>
                                <FaChartLine className="h-12 w-12 text-blue-500/50" />
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
                                <option value="withdrawal">
                                    {t('transaction.type.withdrawal')}
                                </option>
                                <option value="deposit">
                                    {t('transaction.type.deposit')}
                                </option>
                                <option value="transfer">
                                    {t('transaction.type.transfer')}
                                </option>
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
                                    onDetails={handleOpenModal}
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

                    {/* Detay Modalı */}
                    <AnimatePresence>
                        {selectedTransaction && (
                            <TransactionDetailModal
                                transaction={selectedTransaction}
                                onClose={() => setSelectedTransaction(null)}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
