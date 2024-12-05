import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { Transaction } from '@/types';
import { formatDate, getStatusColor, parseAmount } from '@/utils/format';
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
    FaWallet,
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
                        {/* İşlem Durumu ve Referans */}
                        <motion.div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                            <div className="p-6">
                                <div className="flex flex-col space-y-6">
                                    {/* Referans ID ve Durum */}
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                                <FaTicketAlt className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.referenceId')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {transaction.reference_id}
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`rounded-full px-4 py-1 text-sm font-medium ${
                                            getStatusColor(transaction.status)
                                        }`}>
                                            {t(`transaction.status.${transaction.status}`)}
                                        </div>
                                    </div>

                                    {/* Tutarlar ve Kur Bilgisi */}
                                    <div className="grid gap-6 md:grid-cols-3">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                                                <FaDollarSign className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.amountUSD')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    ${parseAmount(transaction.amount_usd)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-indigo-100 p-2 dark:bg-indigo-900/20">
                                                <FaLiraSign className="h-5 w-5 text-indigo-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.amountTRY')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    ₺{parseAmount(transaction.amount)}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                                <FaExchangeAlt className="h-5 w-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('transaction.exchangeRate')}
                                                </div>
                                                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    {transaction.exchange_rate}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* İşlem Detayları */}
                                    <div className="space-y-4">
                                        {/* Banka Bilgileri - Sadece banka havalesi için */}
                                        {transaction.bank_account && (
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-full bg-cyan-100 p-2 dark:bg-cyan-900/20">
                                                    <FaCreditCard className="h-5 w-5 text-cyan-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {t('transaction.bankAccount')}
                                                    </div>
                                                    <div className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {transaction.bank_account}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Kripto Bilgileri - Sadece kripto işlemleri için */}
                                        {transaction.crypto_address && (
                                            <>
                                                <div className="flex items-center space-x-3">
                                                    <div className="rounded-full bg-orange-100 p-2 dark:bg-orange-900/20">
                                                        <FaWallet className="h-5 w-5 text-orange-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {t('transaction.cryptoAddress')}
                                                        </div>
                                                        <div className="font-mono text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {transaction.crypto_address}
                                                            <span className="ml-2 text-sm text-gray-500">
                                                                ({transaction.crypto_network})
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {transaction.crypto_fee && (
                                                    <div className="flex items-center space-x-3">
                                                        <div className="rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                                                            <FaMoneyBillWave className="h-5 w-5 text-red-600" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                {t('transaction.cryptoFee')}
                                                            </div>
                                                            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                                {transaction.crypto_fee} USDT
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        )}

                                        {/* Tarih Bilgileri */}
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="flex items-center space-x-3">
                                                <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900/20">
                                                    <FaCalendar className="h-5 w-5 text-yellow-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {t('transaction.createdAt')}
                                                    </div>
                                                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        {formatDate(transaction.created_at)}
                                                    </div>
                                                </div>
                                            </div>

                                            {transaction.processed_at && (
                                                <div className="flex items-center space-x-3">
                                                    <div className="rounded-full bg-emerald-100 p-2 dark:bg-emerald-900/20">
                                                        <FaClock className="h-5 w-5 text-emerald-600" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {t('transaction.processedAt')}
                                                        </div>
                                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                            {formatDate(transaction.processed_at)}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* İşlem Notları - Varsa */}
                                        {transaction.notes && (
                                            <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                                <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                    {t('transaction.notes')}
                                                </div>
                                                <div className="mt-1 text-gray-900 dark:text-gray-100">
                                                    {transaction.notes}
                                                </div>
                                            </div>
                                        )}
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
