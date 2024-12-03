import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Transaction, TransactionStatus } from '@/types';
import { parseAmount } from '@/utils/format';
import { getStatusColor, getTypeColor } from '@/Utils/transaction';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState } from 'react';
import {
    FaArrowLeft,
    FaCopy,
    FaCreditCard,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaFileAlt,
    FaMoneyBillWave,
    FaSave,
    FaSpinner,
    FaTimes,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Props {
    auth: {
        user: {
            email: string;
            name: string;
            id: number;
            roles: Array<{ name: string }>;
        };
    };
    transaction: Transaction;
    statuses: TransactionStatus[];
}

interface FormData {
    status: TransactionStatus;
    notes: string;
}

interface DetailItemProps {
    icon?: React.ReactNode;
    label: string;
    value: React.ReactNode;
}

export default function Edit({ auth, transaction, statuses }: Props) {
    const { t } = useTranslation();
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const { data, setData, put, processing, errors } = useForm<FormData>({
        status: transaction.status,
        notes: transaction.notes || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (needsConfirmation()) {
            setIsConfirmOpen(true);
            return;
        }
        submitForm();
    };

    const submitForm = () => {
        put(route('admin.transactions.update', transaction.id), {
            onSuccess: () => {
                toast.success(t('transaction.statusUpdated'));
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    const needsConfirmation = () => {
        return (
            data.status === 'cancelled' && transaction.status !== 'cancelled'
        );
    };

    const handleStatusChange = (value: string) => {
        setData('status', value as TransactionStatus);
    };

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    id: auth.user.id,
                    name: auth.user.name,
                    email: auth.user.email,
                    roles: auth.user.roles,
                },
            }}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="flex items-center text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        <span className="mr-2">{t('transaction.edit')}</span>
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm dark:bg-gray-700">
                            {transaction.reference_id}
                        </span>
                    </h2>
                </div>
            }
        >
            <Head
                title={`${t('transaction.edit')} - ${transaction.reference_id}`}
            />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Üst Bar - Geliştirilmiş Tasarım */}
                    <div className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-gray-800">
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
                                    {t('transaction.edit')}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {t('transaction.editDescription')}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className="rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                ID: {transaction.reference_id}
                            </span>
                        </div>
                    </div>

                    <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                        <div className="p-8">
                            {/* İşlem Detayları - Geliştirilmiş Tasarım */}
                            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                                <div className="space-y-6">
                                    <div className="mb-6 flex items-center justify-between">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {t('transaction.details')}
                                        </h3>
                                        <span
                                            className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${getTypeColor(transaction.type)}`}
                                        >
                                            {t(
                                                `transaction.${transaction.type}`,
                                            )}
                                        </span>
                                    </div>

                                    <div className="space-y-6 rounded-xl bg-gray-50 p-6 dark:bg-gray-700/30">
                                        <DetailItem
                                            label={t('transaction.user')}
                                            value={
                                                <div className="flex items-center space-x-3">
                                                    <div className="bg-primary-100 dark:bg-primary-900/50 flex h-10 w-10 items-center justify-center rounded-full">
                                                        <span className="text-primary-700 dark:text-primary-300 font-medium">
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
                                            }
                                        />
                                        <DetailItem
                                            icon={<FaMoneyBillWave />}
                                            label={t('transaction.amount')}
                                            value={
                                                <div className="space-y-1">
                                                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                        {new Intl.NumberFormat(
                                                            'en-US',
                                                            {
                                                                style: 'currency',
                                                                currency: 'USD',
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
                                                                currency: 'TRY',
                                                            },
                                                        ).format(
                                                            parseAmount(
                                                                transaction.amount,
                                                            ),
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
                                                            ).toFixed(4)}
                                                        </div>
                                                    )}
                                                </div>
                                            }
                                        />
                                        <DetailItem
                                            icon={<FaCreditCard />}
                                            label={t('transaction.bankAccount')}
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
                                        <DetailItem
                                            icon={<FaFileAlt />}
                                            label={t('transaction.referenceId')}
                                            value={
                                                <div className="flex items-center space-x-2">
                                                    <span className="font-mono text-gray-900 dark:text-gray-100">
                                                        {
                                                            transaction.reference_id
                                                        }
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(
                                                                transaction.reference_id,
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
                                                </div>
                                            }
                                        />
                                        <DetailItem
                                            icon={<FaExchangeAlt />}
                                            label={t('transaction.type')}
                                            value={
                                                <span
                                                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${getTypeColor(transaction.type)}`}
                                                >
                                                    {t(
                                                        `transaction.${transaction.type}`,
                                                    )}
                                                </span>
                                            }
                                        />
                                        <DetailItem
                                            label={t(
                                                'transaction.currentStatus',
                                            )}
                                            value={
                                                <span
                                                    className={`inline-flex items-center rounded-lg px-3 py-1.5 text-sm font-medium ${getStatusColor(transaction.status)}`}
                                                >
                                                    {t(
                                                        `status.${transaction.status}`,
                                                    )}
                                                </span>
                                            }
                                        />
                                        <DetailItem
                                            label={t('transaction.date')}
                                            value={
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <span className="rounded-lg bg-gray-100 px-3 py-1.5 text-sm dark:bg-gray-600">
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
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Durum Güncelleme Formu - Geliştirilmiş Tasarım */}
                                <form
                                    onSubmit={handleSubmit}
                                    className="rounded-xl bg-gray-50 p-8 dark:bg-gray-700/30"
                                >
                                    <h3 className="mb-6 text-xl font-bold text-gray-900 dark:text-gray-100">
                                        {t('transaction.updateStatus')}
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                {t('transaction.status')}
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={(e) =>
                                                    handleStatusChange(
                                                        e.target.value,
                                                    )
                                                }
                                                className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                                            >
                                                {statuses.map((status) => (
                                                    <option
                                                        key={status}
                                                        value={status}
                                                    >
                                                        {t(`status.${status}`)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.status && (
                                                <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                    {errors.status}
                                                </p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('transaction.notes')}
                                                </label>
                                                <textarea
                                                    value={data.notes}
                                                    onChange={(e) =>
                                                        setData(
                                                            'notes',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={4}
                                                    className="focus:border-primary-500 focus:ring-primary-500 w-full rounded-lg border-gray-300 shadow-sm dark:border-gray-600 dark:bg-gray-700/50"
                                                    placeholder={t(
                                                        'transaction.notesPlaceholder',
                                                    )}
                                                />
                                                {errors.notes && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">
                                                        {errors.notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 pt-4">
                                            <Link
                                                href={route(
                                                    'admin.transactions.show',
                                                    transaction.id,
                                                )}
                                                className="group inline-flex items-center rounded-lg border border-light-secondary/20 bg-light-surface px-5 py-2.5 font-medium text-light-secondary shadow-sm transition-all duration-200 hover:bg-light-background hover:shadow dark:border-dark-secondary/20 dark:bg-dark-surface dark:text-dark-secondary dark:hover:bg-dark-background"
                                            >
                                                <FaTimes className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                                {t('common.cancel')}
                                            </Link>

                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="group inline-flex items-center rounded-lg bg-light-primary px-5 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:bg-light-primary/90 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/90"
                                            >
                                                {processing ? (
                                                    <FaSpinner className="mr-2 h-4 w-4 animate-spin" />
                                                ) : (
                                                    <FaSave className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                                )}
                                                {t('common.save')}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Geliştirilmiş Onay Modal */}
            {isConfirmOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="mx-4 w-full max-w-md rounded-xl bg-white p-8 shadow-xl dark:bg-gray-800">
                        <h3 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">
                            {t('transaction.confirmCancel')}
                        </h3>
                        <p className="mb-8 text-gray-600 dark:text-gray-400">
                            {t('transaction.confirmCancelMessage')}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="group inline-flex items-center rounded-lg border border-light-secondary/20 bg-light-surface px-5 py-2.5 font-medium text-light-secondary shadow-sm transition-all duration-200 hover:bg-light-background hover:shadow dark:border-dark-secondary/20 dark:bg-dark-surface dark:text-dark-secondary dark:hover:bg-dark-background"
                            >
                                <FaTimes className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                {t('common.no')}
                            </button>

                            <button
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                    submitForm();
                                }}
                                className="group inline-flex items-center rounded-lg bg-red-500 px-5 py-2.5 font-medium text-white shadow-md transition-all duration-200 hover:bg-red-600 hover:shadow-lg dark:bg-red-600 dark:hover:bg-red-700"
                            >
                                <FaExclamationTriangle className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                                {t('common.yes')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}

// Yardımcı Bileşen
const DetailItem = ({ icon, label, value }: DetailItemProps) => (
    <div>
        <dt className="flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
            {icon && (
                <span className="mr-2 flex h-5 w-5 items-center justify-center">
                    {icon}
                </span>
            )}
            {label}
        </dt>
        <dd className="mt-1 text-sm">{value}</dd>
    </div>
);
