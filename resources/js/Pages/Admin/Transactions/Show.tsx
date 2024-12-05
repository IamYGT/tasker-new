import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transaction } from '@/types';
import { parseAmount } from '@/utils/format';
import {
    getStatusColor,
    getStatusIcon,
    getTypeColor,
} from '@/Utils/transaction';
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
    FaUserEdit,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface HistoryItem {
    type: 'status_change' | 'notes_update' | 'info';
    messageKey: string;
    params?: Record<string, string>;
    date: string;
    user?: string;
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
    transaction: Transaction & {
        history?: HistoryItem[];
    };
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

    const renderHistoryMessage = (item: HistoryItem) => {
        let message = t(item.messageKey);

        if (item.params) {
            Object.entries(item.params).forEach(([key, value]) => {
                message = message.replace(`:${key}`, value);
            });
        }

        return message;
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
            <Head
                title={`${t('transaction.details')} - ${transaction.reference_id}`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6"
                    >
                        {/* Üst Bar */}
                        <motion.div
                            variants={cardVariants}
                            className="rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800"
                        >
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
                                    href={route(
                                        'admin.transactions.edit',
                                        transaction.id,
                                    )}
                                    className="group inline-flex items-center rounded-lg bg-light-primary px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-light-primary/90 hover:shadow-md dark:bg-dark-primary dark:hover:bg-dark-primary/90"
                                >
                                    <FaEdit className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                    {t('common.edit')}
                                </Link>
                            </div>
                        </motion.div>

                        {/* Ana İçerik */}
                        <motion.div
                            variants={cardVariants}
                            className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                        >
                            {/* Durum Banner */}
                            <div
                                className={`px-8 py-4 ${getStatusColor(transaction.status)} border-b border-gray-100 bg-opacity-10 dark:border-gray-700 dark:bg-opacity-20`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(transaction.status)}
                                        <span className="font-medium">
                                            {t(`status.${transaction.status}`)}
                                        </span>
                                    </div>
                                    <span
                                        className={`rounded-lg px-4 py-1.5 text-sm font-medium ${getTypeColor(transaction.type)}`}
                                    >
                                        {t(`transaction.${transaction.type}`)}
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
                                                            {transaction.user.name
                                                                .charAt(0)
                                                                .toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900 dark:text-gray-100">
                                                            {
                                                                transaction.user
                                                                    .name
                                                            }
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                                            {
                                                                transaction.user
                                                                    .email
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ödeme Detayları */}
                                        <div className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                            <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                <FaMoneyBillWave className="mr-2 h-5 w-5 text-gray-500" />
                                                {t(
                                                    'transaction.paymentDetails',
                                                )}
                                            </h3>
                                            <div className="space-y-4">
                                                {/* Tutar Bilgisi */}
                                                <DetailItem
                                                    icon={<FaMoneyBillWave />}
                                                    label={t(
                                                        'transaction.amount',
                                                    )}
                                                    value={
                                                        <div className="space-y-1">
                                                            <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                {new Intl.NumberFormat(
                                                                    'en-US',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'USD',
                                                                    },
                                                                ).format(
                                                                    parseAmount(
                                                                        transaction.amount_usd,
                                                                    ),
                                                                )}
                                                            </span>
                                                            <div className="text-sm text-gray-500">
                                                                {new Intl.NumberFormat(
                                                                    'tr-TR',
                                                                    {
                                                                        style: 'currency',
                                                                        currency:
                                                                            'TRY',
                                                                    },
                                                                ).format(
                                                                    typeof transaction.amount ===
                                                                        'string'
                                                                        ? parseFloat(
                                                                              transaction.amount,
                                                                          )
                                                                        : transaction.amount,
                                                                )}
                                                            </div>
                                                            {transaction.exchange_rate && (
                                                                <div className="text-xs text-gray-400">
                                                                    {t(
                                                                        'transaction.exchangeRate',
                                                                    )}
                                                                    :{' '}
                                                                    {Number(
                                                                        transaction.exchange_rate,
                                                                    ).toFixed(
                                                                        4,
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    }
                                                />

                                                {/* Banka Hesap Bilgisi */}
                                                <DetailItem
                                                    icon={<FaCreditCard />}
                                                    label={t(
                                                        'transaction.bankAccount',
                                                    )}
                                                    value={
                                                        <div className="flex items-center space-x-2">
                                                            <span className="font-mono text-gray-900 dark:text-gray-100">
                                                                {
                                                                    transaction.bank_account
                                                                }
                                                            </span>
                                                            {transaction.bank_account && (
                                                                <button
                                                                    onClick={() => {
                                                                        navigator.clipboard.writeText(
                                                                            transaction.bank_account!,
                                                                        );
                                                                        toast.success(
                                                                            t(
                                                                                'common.copied',
                                                                            ),
                                                                        );
                                                                    }}
                                                                    className="p-1 text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-gray-300"
                                                                >
                                                                    <FaCopy className="h-4 w-4" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    }
                                                />

                                                {/* Referans No */}
                                                <DetailItem
                                                    icon={<FaFileAlt />}
                                                    label={t(
                                                        'transaction.referenceId',
                                                    )}
                                                    value={
                                                        transaction.reference_id
                                                    }
                                                />

                                                {/* Tarih */}
                                                <DetailItem
                                                    icon={<FaCalendar />}
                                                    label={t(
                                                        'transaction.date',
                                                    )}
                                                    value={new Date(
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
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sağ Kolon - Ek Bilgiler */}
                                    <div className="space-y-8">
                                        {/* İşlem Geçmişi */}
                                        {transaction.history &&
                                            transaction.history.length > 0 && (
                                                <motion.div
                                                    variants={cardVariants}
                                                    className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30"
                                                >
                                                    <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                        <FaHistory className="mr-2 h-5 w-5 text-gray-500" />
                                                        {t(
                                                            'transaction.history',
                                                        )}
                                                    </h3>
                                                    <div className="relative">
                                                        {/* Timeline çizgisi */}
                                                        <div className="absolute bottom-0 left-4 top-6 w-0.5 bg-gray-200 dark:bg-gray-600" />

                                                        <div className="space-y-6">
                                                            {transaction.history.map(
                                                                (
                                                                    item: HistoryItem,
                                                                    index: number,
                                                                ) => (
                                                                    <div
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="relative flex items-start pl-8"
                                                                    >
                                                                        {/* Timeline noktası */}
                                                                        <div
                                                                            className={`absolute left-0 flex h-8 w-8 items-center justify-center rounded-full ${
                                                                                item.type ===
                                                                                'status_change'
                                                                                    ? 'bg-blue-100 dark:bg-blue-900/20'
                                                                                    : item.type ===
                                                                                        'notes_update'
                                                                                      ? 'bg-purple-100 dark:bg-purple-900/20'
                                                                                      : 'bg-gray-100 dark:bg-gray-700/50'
                                                                            }`}
                                                                        >
                                                                            {getHistoryIcon(
                                                                                item.type,
                                                                            )}
                                                                        </div>

                                                                        {/* İçerik */}
                                                                        <div className="ml-4 flex-1 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                                                                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                                                                {renderHistoryMessage(
                                                                                    item,
                                                                                )}
                                                                            </p>
                                                                            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                                                <span>
                                                                                    {new Date(
                                                                                        item.date,
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
                                                                                </span>
                                                                                {item.user && (
                                                                                    <>
                                                                                        <span>
                                                                                            •
                                                                                        </span>
                                                                                        <span className="flex items-center gap-1">
                                                                                            <FaUserEdit className="h-3 w-3" />
                                                                                            {
                                                                                                item.user
                                                                                            }
                                                                                        </span>
                                                                                    </>
                                                                                )}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ),
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}

                                        {/* Notlar */}
                                        {transaction.notes ? (
                                            <motion.div
                                                variants={cardVariants}
                                                className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30"
                                            >
                                                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    <FaStickyNote className="mr-2 h-5 w-5 text-gray-500" />
                                                    {t('transaction.notes')}
                                                </h3>
                                                <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                                                    <p className="whitespace-pre-wrap text-gray-600 dark:text-gray-300">
                                                        {transaction.notes}
                                                    </p>
                                                    <div className="mt-4 flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                        <FaCalendar className="mr-2 h-4 w-4" />
                                                        {t(
                                                            'transaction.lastUpdated',
                                                        )}
                                                        :{' '}
                                                        {new Date(
                                                            transaction.updated_at,
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
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                variants={cardVariants}
                                                className="rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30"
                                            >
                                                <h3 className="mb-4 flex items-center text-lg font-semibold text-gray-900 dark:text-gray-100">
                                                    <FaStickyNote className="mr-2 h-5 w-5 text-gray-500" />
                                                    {t('transaction.notes')}
                                                </h3>
                                                <div className="rounded-lg bg-white p-4 text-center shadow-sm dark:bg-gray-800">
                                                    <p className="italic text-gray-500 dark:text-gray-400">
                                                        {t(
                                                            'transaction.noNotes',
                                                        )}
                                                    </p>
                                                    <Link
                                                        href={route(
                                                            'admin.transactions.edit',
                                                            transaction.id,
                                                        )}
                                                        className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 mt-4 inline-flex items-center text-sm"
                                                    >
                                                        <FaEdit className="mr-1 h-4 w-4" />
                                                        {t(
                                                            'transaction.addNote',
                                                        )}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
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

const getHistoryIcon = (type: string) => {
    switch (type) {
        case 'status_change':
            return (
                <FaExchangeAlt className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            );
        case 'notes_update':
            return (
                <FaStickyNote className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            );
        default:
            return (
                <FaHistory className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            );
    }
};
