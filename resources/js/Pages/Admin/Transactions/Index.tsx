import Pagination from '@/Components/Pagination';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FaChartBar,
    FaCheck,
    FaClock,
    FaDownload,
    FaEdit,
    FaEye,
    FaFileAlt,
    FaFileCsv,
    FaFilter,
    FaMoneyBillWave,
    FaSearch,
    FaSync,
    FaUser,
    FaCheckCircle,
    FaTimesCircle,
    FaInfoCircle,
    FaBitcoin,
    FaUniversity,
} from 'react-icons/fa';
import { Menu, Transition } from '@headlessui/react';

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
}

interface TransactionStats {
    total_usd: number;
    total_try: number;
    average_rate: number | null;
    counts: {
        total: number;
        completed: number;
        pending: number;
        cancelled: number;
        rejected: number;
    };
    today: {
        total_usd: number;
        total_try: number;
        count: number;
    };
    this_month: {
        total_usd: number;
        total_try: number;
        count: number;
    };
}

interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    meta: {
        current_page: number;
        from: number;
        last_page: number;
        path: string;
        per_page: number;
        to: number;
        total: number;
    };
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{ name: string }>;
        };
    };
    transactions: PaginatedData<Transaction>;
    filters: {
        search?: string;
        status?: Transaction['status'];
        type?: Transaction['type'];
    };
    statuses: Transaction['status'][];
    types: Transaction['type'][];
    stats: TransactionStats;
}

export default function Index({
    auth,
    transactions,
    filters,
    statuses,
    types,
    stats,
}: Props) {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);

    const { data, setData } = useForm({
        search: filters.search || '',
        status: filters.status || '',
        type: filters.type || '',
    });

    useEffect(() => {
        setInitialLoad(false);
    }, []);

    // Filtreleri sıfırlama fonksiyonu
    const resetFilters = useCallback(() => {
        if (!isLoading) {
            setIsLoading(true);
            setShowFilters(false);
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
                },
            );
        }
    }, [isLoading, setData]);

    // Arama fonksiyonu
    const debouncedSearch = useMemo(
        () =>
            debounce((query: string) => {
                if (!initialLoad) {
                    setIsLoading(true);
                    router.get(
                        route('admin.transactions.index'),
                        { ...data, search: query.toLowerCase() },
                        {
                            preserveState: true,
                            preserveScroll: true,
                            onFinish: () => setIsLoading(false),
                        },
                    );
                }
            }, 500),
        [data, initialLoad],
    );

    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

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

    // Dışa aktarma fonksiyonu
    const exportData = (format: 'json' | 'csv') => {
        const data = transactions.data.map((t) => ({
            reference_id: t.reference_id,
            user: t.user.name,
            email: t.user.email,
            type: t.type,
            amount: t.amount,
            amount_usd: t.amount_usd,
            exchange_rate: t.exchange_rate,
            status: t.status,
            bank_account: t.bank_account,
            bank_id: t.bank_id,
            crypto_address: t.crypto_address,
            crypto_network: t.crypto_network,
            crypto_fee: t.crypto_fee,
            crypto_txid: t.crypto_txid,
            processed_at: t.processed_at ? new Date(t.processed_at).toLocaleDateString('tr-TR') : '',
            created_at: new Date(t.created_at).toLocaleDateString('tr-TR'),
            updated_at: new Date(t.updated_at).toLocaleDateString('tr-TR'),
            notes: t.notes,
        }));

        let content: string;
        let mimeType: string;
        let fileExtension: string;

        if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            mimeType = 'application/json';
            fileExtension = 'json';
        } else {
            const headers = [
                t('transaction.referenceId'),
                t('transaction.user'),
                t('common.email'),
                t('transaction.type'),
                t('transaction.amount'),
                t('transaction.amountUsd'),
                t('transaction.exchangeRate'),
                t('transaction.status'),
                t('transaction.bankAccount'),
                t('transaction.bank'),
                t('transaction.cryptoAddress'),
                t('transaction.cryptoNetwork'),
                t('transaction.cryptoFee'),
                t('transaction.cryptoTxid'),
                t('transaction.processedAt'),
                t('transaction.createdAt'),
                t('transaction.updatedAt'),
                t('transaction.notes'),
            ];
            const csvContent = [
                headers.join(','),
                ...data.map((item) =>
                    Object.values(item)
                        .map((val) => `"${val}"`)
                        .join(','),
                ),
            ].join('\n');

            content = csvContent;
            mimeType = 'text/csv';
            fileExtension = 'csv';
        }

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

    // Status ve tip renkleri için yardımcı fonksiyonlar
    const getStatusColor = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300';
            case 'cancelled':
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
            case 'rejected':
                return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getTypeColor = (type: Transaction['type']) => {
        switch (type) {
            case 'bank_withdrawal':
                return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300';
            case 'crypto_withdrawal':
                return 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-300';
            default:
                return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-300';
        }
    };

    const getStatusIcon = (status: Transaction['status']) => {
        switch (status) {
            case 'completed':
                return <FaCheckCircle className="h-4 w-4 text-green-500" />;
            case 'pending':
                return <FaClock className="h-4 w-4 text-yellow-500" />;
            case 'cancelled':
                return <FaTimesCircle className="h-4 w-4 text-gray-500" />;
            case 'rejected':
                return <FaTimesCircle className="h-4 w-4 text-red-500" />;
            default:
                return <FaInfoCircle className="h-4 w-4 text-gray-500" />;
        }
    };

    const getTypeIcon = (type: Transaction['type']) => {
        switch (type) {
            case 'bank_withdrawal':
                return <FaUniversity className="h-4 w-4" />;
            case 'crypto_withdrawal':
                return <FaBitcoin className="h-4 w-4" />;
            default:
                return <FaMoneyBillWave className="h-4 w-4" />;
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('admin.transactions')}
                </h2>
            }
        >
            <Head title={t('admin.transactions')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4"
                    >
                        {/* Toplam İşlemler */}
                        <motion.div
                            variants={cardVariants}
                            className="group overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-blue-900/30 dark:to-blue-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {t('stats.totalTransactions')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
                                        {stats.counts.total.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 text-xs text-blue-500 dark:text-blue-400">
                                        {t('stats.todayCount', { count: stats.today.count })}
                                    </div>
                                </div>
                                <FaChartBar className="h-12 w-12 text-blue-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </motion.div>

                        {/* Tamamlanan İşlemler */}
                        <motion.div
                            variants={cardVariants}
                            className="group overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-green-900/30 dark:to-green-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                        {t('stats.completedTransactions')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">
                                        {stats.counts.completed.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 text-xs text-green-500 dark:text-green-400">
                                        {((stats.counts.completed / stats.counts.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <FaCheck className="h-12 w-12 text-green-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </motion.div>

                        {/* Bekleyen İşlemler */}
                        <motion.div
                            variants={cardVariants}
                            className="group overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-amber-900/30 dark:to-amber-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                        {t('stats.pendingTransactions')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">
                                        {stats.counts.pending.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 text-xs text-amber-500 dark:text-amber-400">
                                        {((stats.counts.pending / stats.counts.total) * 100).toFixed(1)}%
                                    </div>
                                </div>
                                <FaClock className="h-12 w-12 text-amber-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </motion.div>

                        {/* Toplam Hacim */}
                        <motion.div
                            variants={cardVariants}
                            className="group overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-purple-900/30 dark:to-purple-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        {t('stats.totalVolume')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                            maximumFractionDigits: 0,
                                        }).format(stats.total_usd)}
                                    </h3>
                                    <div className="mt-2 text-xs text-purple-500 dark:text-purple-400">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                            maximumFractionDigits: 0,
                                        }).format(stats.total_try)}
                                    </div>
                                </div>
                                <FaMoneyBillWave className="h-12 w-12 text-purple-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Ana İçerik */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                    >
                        {/* Üst Toolbar */}
                        <div className="border-b border-gray-200 p-6 dark:border-gray-700">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="relative flex-1">
                                    <div className="relative">
                                        <input
                                            type="text"
                                            className="focus:ring-primary-500 w-full rounded-xl border-gray-200 py-3 pl-12 pr-4 text-base transition-all focus:ring-2 dark:border-gray-600 dark:bg-gray-700/50"
                                            placeholder={t('common.searchPlaceholder')}
                                            value={data.search}
                                            onChange={(e) => {
                                                setData('search', e.target.value);
                                                debouncedSearch(e.target.value);
                                            }}
                                        />
                                        <FaSearch className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                        {isLoading && (
                                            <FaSync className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 animate-spin text-gray-400" />
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`flex items-center rounded-xl px-4 py-2.5 transition-all ${
                                            showFilters
                                                ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                                                : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600'
                                        }`}
                                    >
                                        <FaFilter className="mr-2 h-4 w-4" />
                                        {t('common.filters')}
                                        {(data.status || data.type) && (
                                            <span className="bg-primary-500 ml-2 rounded-full px-2 py-0.5 text-xs text-white">
                                                {[data.status, data.type].filter(Boolean).length}
                                            </span>
                                        )}
                                    </button>

                                    {(data.status || data.type || data.search) && (
                                        <button
                                            onClick={resetFilters}
                                            className="rounded-xl px-4 py-2.5 text-gray-600 transition-all hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                        >
                                            {t('common.reset')}
                                        </button>
                                    )}

                                    <Menu as="div" className="relative">
                                        <Menu.Button className="group flex items-center rounded-xl bg-primary-600 px-4 py-2.5 font-medium text-white shadow-sm transition-all duration-200 hover:bg-primary-700 hover:shadow dark:bg-primary-700 dark:hover:bg-primary-600">
                                            <FaDownload className="mr-2 h-4 w-4" />
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
                                            <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                                                <div className="p-1">
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => exportData('json')}
                                                                className={`${
                                                                    active
                                                                        ? 'bg-gray-100 dark:bg-gray-600'
                                                                        : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                                                            >
                                                                <FaFileAlt className="mr-2 h-4 w-4" />
                                                                JSON
                                                            </button>
                                                        )}
                                                    </Menu.Item>
                                                    <Menu.Item>
                                                        {({ active }) => (
                                                            <button
                                                                onClick={() => exportData('csv')}
                                                                className={`${
                                                                    active
                                                                        ? 'bg-gray-100 dark:bg-gray-600'
                                                                        : ''
                                                                } group flex w-full items-center rounded-md px-2 py-2 text-sm text-gray-900 dark:text-gray-100`}
                                                            >
                                                                <FaFileCsv className="mr-2 h-4 w-4" />
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
                                        <div className="mt-4 grid grid-cols-1 gap-4 rounded-xl bg-gray-50 p-4 dark:bg-gray-700/30 md:grid-cols-2">
                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('transaction.status')}
                                                </label>
                                                <select
                                                    value={data.status}
                                                    onChange={(e) => {
                                                        setData('status', e.target.value);
                                                        router.get(
                                                            route('admin.transactions.index'),
                                                            {
                                                                ...data,
                                                                status: e.target.value,
                                                            },
                                                            {
                                                                preserveState: true,
                                                            },
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                >
                                                    <option value="">{t('common.all')}</option>
                                                    {statuses.map((status) => (
                                                        <option key={status} value={status}>
                                                            {t(`status.${status}`)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t('transaction.type')}
                                                </label>
                                                <select
                                                    value={data.type}
                                                    onChange={(e) => {
                                                        setData('type', e.target.value);
                                                        router.get(
                                                            route('admin.transactions.index'),
                                                            {
                                                                ...data,
                                                                type: e.target.value,
                                                            },
                                                            {
                                                                preserveState: true,
                                                            },
                                                        );
                                                    }}
                                                    className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                >
                                                    <option value="">{t('common.all')}</option>
                                                    {types.map((type) => (
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
                                <thead className="bg-gray-50 text-xs uppercase dark:bg-gray-700/50">
                                    <tr>
                                        <th className="px-4 py-3">{t('transaction.referenceId')}</th>
                                        <th className="px-4 py-3">{t('transaction.user')}</th>
                                        <th className="hidden px-4 py-3 md:table-cell">{t('transaction.type')}</th>
                                        <th className="px-4 py-3">{t('transaction.amount')}</th>
                                        <th className="px-4 py-3">{t('transaction.status')}</th>
                                        <th className="hidden px-4 py-3 lg:table-cell">{t('transaction.lastUpdate')}</th>
                                        <th className="w-20 px-4 py-3">{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {transactions.data.map((transaction) => (
                                        <tr
                                            key={transaction.id}
                                            className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700/50"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                <span className="text-xs">{transaction.reference_id}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="hidden h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 sm:flex">
                                                        <FaUser className="h-3 w-3 text-gray-500" />
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
                                            <td className="hidden px-4 py-3 md:table-cell">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${getTypeColor(
                                                        transaction.type,
                                                    )}`}
                                                >
                                                    {getTypeIcon(transaction.type)}
                                                    <span className="ml-1">{t(`transaction.${transaction.type}`)}</span>
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex flex-col space-y-1">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {new Intl.NumberFormat('en-US', {
                                                            style: 'currency',
                                                            currency: 'USD',
                                                        }).format(parseFloat(transaction.amount_usd))}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Intl.NumberFormat('tr-TR', {
                                                            style: 'currency',
                                                            currency: 'TRY',
                                                        }).format(parseFloat(transaction.amount))}
                                                    </span>
                                                    <span className="text-xs text-gray-400">
                                                        {t('transaction.rate')}:{' '}
                                                        {transaction.exchange_rate
                                                            ? Number(transaction.exchange_rate).toFixed(4)
                                                            : '-'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex items-center gap-1 rounded px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                                        transaction.status,
                                                    )}`}
                                                >
                                                    {getStatusIcon(transaction.status)}
                                                    <span className="ml-1">{t(`status.${transaction.status}`)}</span>
                                                </span>
                                            </td>
                                            <td className="hidden px-4 py-3 lg:table-cell">
                                                <span className="text-xs text-gray-500">
                                                    {new Date(transaction.updated_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex justify-end gap-1">
                                                    <Link
                                                        href={route('admin.transactions.show', transaction.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <FaEye className="h-4 w-4" />
                                                    </Link>
                                                    <Link
                                                        href={route('admin.transactions.edit', transaction.id)}
                                                        className="p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="border-t border-gray-200 p-4 dark:border-gray-700">
                            <Pagination links={transactions.links} />
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Global Loading Overlay */}
            {isLoading && !initialLoad && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm dark:bg-black/40">
                    <div className="rounded-xl bg-white p-4 shadow-lg dark:bg-gray-800">
                        <FaSync className="text-primary-600 h-8 w-8 animate-spin" />
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
