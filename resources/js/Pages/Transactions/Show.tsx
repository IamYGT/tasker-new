import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transaction } from '@/types';
import { parseAmount } from '@/utils/format';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    FaArrowLeft,
    FaCalendar,
    FaClock,
    FaCreditCard,
    FaDollarSign,
    FaExchangeAlt,
    FaLiraSign,
    FaMoneyBillWave,
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
    transaction: Transaction;
}

export default function Show({ auth, transaction }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('transaction.details')}
                    </h2>
                    <Link
                        href={route('transactions.history')}
                        className="inline-flex items-center rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                        <FaArrowLeft className="mr-2 h-4 w-4" />
                        {t('common.back')}
                    </Link>
                </div>
            }
        >
            <Head
                title={`${t('transaction.details')} - ${transaction.reference_id}`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="space-y-6">
                        {/* İşlem Durumu */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                        >
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="rounded-full bg-yellow-100 p-3 dark:bg-yellow-900/20">
                                            <FaClock className="h-6 w-6 text-yellow-600" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                {t(
                                                    `status.${transaction.status}`,
                                                )}
                                            </h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {t('transaction.lastUpdated')}:{' '}
                                                {new Date(
                                                    transaction.updated_at,
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
                                    <Link
                                        href={route('tickets.create', {
                                            transaction: transaction.id,
                                        })}
                                        className="inline-flex items-center rounded-lg bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-600 transition-colors hover:bg-indigo-100 dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40"
                                    >
                                        <FaTicketAlt className="mr-2 h-4 w-4" />
                                        {t('transaction.createTicket')}
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* İşlem Detayları */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                        >
                            <div className="p-6">
                                <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('transaction.details')}
                                </h3>
                                <div className="grid gap-6 md:grid-cols-2">
                                    {/* Tutar Bilgileri */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                                                <FaDollarSign className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.amountUSD')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    $
                                                    {parseAmount(
                                                        transaction.amount_usd,
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                                <FaLiraSign className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.amountTRY')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    ₺
                                                    {parseAmount(
                                                        transaction.amount,
                                                    ).toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                                <FaExchangeAlt className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t(
                                                        'transaction.exchangeRate',
                                                    )}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {typeof transaction.exchange_rate ===
                                                    'string'
                                                        ? parseFloat(
                                                              transaction.exchange_rate,
                                                          ).toFixed(4)
                                                        : transaction.exchange_rate?.toFixed(
                                                              4,
                                                          ) || '-'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Diğer Detaylar */}
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/20">
                                                <FaMoneyBillWave className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.type')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        `transaction.type.${transaction.type}`,
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        {transaction.bank_account && (
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                                                    <FaCreditCard className="h-5 w-5 text-red-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {t(
                                                            'transaction.bankAccount',
                                                        )}
                                                    </div>
                                                    <div className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {
                                                            transaction.bank_account
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                                <FaCalendar className="h-5 w-5 text-yellow-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.date')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {new Date(
                                                        transaction.created_at,
                                                    ).toLocaleDateString(
                                                        'tr-TR',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        },
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
