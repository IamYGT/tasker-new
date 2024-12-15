import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React from 'react';
import {
    FaArrowLeft,
    FaCalendar,
    FaCopy,
    FaCreditCard,
    FaEdit,
    FaExchangeAlt,
    FaFileAlt,
    FaHistory,
    FaMoneyBillWave,
    FaStickyNote,
    FaUser,
    FaBitcoin,
    FaNetworkWired,
    FaHashtag,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaInfoCircle,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface HistoryItem {
    status?: string;
    timestamp: string;
    note?: string;
    messageKey?: string;
    type?: string;
    params?: Record<string, string>;
    date?: string;
    user?: string;
}

interface Transaction {
    id: number;
    user_id: number;
    amount: string;
    amount_usd: string;
    exchange_rate: string;
    type: 'bank_withdrawal' | 'crypto_withdrawal';
    status: 'pending' | 'completed' | 'cancelled' | 'rejected';
    description?: string;
    bank_account?: string;
    bank_id?: string;
    reference_id: string;
    processed_at?: string;
    notes?: string;
    history?: string;
    crypto_address?: string;
    crypto_network?: string;
    crypto_fee?: string;
    crypto_txid?: string;
    created_at: string;
    updated_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    customer_name?: string;
    customer_surname?: string;
    customer_meta_id?: number;
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
    transaction: Transaction;
}

export default function Show({ auth, transaction }: Props) {
    const { t } = useTranslation();

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    // History verilerini parse et
    const parseHistory = (): HistoryItem[] => {
        try {
            if (!transaction.history) return [];
            const history = JSON.parse(transaction.history);
            return Array.isArray(history) ? history : [];
        } catch {
            return [];
        }
    };

    // History mesajını render et
    const renderHistoryMessage = (item: HistoryItem) => {
        if (item.messageKey) {
            let message = t(item.messageKey);
            if (item.params) {
                Object.entries(item.params).forEach(([key, value]) => {
                    message = message.replace(`:${key}`, value);
                });
            }
            return message;
        }
        return item.note || '';
    };

    // History'yi render et
    const renderHistory = () => {
        const history = parseHistory();

        if (history.length === 0) {
            return (
                <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('transaction.noHistory')}
                </div>
            );
        }

        return history.map((item, index) => (
            <div key={index} className="relative flex items-start pl-8">
                <div className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full
                    ${item.type === 'status_change' ? 'bg-blue-100 dark:bg-blue-900/20' :
                        item.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                            'bg-gray-100 dark:bg-gray-700/50'}`}>
                    <FaHistory className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>

                <div className="ml-4 flex-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                        {renderHistoryMessage(item)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <span>
                            {new Date(item.timestamp || item.date || '').toLocaleDateString('tr-TR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </span>
                    </div>
                </div>
            </div>
        ));
    };

    // Kripto işlem detaylarını render et
    const renderCryptoDetails = () => {
        if (transaction.type !== 'crypto_withdrawal') return null;

        return (
            <div className="space-y-4">
                <DetailItem
                    icon={<FaBitcoin />}
                    label={t('transaction.cryptoAddress')}
                    value={
                        <div className="flex items-center space-x-2">
                            <span className="font-mono text-gray-900 dark:text-gray-100">
                                {transaction.crypto_address}
                            </span>
                            {transaction.crypto_address && (
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.crypto_address!);
                                        toast.success(t('common.copied'));
                                    }}
                                    className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FaCopy className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    }
                />
                <DetailItem
                    icon={<FaNetworkWired />}
                    label={t('transaction.cryptoNetwork')}
                    value={transaction.crypto_network?.toUpperCase()}
                />
                {transaction.crypto_fee && (
                    <DetailItem
                        icon={<FaMoneyBillWave />}
                        label={t('transaction.cryptoFee')}
                        value={`${transaction.crypto_fee} USDT`}
                    />
                )}
                {transaction.crypto_txid && (
                    <DetailItem
                        icon={<FaHashtag />}
                        label={t('transaction.cryptoTxid')}
                        value={
                            <div className="flex items-center space-x-2">
                                <span className="font-mono text-gray-900 dark:text-gray-100">
                                    {transaction.crypto_txid}
                                </span>
                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(transaction.crypto_txid!);
                                        toast.success(t('common.copied'));
                                    }}
                                    className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <FaCopy className="h-4 w-4" />
                                </button>
                            </div>
                        }
                    />
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    ...auth.user,
                    roles: auth.user.roles || [],
                },
            }}
        >
            <Head title={`${t('transaction.details')} - ${transaction.reference_id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6"
                    >
                        {/* Üst Bar */}
                        <motion.div variants={cardVariants} className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Link
                                        href={route('admin.transactions.index')}
                                        className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-gray-600 transition-all duration-200 hover:text-gray-900 hover:shadow-md dark:bg-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <FaArrowLeft className="mr-2 h-4 w-4" />
                                        {t('common.back')}
                                    </Link>
                                    <div className="flex flex-col">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                            {t('transaction.details')}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transaction.viewDescription')}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.transactions.edit', transaction.id)}
                                    className="group inline-flex items-center rounded-lg bg-primary-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow-md"
                                >
                                    <FaEdit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                    {t('common.edit')}
                                </Link>
                            </div>
                        </motion.div>

                        {/* Ana İçerik */}
                        <motion.div variants={cardVariants} className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                            {/* Durum Banner */}
                            <div className={`px-8 py-4 ${getStatusColor(transaction.status)} border-b border-gray-100 bg-opacity-10 dark:border-gray-700 dark:bg-opacity-20`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(transaction.status)}
                                        <span className="font-medium">
                                            {t(`status.${transaction.status}`)}
                                        </span>
                                    </div>
                                    <span className={`rounded-lg px-4 py-1.5 text-sm font-medium ${getTypeColor(transaction.type)}`}>
                                        {t(`transaction.type.${transaction.type}`)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                    {/* Sol Kolon - Temel Bilgiler */}
                                    <div className="space-y-8">
                                        {/* Kullanıcı Bilgileri */}
                                        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                <FaUser className="mr-2 h-5 w-5 text-gray-500" />
                                                {t('transaction.userDetails')}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="bg-primary-100 dark:bg-primary-900/50 flex h-12 w-12 items-center justify-center rounded-full">
                                                        <span className="text-primary-700 dark:text-primary-300 text-lg font-medium">
                                                            {transaction.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {transaction.user.name}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {transaction.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ödeme Detayları */}
                                        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                <FaMoneyBillWave className="mr-2 h-5 w-5 text-gray-500" />
                                                {t('transaction.paymentDetails')}
                                            </h3>
                                            <div className="space-y-4">
                                                {/* Müşteri Bilgileri - Sadece banka çekimleri için göster */}
                                                {transaction.type === 'bank_withdrawal' && (transaction.customer_name || transaction.customer_surname) && (
                                                    <DetailItem
                                                        icon={<FaUser />}
                                                        label={t('withdrawal.accountHolder')}
                                                        value={
                                                            <div className="space-y-1">
                                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                                    {transaction.customer_name} {transaction.customer_surname}
                                                                </div>
                                                                {transaction.customer_meta_id && (
                                                                    <div className="text-sm text-gray-500">
                                                                        {t('withdrawal.customerMetaId')}: {transaction.customer_meta_id}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        }
                                                    />
                                                )}

                                                {/* Tutar Bilgisi */}
                                                <DetailItem
                                                    icon={<FaMoneyBillWave />}
                                                    label={t('transaction.amount')}
                                                    value={
                                                        <div className="space-y-1">
                                                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                {new Intl.NumberFormat('en-US', {
                                                                    style: 'currency',
                                                                    currency: 'USD',
                                                                }).format(parseFloat(transaction.amount_usd))}
                                                            </span>
                                                            <div className="text-sm text-gray-500">
                                                                {new Intl.NumberFormat('tr-TR', {
                                                                    style: 'currency',
                                                                    currency: 'TRY',
                                                                }).format(parseFloat(transaction.amount))}
                                                            </div>
                                                            {transaction.exchange_rate && (
                                                                <div className="text-xs text-gray-400">
                                                                    {t('transaction.exchangeRate')}: {Number(transaction.exchange_rate).toFixed(4)}
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                />

                                                {/* Banka/Kripto Detayları */}
                                                {transaction.type === 'bank_withdrawal' ? (
                                                    <>
                                                        <DetailItem
                                                            icon={<FaCreditCard />}
                                                            label={t('transaction.bankAccount')}
                                                            value={
                                                                <div className="flex items-center space-x-2">
                                                                    <span className="font-mono text-gray-900 dark:text-gray-100">
                                                                        {transaction.bank_account}
                                                                    </span>
                                                                    {transaction.bank_account && (
                                                                        <button
                                                                            onClick={() => {
                                                                                navigator.clipboard.writeText(transaction.bank_account!);
                                                                                toast.success(t('common.copied'));
                                                                            }}
                                                                            className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                                                        >
                                                                            <FaCopy className="h-4 w-4" />
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            }
                                                        />
                                                        {transaction.bank_id && (
                                                            <DetailItem
                                                                icon={<FaCreditCard />}
                                                                label={t('transaction.bank')}
                                                                value={transaction.bank_id}
                                                            />
                                                        )}
                                                    </>
                                                ) : (
                                                    renderCryptoDetails()
                                                )}

                                                {/* Referans No */}
                                                <DetailItem
                                                    icon={<FaFileAlt />}
                                                    label={t('transaction.referenceId')}
                                                    value={transaction.reference_id}
                                                />

                                                {/* Tarih */}
                                                <DetailItem
                                                    icon={<FaCalendar />}
                                                    label={t('transaction.date')}
                                                    value={new Date(transaction.created_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                />

                                                {/* İşlem Tarihi */}
                                                {transaction.processed_at && (
                                                    <DetailItem
                                                        icon={<FaCalendar />}
                                                        label={t('transaction.processedAt')}
                                                        value={new Date(transaction.processed_at).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sağ Kolon - Ek Bilgiler */}
                                    <div className="space-y-8">
                                        {/* İşlem Geçmişi */}
                                        <motion.div variants={cardVariants} className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                <FaHistory className="mr-2 h-5 w-5 text-gray-500" />
                                                {t('transaction.history')}
                                            </h3>
                                            <div className="relative">
                                                {/* Timeline çizgisi */}
                                                <div className="absolute bottom-0 left-4 top-6 w-0.5 bg-gray-200 dark:bg-gray-600" />
                                                <div className="space-y-6">
                                                    {renderHistory()}
                                                </div>
                                            </div>
                                        </motion.div>

                                        {/* Notlar */}
                                        <motion.div variants={cardVariants} className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                <FaStickyNote className="mr-2 h-5 w-5 text-gray-500" />
                                                {t('transaction.notes')}
                                            </h3>
                                            {transaction.notes ? (
                                                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                                        {transaction.notes}
                                                    </p>
                                                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <FaCalendar className="mr-2 h-4 w-4" />
                                                        {t('transaction.lastUpdated')}:{' '}
                                                        {new Date(transaction.updated_at).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                        })}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                                                    <p className="italic text-gray-500 dark:text-gray-400">
                                                        {t('transaction.noNotes')}
                                                    </p>
                                                    <Link
                                                        href={route('admin.transactions.edit', transaction.id)}
                                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-4 inline-flex items-center text-sm"
                                                    >
                                                        <FaEdit className="mr-1 h-4 w-4" />
                                                        {t('transaction.addNote')}
                                                    </Link>
                                                </div>
                                            )}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Yardımcı Bileşen
const DetailItem = ({
    icon,
    label,
    value,
}: {
    icon: React.ReactNode;
    label: string;
    value: React.ReactNode;
}) => (
    <div className="flex items-center space-x-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 dark:bg-gray-600 dark:text-gray-400">
            {icon}
        </div>
        <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </div>
            <div className="text-gray-900 dark:text-gray-100">{value}</div>
        </div>
    </div>
);

// Status ve tip renkleri için yardımcı fonksiyonlar
const getStatusColor = (status: string) => {
    switch (status) {
        case 'completed':
            return 'bg-green-500 text-green-700 dark:text-green-300';
        case 'pending':
            return 'bg-yellow-500 text-yellow-700 dark:text-yellow-300';
        case 'cancelled':
            return 'bg-gray-500 text-gray-700 dark:text-gray-300';
        case 'rejected':
            return 'bg-red-500 text-red-700 dark:text-red-300';
        default:
            return 'bg-gray-500 text-gray-700 dark:text-gray-300';
    }
};

const getTypeColor = (type: string) => {
    switch (type) {
        case 'bank_withdrawal':
            return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
        case 'crypto_withdrawal':
            return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
        default:
            return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
    }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'completed':
            return <FaCheckCircle className="h-5 w-5 text-green-500" />;
        case 'pending':
            return <FaClock className="h-5 w-5 text-yellow-500" />;
        case 'cancelled':
            return <FaTimesCircle className="h-5 w-5 text-gray-500" />;
        case 'rejected':
            return <FaTimesCircle className="h-5 w-5 text-red-500" />;
        default:
            return <FaInfoCircle className="h-5 w-5 text-gray-500" />;
    }
};
