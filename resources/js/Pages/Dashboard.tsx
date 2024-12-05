import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {
    ArrowTrendingUpIcon,
    BanknotesIcon,
    CheckCircleIcon,
    ClockIcon,
    CurrencyDollarIcon,
    ChatBubbleLeftIcon,
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
        totalWithdrawn_usd: number;
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
    ibans: Array<{
        id: number;
        bank_name: string;
        iban: string;
        is_default: boolean;
    }>;
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
        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${color} p-6 shadow-lg transition-all duration-300`}
    >
        <div className="relative z-10 flex items-center justify-between">
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
            <div className="rounded-full bg-white/20 p-3 shadow-inner transition-transform group-hover:scale-110 dark:bg-gray-800/20">
                <Icon className="h-8 w-8 text-gray-700 dark:text-gray-300" />
            </div>
        </div>
        <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
    </motion.div>
);

const ActivityItem = ({
    activity,
}: {
    activity: DashboardStats['recentActivity'][0];
}) => {
    const { t } = useTranslation();

    // Durum renklerini ve arkaplan renklerini tanımlayalım
    const getStatusStyles = (status: string) => {
        const styles = {
            completed: {
                text: 'text-green-600 dark:text-green-400',
                bg: 'bg-green-50 dark:bg-green-400/10',
                icon: 'text-green-500 dark:text-green-400',
                border: 'border-green-100 dark:border-green-400/20'
            },
            pending: {
                text: 'text-amber-600 dark:text-amber-400',
                bg: 'bg-amber-50 dark:bg-amber-400/10',
                icon: 'text-amber-500 dark:text-amber-400',
                border: 'border-amber-100 dark:border-amber-400/20'
            },
            cancelled: {
                text: 'text-red-600 dark:text-red-400',
                bg: 'bg-red-50 dark:bg-red-400/10',
                icon: 'text-red-500 dark:text-red-400',
                border: 'border-red-100 dark:border-red-400/20'
            },
            open: {
                text: 'text-blue-600 dark:text-blue-400',
                bg: 'bg-blue-50 dark:bg-blue-400/10',
                icon: 'text-blue-500 dark:text-blue-400',
                border: 'border-blue-100 dark:border-blue-400/20'
            },
            answered: {
                text: 'text-purple-600 dark:text-purple-400',
                bg: 'bg-purple-50 dark:bg-purple-400/10',
                icon: 'text-purple-500 dark:text-purple-400',
                border: 'border-purple-100 dark:border-purple-400/20'
            },
            closed: {
                text: 'text-gray-600 dark:text-gray-400',
                bg: 'bg-gray-50 dark:bg-gray-400/10',
                icon: 'text-gray-500 dark:text-gray-400',
                border: 'border-gray-100 dark:border-gray-400/20'
            }
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    // İkon seçimini yapalım
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'transaction':
                return <BanknotesIcon className="h-5 w-5" />;
            case 'ticket':
                return <ChatBubbleLeftIcon className="h-5 w-5" />;
            case 'withdrawal':
                return <ArrowTrendingUpIcon className="h-5 w-5" />;
            default:
                return <ClockIcon className="h-5 w-5" />;
        }
    };

    const statusStyle = getStatusStyles(activity.status);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`group flex items-center gap-4 rounded-xl border p-4 transition-all duration-200 hover:shadow-md dark:border-gray-700 ${statusStyle.border}`}
        >
            {/* İkon Alanı */}
            <div className={`rounded-full p-2.5 ${statusStyle.bg} ${statusStyle.icon}`}>
                {getActivityIcon(activity.type)}
            </div>

            {/* İçerik Alanı */}
            <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                        {activity.user}
                    </h4>
                    <span className={`text-sm ${statusStyle.text}`}>
                        •
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {activity.created_at}
                    </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                    {t(`activity.${activity.type}`, {
                        amount: activity.amount_usd
                            ? new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            }).format(activity.amount_usd)
                            : '-'
                    })}
                </p>
            </div>

            {/* Durum Etiketi */}
            <div className="shrink-0">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.text}`}>•</span>
                    {t(`status.${activity.status}`)}
                </span>
            </div>
        </motion.div>
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

const TransactionChart = ({ data }: { data: ChartDataPoint[] }) => {
    const { t } = useTranslation();

    return (
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
};

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

    const actions = [
        {
            icon: FaExchangeAlt,
            label: t('dashboard.transactions'),
            href: route('transactions.history'),
            color: 'from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700'
        },
        {
            icon: CurrencyDollarIcon,
            label: t('dashboard.withdrawal'),
            href: route('withdrawal.request'),
            color: 'from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700'
        },
        {
            icon: ChatBubbleLeftIcon,
            label: t('dashboard.supportTickets'),
            href: route('tickets.index'),
            color: 'from-amber-500 to-amber-600',
            hoverColor: 'hover:from-amber-600 hover:to-amber-700'
        },
        {
            icon: BanknotesIcon,
            label: t('dashboard.ibanManagement'),
            href: route('profile.ibans.index'),
            color: 'from-purple-500 to-purple-600',
             hoverColor: 'hover:from-purple-600 hover:to-purple-700'
        }
    ];

    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {actions.map((action, index) => (
                <Link key={index} href={action.href}>
                    <motion.div
                        whileHover={{ scale: 1.03 }}
                        className={`group relative overflow-hidden rounded-xl bg-gradient-to-br ${action.color} p-6 shadow-lg transition-all duration-300 ${action.hoverColor}`}
                    >
                        <div className="relative z-10 flex flex-col items-center space-y-3 text-white">
                            <action.icon className="h-8 w-8 transition-transform group-hover:scale-110" />
                            <span className="text-sm font-medium">{action.label}</span>
                        </div>
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 transition-transform group-hover:scale-110" />
                    </motion.div>
                </Link>
            ))}
        </div>
    );
};

const UserWelcome = ({ userName }: { userName: string }) => {
    const { t } = useTranslation();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative overflow-hidden rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-8 shadow-lg"
        >
            <div className="relative z-10">
                <h1 className="text-3xl font-bold text-white">
                    {t('dashboard.welcome', { name: userName })}
                </h1>

            </div>
            <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10" />
            <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-white/10" />
        </motion.div>
    );
};

const IbanList = ({ ibans }: { ibans: DashboardStats['ibans'] }) => {
    const { t } = useTranslation();

    return (
        <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
            <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                {t('dashboard.myIbans')}
            </h3>
            <div className="space-y-4">
                {ibans.map((iban) => (
                    <motion.div
                        key={iban.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-900"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                    {iban.bank_name}
                                </p>
                                <p className="mt-1 font-mono text-sm text-gray-600 dark:text-gray-400">
                                    {iban.iban}
                                </p>
                            </div>
                            {iban.is_default && (
                                <span className="ml-2 rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800 dark:bg-green-900 dark:text-green-200">
                                    {t('common.default')}
                                </span>
                            )}
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function Dashboard({ auth, stats }: PageProps) {
    const { t } = useTranslation();

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
                    <UserWelcome userName={auth.user.name} />

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title={t('dashboard.totalTransactions')}
                            value={stats.transactions.total}
                            icon={BanknotesIcon}
                            color="from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30"
                        />
                        <StatCard
                            title={t('dashboard.totalWithdrawn')}
                            value={new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2
                            }).format(stats.transactions.totalWithdrawn_usd)}
                            icon={CurrencyDollarIcon}
                            color="from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30"
                        />
                        <StatCard
                            title={t('dashboard.pendingTransactions')}
                            value={stats.transactions.pending}
                            icon={ClockIcon}
                            color="from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30"
                        />
                        <StatCard
                            title={t('dashboard.openTickets')}
                            value={stats.tickets.open}
                            icon={ChatBubbleLeftIcon}
                            color="from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30"
                        />
                    </div>

                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="lg:col-span-2">
                            <div className="grid gap-6">
                                <QuickActions />
                                <div className="rounded-xl bg-white p-6 shadow-lg dark:bg-gray-800">
                                    <h3 className="mb-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                                        {t('dashboard.recentActivity')}
                                    </h3>
                                    <div className="space-y-4">
                                        {stats.recentActivity.slice(0, 3).map((activity) => (
                                            <ActivityItem
                                                key={`${activity.type}-${activity.id}`}
                                                activity={activity}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <IbanList ibans={stats.ibans} />
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

