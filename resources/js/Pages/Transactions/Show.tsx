import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import type { TransactionStatus } from '@/types';
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
    FaFileAlt,
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaHistory,
    FaUser,
    FaBuilding,
    FaHashtag,
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
    banks: Bank[];
}

// DetailCard için interface tanımı
interface DetailCardProps {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    value: React.ReactNode;
    className?: string;
}

// Transaction interface'ini güncelle
interface Transaction {
    id: number;
    amount: string | number;
    amount_usd: string | number;
    exchange_rate: string | number | null;
    type: string;
    status: TransactionStatus;
    description: string;
    bank_account?: string;
    bank_id?: string;
    reference_id: string;
    created_at: string;
    updated_at: string;
    notes?: string;
    history?: string;
    processed_at?: string;
    crypto_address?: string;
    crypto_network?: string;
    crypto_fee?: string | number;
    user: {
        id: number;
        name: string;
        email: string;
        roles?: Array<{ name: string }>;
    };
}

// Bank interface'ini ekleyelim
interface Bank {
    id: string;
    name: string;
    code: string;
    logo?: string;
}

const StatusBadge = ({ status }: { status: TransactionStatus }) => {
    const { t } = useTranslation();

    const getIcon = (status: TransactionStatus) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="h-4 w-4" />;
            case 'pending':
            case 'waiting':
                return <FaClock className="h-4 w-4" />;
            case 'rejected':
                return <FaTimesCircle className="h-4 w-4" />;
            default:
                return <FaInfoCircle className="h-4 w-4" />;
        }
    };

    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm font-medium ${getStatusColor(
                status,
            )}`}
        >
            {getIcon(status)}
            {t(`transaction.status.${status}`)}
        </span>
    );
};

const DetailCard = ({ icon: Icon, title, value, className = '' }: DetailCardProps) => (
    <div
        className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
        {/* Arkaplan Efekti */}
        <div className="absolute inset-0 opacity-50 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative flex items-center justify-between">
            <div className="flex-1 space-y-3">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            </div>
            <div className="rounded-full bg-white/90 p-4 shadow-lg ring-1 ring-black/5 dark:bg-gray-800">
                <Icon className="h-8 w-8 transition-transform duration-300 group-hover:scale-110" />
            </div>
        </div>
    </div>
);

// İşlem tipini Türkçe olarak al
const getTransactionType = (type: string) => {
    switch (type) {
        case 'bank_withdrawal':
            return 'Banka Havalesi';
        case 'crypto_withdrawal':
            return 'Kripto Para Çekimi';
        default:
            return type;
    }
};

// İşlem durumunu Türkçe olarak al
const getTransactionStatus = (status: string) => {
    switch (status) {
        case 'pending':
            return 'Bekliyor';
        case 'completed':
            return 'Tamamlandı';
        case 'cancelled':
            return 'İptal Edildi';
        case 'rejected':
            return 'Reddedildi';
        default:
            return status;
    }
};

export default function Show({ auth, transaction, banks }: Props) {
    const { t } = useTranslation();

    console.log('Transaction Data:', {
        bank_id: transaction.bank_id,
        type: transaction.type,
        bank_account: transaction.bank_account,
        banks: banks
    });

    // bank_id kontrolünü güncelleyelim
    const bank = transaction.type === 'bank_withdrawal' && transaction.bank_id
        ? banks.find((b: Bank) => b.id === transaction.bank_id)
        : null;

    console.log('Found Bank:', bank);

    // Tarih formatı için yardımcı fonksiyon
    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Geçersiz Tarih';

        return date.toLocaleString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <div className="flex items-center justify-between">

                </div>
            }
        >
            <Head title={t('transaction.details')} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-gray-800"
                    >
                        {/* Üst Bilgi Kartı */}
                        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-4 sm:p-6 text-white">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                                    <Link
                                        href={route('transactions.history')}
                                        className="inline-flex items-center rounded-lg bg-white/10 px-3 sm:px-4 py-2 text-sm font-medium text-white transition-all hover:bg-white/20 dark:text-gray-200 dark:hover:bg-gray-700/50"
                                    >
                                        <FaArrowLeft className="mr-2 h-4 w-4" />
                                        {t('common.back')}
                                    </Link>
                                    <div className="flex items-center gap-3 sm:gap-4">
                                        <div className="rounded-full bg-white/10 p-2 sm:p-3 backdrop-blur-sm">
                                            <FaHashtag className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="text-xs sm:text-sm opacity-80">{t('transaction.referenceId')}</div>
                                            <div className="text-lg sm:text-2xl font-bold truncate">{transaction.reference_id}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full sm:w-auto flex justify-end">
                                    <StatusBadge status={transaction.status} />
                                </div>
                            </div>
                        </div>

                        {/* Ana Detaylar Grid */}
                        <div className="grid gap-6 p-6 md:grid-cols-2">
                            {/* USD Tutarı */}
                            <DetailCard
                                icon={FaDollarSign}
                                title={t('transaction.amountUSD')}
                                value={`$${parseAmount(transaction.amount_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                                className="bg-gradient-to-br from-green-100 to-emerald-200 hover:from-green-200 hover:to-emerald-300 dark:from-green-900/30 dark:to-emerald-900/30 [&>div]:text-green-600 dark:[&>div]:text-green-400"
                            />

                            {/* TRY Tutarı */}
                            <DetailCard
                                icon={FaLiraSign}
                                title={t('transaction.amountTRY')}
                                value={`₺${parseAmount(transaction.amount).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
                                className="bg-gradient-to-br from-blue-100 to-indigo-200 hover:from-blue-200 hover:to-indigo-300 dark:from-blue-900/30 dark:to-indigo-900/30 [&>div]:text-blue-600 dark:[&>div]:text-blue-400"
                            />

                            {/* Banka Bilgileri */}
                            {transaction.bank_account && (
                                <>
                                    <DetailCard
                                        icon={FaBuilding}
                                        title={t('transaction.bank')}
                                        value={bank?.name || t('common.unknown')}
                                        className="bg-gradient-to-br from-amber-100 to-orange-200 hover:from-amber-200 hover:to-orange-300 dark:from-amber-900/30 dark:to-orange-900/30 [&>div]:text-orange-600 dark:[&>div]:text-orange-400"
                                    />
                                    <DetailCard
                                        icon={FaCreditCard}
                                        title={t('transaction.bankAccount')}
                                        value={
                                            <span className="font-mono">
                                                {transaction.bank_account.replace(/(.{4})/g, '$1 ')}
                                            </span>
                                        }
                                        className="bg-gradient-to-br from-purple-100 to-fuchsia-200 hover:from-purple-200 hover:to-fuchsia-300 dark:from-purple-900/30 dark:to-fuchsia-900/30 [&>div]:text-fuchsia-600 dark:[&>div]:text-fuchsia-400"
                                    />
                                </>
                            )}

                            {/* Kripto Bilgileri */}
                            {transaction.crypto_address && (
                                <>
                                    <DetailCard
                                        icon={FaWallet}
                                        title={t('transaction.cryptoAddress')}
                                        value={
                                            <span className="font-mono break-all">
                                                {transaction.crypto_address}
                                                <div className="mt-1 text-sm text-gray-500">
                                                    {transaction.crypto_network}
                                                </div>
                                            </span>
                                        }
                                        className="bg-gradient-to-br from-violet-50 to-purple-100 hover:shadow-purple-100 dark:from-violet-900/20 dark:to-purple-900/20"
                                    />
                                    {transaction.crypto_fee && (
                                        <DetailCard
                                            icon={FaMoneyBillWave}
                                            title={t('transaction.cryptoFee')}
                                            value={`${transaction.crypto_fee} USDT`}
                                            className="bg-gradient-to-br from-pink-50 to-rose-100 hover:shadow-rose-100 dark:from-pink-900/20 dark:to-rose-900/20"
                                        />
                                    )}
                                </>
                            )}

                            {/* Tarih Bilgisi */}
                            <DetailCard
                                icon={FaCalendar}
                                title={t('transaction.createdAt')}
                                value={formatDateTime(transaction.created_at)}
                                className="bg-gradient-to-br from-teal-100 to-cyan-200 hover:from-teal-200 hover:to-cyan-300 dark:from-teal-900/30 dark:to-cyan-900/30 [&>div]:text-cyan-600 dark:[&>div]:text-cyan-400"
                            />
                        </div>

                        {/* Destek Talebi Oluştur Butonu */}
                        <div className="border-t border-gray-200 p-6 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {t('transaction.needHelp')}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {t('transaction.createTicketDescription')}
                                    </p>
                                </div>
                                <Link
                                    href={route('tickets.create', {
                                        transaction: transaction.id,
                                        subject: `İşlem Destek Talebi #${transaction.reference_id}`,
                                        message: `Bu işlemle ilgili destek talebim var.\n\n` +
                                            `İşlem Detayları:\n` +
                                            `Referans No: ${transaction.reference_id}\n` +
                                            `İşlem Türü: ${getTransactionType(transaction.type)}\n` +
                                            `USD Tutarı: $${parseAmount(transaction.amount_usd).toLocaleString('en-US', { minimumFractionDigits: 2 })}\n` +
                                            `Durum: ${getTransactionStatus(transaction.status)}\n` +
                                            `Oluşturulma Tarihi: ${formatDateTime(transaction.created_at)}`,
                                        priority: 'high',
                                        category: 'billing'
                                    })}
                                    className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
                                >
                                    <FaTicketAlt className="mr-2 h-4 w-4" />
                                    {t('transaction.createTicketButton')}
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
