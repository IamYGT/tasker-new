import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transaction } from '@/types';
import { parseAmount } from '@/utils/format';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FaClock,
    FaExclamationTriangle,
    FaInfoCircle,
    FaMoneyBillWave,
    FaQuestionCircle,
    FaTicketAlt,
} from 'react-icons/fa';

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
        total_amount_usd: string | number;
        total_amount_try: string | number;
        pending_count: number;
        completed_count: number;
    };
}

const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl bg-white shadow-sm transition-all hover:shadow-md dark:bg-gray-800"
        >
            <div className="p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                            <FaExclamationTriangle className="h-5 w-5 text-yellow-600" />
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
                            ${parseAmount(transaction.amount_usd).toFixed(2)}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            ₺{parseAmount(transaction.amount).toFixed(2)}
                        </div>
                    </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center space-x-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300">
                            <FaClock className="h-4 w-4" />
                            <span>{t(`status.${transaction.status}`)}</span>
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{transaction.reference_id}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Link
                            href={route('tickets.create', {
                                transaction: transaction.id,
                            })}
                            className="inline-flex items-center rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                        >
                            <FaTicketAlt className="mr-1.5 h-4 w-4" />
                            {t('transaction.createTicket')}
                        </Link>
                        <Link
                            href={route('transactions.show', transaction.id)}
                            className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        >
                            {t('common.details')}
                        </Link>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function PendingTransactions({
    auth,
    transactions,
    stats,
}: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('transaction.pendingTransactions')}
                </h2>
            }
        >
            <Head title={t('transaction.pendingTransactions')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

                        {/* Diğer istatistik kartları... */}
                    </div>

                    {/* Yardım Kartı */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 rounded-xl bg-white p-6 shadow-sm dark:bg-gray-800"
                    >
                        <div className="flex items-start space-x-4">
                            <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/20">
                                <FaQuestionCircle className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.pendingInfo.title')}
                                </h3>
                                <p className="mt-1 text-gray-600 dark:text-gray-400">
                                    {t('transaction.pendingInfo.description')}
                                </p>
                                <div className="mt-4">
                                    <Link
                                        href={route('tickets.create')}
                                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                    >
                                        <FaTicketAlt className="mr-2 h-4 w-4" />
                                        {t('transaction.openSupportTicket')}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Bekleyen İşlemler Listesi */}
                    <div className="space-y-4">
                        {transactions.data.length > 0 ? (
                            transactions.data.map((transaction) => (
                                <TransactionCard
                                    key={transaction.id}
                                    transaction={transaction}
                                />
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center dark:bg-gray-800">
                                <FaInfoCircle className="mb-4 h-12 w-12 text-gray-400" />
                                <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.noPendingTransactions')}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400">
                                    {t('transaction.allTransactionsCompleted')}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
