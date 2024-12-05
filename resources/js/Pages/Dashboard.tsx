import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowTrendingUpIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
} from '@heroicons/react/24/outline';
import { Head, Link, router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import 'react-circular-progressbar/dist/styles.css';
import { FaChartPie, FaExchangeAlt, FaUserPlus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import {
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

interface DashboardStats {
    transactions: {
        total: number;
        pending: number;
        completed: number;
        totalAmount: number;
        totalAmount_usd: number;
        exchange_rate: number;
    };
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
    recentActivity: Array<{
        id: number;
        type: 'transaction' | 'ticket' | 'withdrawal';
        user: string;
        amount?: number;
        amount_usd?: number;
        status: string;
        created_at: string;
    }>;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{ name: string }>;
        };
    };
    stats: DashboardStats;
    showWelcomeToast?: boolean;
}

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ComponentType<{ className?: string }>;
    change?: string;
    color: string;
}

interface SummaryCardProps {
    title: string;
    value: string | number;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

interface ChartDataPoint {
    name: string;
    value: number;
}

interface QuickActionButtonProps {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
    color: string;
}

const StatCard = ({
    title,
    value,
    icon: Icon,
    change,
    color,
}: StatCardProps) => (
    <motion.div
        whileHover={{ scale: 1.02 }}
        className={`rounded-xl bg-gradient-to-br ${color} p-6 shadow-lg transition-all duration-300`}
    >
        <div className="flex items-center justify-between">
            <div>
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    {title}
                </h3>
                <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                    {value}
                </p>
                {change && (
                    <p
                        className={`mt-1 text-sm ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                    >
                        {change}
                    </p>
                )}
            </div>
            <Icon className="h-12 w-12 text-gray-400" />
        </div>
    </motion.div>
);

const ActivityItem = ({
    activity,
}: {
    activity: DashboardStats['recentActivity'][0];
}) => {
    const { t } = useTranslation();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-600';
            case 'pending':
                return 'text-yellow-600';
            case 'cancelled':
                return 'text-red-600';
            default:
                return 'text-gray-600';
        }
    };

    return (
        <div className="flex items-center space-x-4 rounded-lg border p-4 dark:border-gray-700">
            <div
                className={`rounded-full p-2 ${getStatusColor(activity.status)} bg-opacity-10`}
            >
                {activity.type === 'transaction' && (
                    <BanknotesIcon className="h-6 w-6" />
                )}
                {activity.type === 'ticket' && (
                    <ClockIcon className="h-6 w-6" />
                )}
                {activity.type === 'withdrawal' && (
                    <ArrowTrendingUpIcon className="h-6 w-6" />
                )}
            </div>
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {activity.user}
                </p>
                <p className="text-sm text-gray-500">
                    {t(`activity.${activity.type}`, {
                        amount: activity.amount_usd
                            ? `$${activity.amount_usd}`
                            : '-',
                    })}
                </p>
            </div>
            <div className="text-right">
                <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(activity.status)}`}
                >
                    {t(`status.${activity.status}`)}
                </span>
                <p className="mt-1 text-xs text-gray-500">
                    {activity.created_at}
                </p>
            </div>
        </div>
    );
};

const SummaryCard = ({
    title,
    value,
    description,
    icon: Icon,
    color,
}: SummaryCardProps) => (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {title}
                </p>
                <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                    {value}
                </h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>
            </div>
            <div className={`rounded-full p-3 ${color} bg-opacity-10`}>
                <Icon className="h-6 w-6" />
            </div>
        </div>
    </div>
);

const TransactionChart = ({ data }: { data: ChartDataPoint[] }) => (
    <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
        <h3 className="mb-6 text-lg font-medium text-gray-900 dark:text-gray-100">
            {t('dashboard.transactionTrend')}
        </h3>
        <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                    <CartesianGrid
                        strokeDasharray="3 3"
                        className="stroke-gray-200 dark:stroke-gray-700"
                    />
                    <XAxis
                        dataKey="name"
                        className="text-gray-600 dark:text-gray-400"
                    />
                    <YAxis className="text-gray-600 dark:text-gray-400" />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                        }}
                    />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    </div>
);

const QuickActionButton = ({
    icon: Icon,
    label,
    onClick,
    color,
}: QuickActionButtonProps) => (
    <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex flex-col items-center rounded-lg p-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700`}
        onClick={onClick}
    >
        <div className={`rounded-full bg-opacity-10 p-3 ${color}`}>
            <Icon className="h-6 w-6" />
        </div>
        <span className="mt-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
        </span>
    </motion.button>
);

const QuickActions = () => {
    const { t } = useTranslation();

    const handleNavigate = (path: string) => {
        router.visit(path);
    };

    return (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('dashboard.quickActions')}
                </h3>
                <Link
                    href="/actions"
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    {t('common.viewAll')}
                </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <QuickActionButton
                    icon={FaExchangeAlt}
                    label={t('dashboard.newTransaction')}
                    color="text-blue-500"
                    onClick={() => handleNavigate('/transactions/new')}
                />
                <QuickActionButton
                    icon={FaUserPlus}
                    label={t('dashboard.addUser')}
                    color="text-green-500"
                    onClick={() => handleNavigate('/users/new')}
                />
                <QuickActionButton
                    icon={FaChartPie}
                    label={t('dashboard.viewReports')}
                    color="text-purple-500"
                    onClick={() => handleNavigate('/reports')}
                />
            </div>
        </div>
    );
};

export default function Dashboard({
    auth,
    stats,
    showWelcomeToast,
}: PageProps) {
    const { t } = useTranslation();

    useEffect(() => {
        if (showWelcomeToast) {
            toast.success(t('dashboard.welcomeMessage'), {
                autoClose: 5000,
                position: 'top-center' as const,
            });
        }
    }, [showWelcomeToast, t]);

    if (!stats) {
        return (
            <AuthenticatedLayout auth={auth}>
                <div className="flex h-screen items-center justify-center">
                    <div className="text-center">
                        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
                        <p className="mt-4 text-lg text-gray-600">
                            {t('common.loading')}
                        </p>
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }

    const chartData: ChartDataPoint[] = [
        { name: 'Pzt', value: 30 },
        { name: 'Sal', value: 45 },
        { name: 'Çar', value: 35 },
        { name: 'Per', value: 50 },
        { name: 'Cum', value: 40 },
        { name: 'Cmt', value: 60 },
        { name: 'Paz', value: 45 },
    ];

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('dashboard')}
                </h2>
            }
        >
            <Head title={t('dashboard')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title={t('dashboard.totalTransactions')}
                            value={stats.transactions.total}
                            icon={BanknotesIcon}
                            color="from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
                        />
                        <StatCard
                            title={t('dashboard.totalAmount')}
                            value={`$${stats.transactions.totalAmount_usd.toFixed(2)}`}
                            icon={CurrencyDollarIcon}
                            color="from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
                        />
                        <StatCard
                            title={t('dashboard.pendingTransactions')}
                            value={stats.transactions.pending}
                            icon={ClockIcon}
                            color="from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30"
                        />
                        <StatCard
                            title={t('dashboard.completedTransactions')}
                            value={stats.transactions.completed}
                            icon={CheckCircleIcon}
                            color="from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <TransactionChart data={chartData} />
                        </div>
                        <div>
                            <QuickActions />
                        </div>
                    </div>

                    <div className="grid gap-6 lg:grid-cols-2">
                        <div className="grid gap-4">
                            <SummaryCard
                                title={t('dashboard.dailyAverage')}
                                value={`$${(stats.transactions.totalAmount_usd / 30).toFixed(2)}`}
                                description={t('dashboard.last30Days')}
                                icon={CurrencyDollarIcon}
                                color="text-emerald-500"
                            />
                            <SummaryCard
                                title={t('dashboard.successRate')}
                                value={`${((stats.transactions.completed / stats.transactions.total) * 100).toFixed(1)}%`}
                                description={t('dashboard.completionRate')}
                                icon={CheckCircleIcon}
                                color="text-blue-500"
                            />
                        </div>

                        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                {t('dashboard.recentActivity')}
                            </h3>
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity) => (
                                    <ActivityItem
                                        key={`${activity.type}-${activity.id}`}
                                        activity={activity}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
function t(arg0: string): import("react").ReactNode {
    throw new Error('Function not implemented.');
}

