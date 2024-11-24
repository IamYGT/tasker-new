import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaSearch, FaFilter, FaEdit, FaEye, FaSync, FaDownload, FaChartBar, FaCheck, FaClock, FaMoneyBillWave, FaFileAlt, FaFileCsv, FaUser } from 'react-icons/fa';
import Pagination from '@/Components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { getTypeColor, getStatusColor, getStatusIcon } from '@/utils/transaction';
import { Transaction, TransactionType, TransactionStatus, PaginatedData } from '@/types';
import { Menu, Transition } from '@headlessui/react';

interface Props {
    auth: any;
    transactions: PaginatedData<Transaction>;
    filters: {
        search?: string;
        status?: TransactionStatus;
        type?: TransactionType;
    };
    statuses: TransactionStatus[];
    types: TransactionType[];
}

export default function Index({ auth, transactions, filters, statuses, types }: Props) {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        type: filters.type || '',
    });

    // useEffect ekleyelim
    useEffect(() => {
        setInitialLoad(false);
    }, []);

    // Filtreleri sıfırlama fonksiyonu
    const resetFilters = useCallback(() => {
        if (!isLoading) {
            setIsLoading(true);
            setShowFilters(false); // Filtre panelini kapat
            setData({
                search: '',
                status: '',
                type: '',
            });
            router.get(
                route('admin.transactions.index'),
                {},
                {
                    preserveState: true,
                    preserveScroll: true,
                    onFinish: () => setIsLoading(false),
                }
            );
        }
    }, [isLoading]);

    // Arama fonksiyonu - büyük/küçük harf duyarsız
    const debouncedSearch = useCallback(
        debounce((query: string) => {
            if (!initialLoad) {
                setIsLoading(true);
                router.get(
                    route('admin.transactions.index'),
                    { ...data, search: query.toLowerCase() },  // Küçük harfe çevir
                    {
                        preserveState: true,
                        preserveScroll: true,
                        onFinish: () => setIsLoading(false),
                    }
                );
            }
        }, 500),
        [data, initialLoad]
    );

    // İstatistik hesaplamaları
    const stats = {
        total: transactions.total,
        completed: transactions.data.filter(t => t.status === 'completed').length,
        pending: transactions.data.filter(t => t.status === 'pending').length,
        cancelled: transactions.data.filter(t => t.status === 'cancelled').length,
        totalAmount: transactions.data.reduce((sum, t) => sum + Number(t.amount), 0),
        avgAmount: transactions.data.length ? 
            transactions.data.reduce((sum, t) => sum + Number(t.amount), 0) / transactions.data.length : 0
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const exportData = (format: 'json' | 'csv') => {
        const data = transactions.data.map(t => ({
            reference_id: t.reference_id,
            user: t.user.name,
            email: t.user.email,
            type: t.type,
            amount: t.amount,
            status: t.status,
            bank_account: t.bank_account,
            created_at: new Date(t.created_at).toLocaleDateString('tr-TR'),
            notes: t.notes
        }));

        let content: string;
        let mimeType: string;
        let fileExtension: string;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            fileExtension = 'json';
        } else {
            // CSV başlıkları için çevirileri kullan
            const headers = [
                t('transaction.referenceId'),
                t('transaction.user'),
                t('common.email'),
                t('transaction.type'),
                t('transaction.amount'),
                t('transaction.status'),
                t('transaction.bankAccount'),
                t('transaction.date'),
                t('transaction.notes')
            ];
            const csvContent = [
                headers.join(','),
                ...data.map(item => Object.values(item).map(val => `"${val}"`).join(','))
            ].join('\n');
            
            content = csvContent;
            mimeType = 'text/csv';
            fileExtension = 'csv';
        }

        // Dosya adında da çeviriyi kullan
        const fileName = `${t('transaction.transactions')}_${new Date().toISOString().split('T')[0]}.${fileExtension}`;
        
        const blob = new Blob([content], { type: mimeType });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
    };

    return (
        <AuthenticatedLayout 
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {t('admin.transactions')}
                </h2>
            }
        >
            <Head title={t('admin.transactions')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <motion.div variants={cardVariants} className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-blue-600 dark:text-blue-400">{t('stats.totalTransactions')}</p>
                                    <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">
                                        {stats.total}
                                    </h3>
                                </div>
                                <FaChartBar className="w-8 h-8 text-blue-500/50" />
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-green-600 dark:text-green-400">{t('stats.completedTransactions')}</p>
                                    <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mt-1">
                                        {stats.completed}
                                    </h3>
                                </div>
                                <FaCheck className="w-8 h-8 text-green-500/50" />
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-yellow-600 dark:text-yellow-400">{t('stats.pendingTransactions')}</p>
                                    <h3 className="text-2xl font-bold text-yellow-700 dark:text-yellow-300 mt-1">
                                        {stats.pending}
                                    </h3>
                                </div>
                                <FaClock className="w-8 h-8 text-yellow-500/50" />
                            </div>
                        </motion.div>

                        <motion.div variants={cardVariants} className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-6 rounded-xl shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-purple-600 dark:text-purple-400">{t('stats.totalAmount')}</p>
                                    <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mt-1">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY'
                                        }).format(stats.totalAmount)}
                                    </h3>
                                </div>
                                <FaMoneyBillWave className="w-8 h-8 text-purple-500/50" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Ana İçerik */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                    >
                        {/* Üst Toolbar */}
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div className="flex-1 relative">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-gray-200 dark:border-gray-600 dark:bg-gray-700/50 focus:ring-2 focus:ring-primary-500 transition-all text-base"
                                            placeholder={t('common.searchPlaceholder')}
                                            value={data.search}
                                            onChange={e => {
                                                setData('search', e.target.value);
                                                debouncedSearch(e.target.value);
                                            }}
                                        />
                                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        {isLoading && (
                                            <FaSync className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 animate-spin w-5 h-5" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center px-4 py-2.5 rounded-xl transition-all ${
                                            showFilters 
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <FaFilter className="mr-2 w-4 h-4" />
                                        {t('common.filters')}
                                        {(data.status || data.type) && (
                                            <span className="ml-2 px-2 py-0.5 text-xs bg-primary-500 text-white rounded-full">
                                                {[data.status, data.type].filter(Boolean).length}
                                            </span>
                                        )}
                                    </button>

                                    {(data.status || data.type || data.search) && (
                                        <button
                                            onClick={resetFilters}
                                            className="px-4 py-2.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                                        >
                                            {t('common.reset')}
                                        </button>
                                    )}

                                    <Menu as="div" className="relative">
                                        <Menu.Button className="flex items-center px-4 py-2.5 bg-light-primary dark:bg-dark-primary hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 text-white rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow group">
                                            <FaDownload className="w-4 h-4 mr-2" />
                                            {t('common.export')}
                                        </Menu.Button>

                                        <Transition
                                            enter="transition duration-100 ease-out"
                                            enterFrom="transform scale-95 opacity-0"
                                            enterTo="transform scale-100 opacity-100"
                                            leave="transition duration-75 ease-out"
                                            leaveFrom="transform scale-100 opacity-100"
                                            leaveTo="transform scale-95 opacity-0"
                                        >
                                            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-gray-700 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                                <div className="p-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => exportData('json')}
                                                                className={`${
                                                                    active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                                                            >
                                                                <FaFileAlt className="w-4 h-4 mr-2" />
                                                                JSON
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => exportData('csv')}
                                                                className={`${
                                                                    active ? 'bg-gray-100 dark:bg-gray-600' : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                                                            >
                                                                <FaFileCsv className="w-4 h-4 mr-2" />
                                                                CSV
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>

                            {/* Filtreler */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('transaction.status')}
                                                </label>
                                                <select
                                                    value={data.status}
                                                    onChange={e => {
                                                        setData('status', e.target.value);
                                                        router.get(
                                                            route('admin.transactions.index'),
                                                            { ...data, status: e.target.value },
                                                            { preserveState: true }
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                >
                                                    <option value="">{t('common.all')}</option>
                                                    {statuses.map(status => (
                                                        <option key={status} value={status}>
                                                            {t(`status.${status}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    {t('transaction.type')}
                                                </label>
                                                <select
                                                    value={data.type}
                                                    onChange={e => {
                                                        setData('type', e.target.value);
                                                        router.get(
                                                            route('admin.transactions.index'),
                                                            { ...data, type: e.target.value },
                                                            { preserveState: true }
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                >
                                                    <option value="">{t('common.all')}</option>
                                                    {types.map(type => (
                                                        <option key={type} value={type}>
                                                            {t(`transaction.${type}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tablo */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3">{t('transaction.referenceId')}</th>
                                        <th className="px-4 py-3">{t('transaction.user')}</th>
                                        <th className="px-4 py-3 hidden md:table-cell">{t('transaction.type')}</th>
                                        <th className="px-4 py-3">{t('transaction.amount')}</th>
                                        <th className="px-4 py-3">{t('transaction.status')}</th>
                                        <th className="px-4 py-3 hidden lg:table-cell">{t('transaction.lastUpdate')}</th>
                                        <th className="px-4 py-3 w-20">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.data.map((transaction) => (
                                        <tr 
                                            key={transaction.id}
                                            className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <span className="text-xs">{transaction.reference_id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="hidden sm:flex w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 items-center justify-center">
                                                        <FaUser className="w-3 h-3 text-gray-500" />
                                                    </div>
                                                    <div className="min-w-0">
                                                        <div className="truncate font-medium">
                                                            {transaction.user.name}
                                                        </div>
                                                        <div className="truncate text-xs text-gray-500">
                                                            {transaction.user.email}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 hidden md:table-cell">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getTypeColor(transaction.type)}`}>
                                                    {t(`transaction.${transaction.type}`)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 font-medium">
                                                {new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                    minimumFractionDigits: 0,
                                                    maximumFractionDigits: 0
                                                }).format(transaction.amount)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${getStatusColor(transaction.status)}`}>
                                                    {getStatusIcon(transaction.status)}
                                                    {t(`status.${transaction.status}`)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 hidden lg:table-cell">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(transaction.updated_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={route('admin.transactions.show', transaction.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <FaEye className="w-4 h-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.transactions.edit', transaction.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <FaEdit className="w-4 h-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <Pagination links={transactions.links} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Global Loading Overlay */}
            {isLoading && !initialLoad && (
                <div className="fixed inset-0 bg-black/20 dark:bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg">
                        <FaSync className="w-8 h-8 text-primary-600 animate-spin" />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}