import React, { useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import {
    FaUsers,
    FaExchangeAlt,
    FaTicketAlt,
    FaMoneyBillWave,
    FaChartLine,
    FaUsersCog,
} from 'react-icons/fa';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';

interface Stats {
    totalUsers: number;
    activeUsers: number;
    totalTransactions: number;
    pendingTransactions: number;
    totalTickets: number;
    openTickets: number;
    totalWithdrawals: number;
    pendingWithdrawals: number;
    recentActivity: Array<{
        id: number;
        type: string;
        description: string;
        created_at: string;
        status: string;
    }>;
}

interface PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{
                id: number;
                name: string;
            }>;
        };
    };
    flash: {
        error?: string;
        success?: string;
    };
    [key: string]: any;
}

interface DashboardProps {
    auth: any;
    stats: Stats;
}

interface StatCardProps {
    title: string;
    value: number;
    icon: IconType;
    color: string;
    secondaryValue?: string;
}

interface QuickActionButtonProps {
    title: string;
    icon: IconType;
    href: string;
}

export default function AdminDashboard({ auth, stats }: DashboardProps) {
    const { t } = useTranslation();
    const page = usePage<PageProps>();
    const flash = page.props.flash;

    useEffect(() => {
        if (flash?.error) {
            toast.error(flash.error);
        }
        if (flash?.success) {
            toast.success(flash.success);
        }
    }, [flash]);

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const StatCard = ({ title, value, icon: Icon, color, secondaryValue }: StatCardProps) => (
        <motion.div
            variants={cardVariants}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-semibold mt-2">{value}</p>
                    {secondaryValue && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {secondaryValue}
                        </p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-20')}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={t('admin.dashboard')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <StatCard
                            title={t('admin.totalUsers')}
                            value={stats.totalUsers}
                            secondaryValue={`${stats.activeUsers} ${t('admin.activeUsers')}`}
                            icon={FaUsers}
                            color="border-l-4 border-blue-500"
                        />
                        <StatCard
                            title={t('admin.totalTransactions')}
                            value={stats.totalTransactions}
                            secondaryValue={`${stats.pendingTransactions} ${t('admin.pending')}`}
                            icon={FaExchangeAlt}
                            color="border-l-4 border-green-500"
                        />
                        <StatCard
                            title={t('admin.totalTickets')}
                            value={stats.totalTickets}
                            secondaryValue={`${stats.openTickets} ${t('admin.open')}`}
                            icon={FaTicketAlt}
                            color="border-l-4 border-yellow-500"
                        />
                        <StatCard
                            title={t('admin.totalWithdrawals')}
                            value={stats.totalWithdrawals}
                            secondaryValue={`${stats.pendingWithdrawals} ${t('admin.pending')}`}
                            icon={FaMoneyBillWave}
                            color="border-l-4 border-purple-500"
                        />
                    </motion.div>

                    {/* Son Aktiviteler ve Grafikler */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Son Aktiviteler */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FaChartLine className="mr-2" />
                                {t('admin.recentActivity')}
                            </h2>
                            <div className="space-y-4">
                                {stats.recentActivity.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium">{activity.description}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {new Date(activity.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm ${
                                                activity.status === 'completed'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                        >
                                            {activity.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Hızlı İşlemler */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
                        >
                            <h2 className="text-lg font-semibold mb-4 flex items-center">
                                <FaUsersCog className="mr-2" />
                                {t('admin.quickActions')}
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                <QuickActionButton
                                    title={t('admin.manageUsers')}
                                    icon={FaUsers}
                                    href={route('admin.users.index')}
                                />
                                <QuickActionButton
                                    title={t('admin.manageTransactions')}
                                    icon={FaExchangeAlt}
                                    href={route('admin.transactions.index')}
                                />
                                <QuickActionButton
                                    title={t('admin.manageTickets')}
                                    icon={FaTicketAlt}
                                    href={route('admin.tickets.index')}
                                />
                                <QuickActionButton
                                    title={t('admin.viewLogs')}
                                    icon={FaChartLine}
                                    href={route('admin.logs.index')}
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const QuickActionButton = ({ title, icon: Icon, href }: QuickActionButtonProps) => (
    <motion.a
        href={href}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
    >
        <Icon className="w-5 h-5 mr-3" />
        <span className="font-medium">{title}</span>
    </motion.a>
); 