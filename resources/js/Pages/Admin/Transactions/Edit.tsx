import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { toast } from 'react-toastify';
import { Transaction, TransactionStatus } from '@/types';
import { FaArrowLeft, FaSave, FaTimes, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';
import { getStatusColor, getTypeColor } from '@/utils/transaction';

interface Props {
    auth: any;
    transaction: Transaction;
    statuses: TransactionStatus[];
}

interface FormData {
    status: TransactionStatus;
    notes: string;
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
        return data.status === 'cancelled' && transaction.status !== 'cancelled';
    };

    const handleStatusChange = (value: string) => {
        setData('status', value as TransactionStatus);
    };

    return (
        <AuthenticatedLayout 
            auth={auth}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight flex items-center">
                        <span className="mr-2">{t('transaction.edit')}</span>
                        <span className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-full">
                            {transaction.reference_id}
                        </span>
                    </h2>
                </div>
            }
        >
            <Head title={`${t('transaction.edit')} - ${transaction.reference_id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Üst Bar - Geliştirilmiş Tasarım */}
                    <div className="mb-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <Link
                                href={route('admin.transactions.index')}
                                className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:shadow-md"
                            >
                                <FaArrowLeft className="w-4 h-4 mr-2" />
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
                            <span className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                                ID: {transaction.reference_id}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700">
                        <div className="p-8">
                            {/* İşlem Detayları - Geliştirilmiş Tasarım */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                                            {t('transaction.details')}
                                        </h3>
                                        <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${getTypeColor(transaction.type)}`}>
                                            {t(`transaction.${transaction.type}`)}
                                        </span>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 space-y-6">
                                        <DetailItem
                                            label={t('transaction.user')}
                                            value={
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-700 dark:text-primary-300 font-medium">
                                                            {transaction.user.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <div className="text-gray-900 dark:text-gray-100 font-medium">
                                                            {transaction.user.name}
                                                        </div>
                                                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                                                            {transaction.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        />
                                        <DetailItem
                                            label={t('transaction.amount')}
                                            value={
                                                <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                    {new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY'
                                                    }).format(transaction.amount)}
                                                </span>
                                            }
                                        />
                                        <DetailItem
                                            label={t('transaction.currentStatus')}
                                            value={
                                                <span className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${getStatusColor(transaction.status)}`}>
                                                    {t(`status.${transaction.status}`)}
                                                </span>
                                            }
                                        />
                                        <DetailItem
                                            label={t('transaction.date')}
                                            value={
                                                <div className="flex items-center text-gray-600 dark:text-gray-300">
                                                    <span className="bg-gray-100 dark:bg-gray-600 px-3 py-1.5 rounded-lg text-sm">
                                                        {new Date(transaction.created_at).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Durum Güncelleme Formu - Geliştirilmiş Tasarım */}
                                <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-700/30 p-8 rounded-xl">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                                        {t('transaction.updateStatus')}
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                {t('transaction.status')}
                                            </label>
                                            <select
                                                value={data.status}
                                                onChange={e => handleStatusChange(e.target.value)}
                                                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                                            >
                                                {statuses.map(status => (
                                                    <option key={status} value={status}>
                                                        {t(`status.${status}`)}
                                                    </option>
                                                ))}
                                            </select>
                                            {errors.status && (
                                                <p className="mt-2 text-sm text-red-600">{errors.status}</p>
                                            )}
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                    {t('transaction.notes')}
                                                </label>
                                                <textarea
                                                    value={data.notes}
                                                    onChange={e => setData('notes', e.target.value)}
                                                    rows={4}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700/50 focus:border-primary-500 focus:ring-primary-500 shadow-sm"
                                                    placeholder={t('transaction.notesPlaceholder')}
                                                />
                                                {errors.notes && (
                                                    <p className="mt-2 text-sm text-red-600 dark:text-red-400">{errors.notes}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 pt-4">
                                            <Link
                                                href={route('admin.transactions.show', transaction.id)}
                                                className="inline-flex items-center px-5 py-2.5 bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary border border-light-secondary/20 dark:border-dark-secondary/20 hover:bg-light-background dark:hover:bg-dark-background rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow group"
                                            >
                                                <FaTimes className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                                                {t('common.cancel')}
                                            </Link>
                                            
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-5 py-2.5 bg-light-primary dark:bg-dark-primary hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 text-white rounded-lg transition-all duration-200 font-medium disabled:opacity-50 shadow-md hover:shadow-lg disabled:cursor-not-allowed group"
                                            >
                                                {processing ? (
                                                    <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                                                ) : (
                                                    <FaSave className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
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
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl max-w-md w-full mx-4 shadow-xl">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                            {t('transaction.confirmCancel')}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-8">
                            {t('transaction.confirmCancelMessage')}
                        </p>
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => setIsConfirmOpen(false)}
                                className="inline-flex items-center px-5 py-2.5 bg-light-surface dark:bg-dark-surface text-light-secondary dark:text-dark-secondary border border-light-secondary/20 dark:border-dark-secondary/20 hover:bg-light-background dark:hover:bg-dark-background rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow group"
                            >
                                <FaTimes className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                                {t('common.no')}
                            </button>
                            
                            <button
                                onClick={() => {
                                    setIsConfirmOpen(false);
                                    submitForm();
                                }}
                                className="inline-flex items-center px-5 py-2.5 bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg group"
                            >
                                <FaExclamationTriangle className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
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
const DetailItem = ({ label, value }: { label: string; value: React.ReactNode }) => (
    <div>
        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {label}
        </dt>
        <dd className="mt-1 text-sm">
            {value}
        </dd>
    </div>
); 
