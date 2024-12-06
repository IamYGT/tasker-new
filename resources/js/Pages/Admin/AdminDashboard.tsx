import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import {
    FaExchangeAlt,
    FaMoneyBillWave,
    FaTicketAlt,
    FaUsers,
} from 'react-icons/fa';

interface RecentActivity {
    [x: string]: ReactNode;
    id: number;
    type: 'transaction' | 'ticket';
    user: string;
    amount: number | null;
    amount_usd: number | null;
    exchange_rate: number | null;
    status: string;
    created_at: string;
}
interface DashboardProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
    stats: {
        users: {
            total: number;
            activeToday: number;
            newThisWeek: number;
        };
        tickets: {
            total: number;
            open: number;
            answered: number;
            closed: number;
        };
        transactions: {
            total: number;
            pending: number;
            completed: number;
            totalAmount: number;
            totalAmount_usd: number;
            exchange_rate: number;
        };
        recentActivity: RecentActivity[];
    };
}

export default function Dashboard({ auth, stats }: DashboardProps) {
    const { t } = useTranslation();

    const handleCardClick = (route: string, params = {}) => {
        router.visit(route, { data: params });
    };

    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [showFilters, setShowFilters] = useState(false);
    const [activeFilter, setActiveFilter] = useState<string>('all');
    const [dateFilter, setDateFilter] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredActivities, setFilteredActivities] = useState<
        RecentActivity[]
    >(stats.recentActivity);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'completed':
            case 'success':
                return 'bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/30 dark:text-yellow-300';
            case 'failed':
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-300';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-800/30 dark:text-gray-300';
        }
    };

    const handleActivityClick = (activity: RecentActivity) => {
        const route = `/admin/${activity.type}s/${activity.id}`;
        router.visit(route);
    };

    const filterActivities = useCallback(() => {
        let filtered = [...stats.recentActivity];

        if (activeFilter !== 'all') {
            filtered = filtered.filter(
                (activity) => activity.type === activeFilter,
            );
        }

        if (dateFilter !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (dateFilter) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    filtered = filtered.filter(
                        (activity) =>
                            new Date(activity.created_at) >= filterDate,
                    );
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    filtered = filtered.filter(
                        (activity) =>
                            new Date(activity.created_at) >= filterDate,
                    );
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    filtered = filtered.filter(
                        (activity) =>
                            new Date(activity.created_at) >= filterDate,
                    );
                    break;
            }
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (activity) =>
                    activity.user.toLowerCase().includes(query) ||
                    activity.status.toLowerCase().includes(query),
            );
        }

        setFilteredActivities(filtered);
    }, [activeFilter, dateFilter, searchQuery, stats.recentActivity]);

    useEffect(() => {
        filterActivities();
    }, [filterActivities]);

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    roles: [{ name: auth.user.role }],
                    id: 0,
                    name: '',
                    email: '',
                },
            }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('admin.dashboard')}
                </h2>
            }
        >
            <Head title={t('admin.dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Ana İstatistikler */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {/* Kullanıcı İstatistikleri */}
                        <div
                            onClick={() => handleCardClick('/admin/users')}
                            className="group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-blue-900/30 dark:to-blue-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {t('stats.totalUsers')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-blue-700 dark:text-blue-300">
                                        {stats.users.total.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800 dark:bg-blue-800/30 dark:text-blue-300">
                                        <svg
                                            className="mr-1.5 h-3 w-3 text-blue-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M5.293 9.707l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L9 8.414V15a1 1 0 11-2 0V8.414L4.707 11.121a1 1 0 01-1.414-1.414z" />
                                        </svg>
                                        +{stats.users.newThisWeek}{' '}
                                        {t('stats.thisWeek')}
                                    </div>
                                </div>
                                <FaUsers className="h-12 w-12 text-blue-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </div>

                        {/* Destek Talepleri */}
                        <div
                            onClick={() =>
                                handleCardClick('/admin/tickets', {
                                    status: 'open',
                                })
                            }
                            className="group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-amber-900/30 dark:to-amber-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-amber-600 dark:text-amber-400">
                                        {t('stats.activeTickets')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-amber-700 dark:text-amber-300">
                                        {stats.tickets.open.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 inline-flex items-center rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-800/30 dark:text-amber-300">
                                        <svg
                                            className="mr-1.5 h-3 w-3 text-amber-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                            <path
                                                fillRule="evenodd"
                                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {stats.tickets.answered}{' '}
                                        {t('stats.answered')}
                                    </div>
                                </div>
                                <FaTicketAlt className="h-12 w-12 text-amber-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </div>

                        {/* İşlem İstatistikleri */}
                        <div
                            onClick={() =>
                                handleCardClick('/admin/transactions')
                            }
                            className="group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-green-900/30 dark:to-green-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-green-600 dark:text-green-400">
                                        {t('stats.totalTransactions')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-green-700 dark:text-green-300">
                                        {stats.transactions.total.toLocaleString()}
                                    </h3>
                                    <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-800 dark:bg-green-800/30 dark:text-green-300">
                                        <svg
                                            className="mr-1.5 h-3 w-3 text-green-500"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                        {stats.transactions.pending}{' '}
                                        {t('stats.pending')}
                                    </div>
                                </div>
                                <FaExchangeAlt className="h-12 w-12 text-green-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </div>

                        {/* Toplam İşlem Hacmi */}
                        <div
                            onClick={() =>
                                handleCardClick('/admin/transactions', {
                                    status: 'completed',
                                })
                            }
                            className="group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg dark:from-purple-900/30 dark:to-purple-800/30"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                                        {t('stats.totalVolume')}
                                    </p>
                                    <h3 className="mt-2 text-3xl font-bold text-purple-700 dark:text-purple-300">
                                        {new Intl.NumberFormat('en-US', {
                                            style: 'currency',
                                            currency: 'USD',
                                        }).format(
                                            stats.transactions.totalAmount_usd,
                                        )}
                                    </h3>
                                    <div className="text-sm text-purple-500 dark:text-purple-400">
                                        {new Intl.NumberFormat('tr-TR', {
                                            style: 'currency',
                                            currency: 'TRY',
                                        }).format(
                                            stats.transactions.totalAmount,
                                        )}
                                    </div>
                                </div>
                                <FaMoneyBillWave className="h-12 w-12 text-purple-500/50 transition-transform group-hover:scale-110" />
                            </div>
                        </div>
                    </div>

                    {/* Son Aktiviteler */}
                    <div className="mt-8 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-gray-800 sm:p-6">
                        <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                {t('stats.recentActivity')}
                            </h3>
                            <div className="flex items-center justify-between space-x-2 sm:justify-end">
                                <button
                                    onClick={() =>
                                        setViewMode(
                                            viewMode === 'list'
                                                ? 'grid'
                                                : 'list',
                                        )
                                    }
                                    className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-2 sm:py-2"
                                    title={
                                        viewMode === 'list'
                                            ? t('common.gridView')
                                            : t('common.listView')
                                    }
                                >
                                    {viewMode === 'list' ? (
                                        <>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 6h16M4 12h16M4 18h16"
                                                />
                                            </svg>
                                            <span className="ml-2 sm:hidden">
                                                {t('common.listView')}
                                            </span>
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                className="h-5 w-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 13a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                                                />
                                            </svg>
                                            <span className="ml-2 sm:hidden">
                                                {t('common.gridView')}
                                            </span>
                                        </>
                                    )}
                                </button>
                                <button
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 sm:px-2 sm:py-2"
                                    title={t('common.filters')}
                                >
                                    <svg
                                        className="h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                                        />
                                    </svg>
                                    <span className="ml-2 sm:hidden">
                                        {t('common.filters')}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Filtreler */}
                        {showFilters && (
                            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.type')}
                                        </label>
                                        <select
                                            value={activeFilter}
                                            onChange={(e) =>
                                                setActiveFilter(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        >
                                            <option value="all">
                                                {t('common.all')}
                                            </option>
                                            <option value="transaction">
                                                {t('common.transactions')}
                                            </option>
                                            <option value="ticket">
                                                {t('common.tickets')}
                                            </option>
                                            <option value="withdrawal">
                                                {t('common.withdrawals')}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.date')}
                                        </label>
                                        <select
                                            value={dateFilter}
                                            onChange={(e) =>
                                                setDateFilter(e.target.value)
                                            }
                                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                        >
                                            <option value="all">
                                                {t('common.allTime')}
                                            </option>
                                            <option value="today">
                                                {t('common.today')}
                                            </option>
                                            <option value="week">
                                                {t('common.lastWeek')}
                                            </option>
                                            <option value="month">
                                                {t('common.lastMonth')}
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('common.search')}
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={searchQuery}
                                                onChange={(e) =>
                                                    setSearchQuery(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder={t(
                                                    'common.searchPlaceholder',
                                                )}
                                                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pl-10 text-sm transition-colors focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700"
                                            />
                                            <svg
                                                className="absolute left-3 top-2.5 h-4 w-4 text-gray-400"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Aktiviteler Listesi */}
                        <div
                            className={`${viewMode === 'grid'
                                    ? 'grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'
                                    : 'space-y-4'
                                }`}
                        >
                            {filteredActivities.length > 0 ? (
                                filteredActivities.map(
                                    (activity: RecentActivity) => (
                                        <div
                                            key={`${activity.type}-${activity.id}`}
                                            className={`group cursor-pointer rounded-lg border p-4 transition-all hover:border-blue-500 hover:bg-blue-50/50 dark:border-gray-700 dark:hover:border-blue-500/50 dark:hover:bg-blue-900/20 ${viewMode === 'grid'
                                                    ? 'flex flex-col space-y-3'
                                                    : 'flex items-center justify-between'
                                                }`}
                                            onClick={() =>
                                                handleActivityClick(activity)
                                            }
                                        >
                                            <div
                                                className={`flex items-center ${viewMode === 'grid' ? 'w-full' : 'space-x-3'}`}
                                            >
                                                <div className="rounded-full bg-gray-100 p-2 transition-colors group-hover:bg-white dark:bg-gray-700 dark:group-hover:bg-gray-600">
                                                    {activity.type ===
                                                        'transaction' && (
                                                            <FaExchangeAlt className="h-5 w-5 text-green-500" />
                                                        )}
                                                    {activity.type ===
                                                        'ticket' && (
                                                            <FaTicketAlt className="h-5 w-5 text-amber-500" />
                                                        )}

                                                </div>
                                                <div
                                                    className={`${viewMode === 'grid' ? 'ml-3 flex-1' : ''}`}
                                                >
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                                        {activity.user_name}
                                                    </h4>
                                                    <div
                                                        className={`flex ${viewMode === 'grid' ? 'mt-1 flex-col space-y-2' : 'items-center space-x-2'}`}
                                                    >
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${getStatusColor(
                                                                activity.status,
                                                            )}`}
                                                        >
                                                            {activity.status}
                                                        </span>
                                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                                            {
                                                                activity.created_at
                                                            }
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            {activity.amount && (
                                                <div className="flex flex-col space-y-1">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                                        {new Intl.NumberFormat(
                                                            'en-US',
                                                            {
                                                                style: 'currency',
                                                                currency: 'USD',
                                                            },
                                                        ).format(
                                                            activity.amount_usd ??
                                                            0,
                                                        )}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Intl.NumberFormat(
                                                            'tr-TR',
                                                            {
                                                                style: 'currency',
                                                                currency: 'TRY',
                                                            },
                                                        ).format(
                                                            activity.amount,
                                                        )}
                                                    </span>
                                                    {activity.exchange_rate && (
                                                        <span className="text-xs text-gray-400">
                                                            {t(
                                                                'transaction.rate',
                                                            )}
                                                            :{' '}
                                                            {typeof activity.exchange_rate === 'number' ? activity.exchange_rate.toFixed(4) : activity.exchange_rate}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ),
                                )
                            ) : (
                                // Sonuç bulunamadı mesajı
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
                                    <svg
                                        className="mb-4 h-12 w-12 text-gray-400"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                                        />
                                    </svg>
                                    <h3 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {t('common.noResults')}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {t('common.tryDifferentFilters')}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
