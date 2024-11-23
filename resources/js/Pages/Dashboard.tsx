import React, { useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const data = [
    { name: 'Oca', value: 400 },
    { name: 'Şub', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Nis', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Haz', value: 700 },
];

interface StatCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    change: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, change }) => {
    const { t } = useTranslation();
    return (
        <div className="bg-light-surface dark:bg-dark-surface rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-light-text-secondary dark:text-dark-text-secondary">{t(title)}</h3>
                <Icon className="w-6 h-6 text-light-primary dark:text-dark-primary" />
            </div>
            <div className="text-3xl font-bold text-light-text dark:text-dark-text mb-2">{value}</div>
            <div className={`text-sm ${change.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                {change}
            </div>
        </div>
    );
};

interface PageProps {
    auth: {
        user: {
            roles: Array<{ name: string }>;
        };
    };
    showWelcomeToast?: boolean;
    languages: any;
    secili_dil: any;
}

export default function Dashboard({ auth, showWelcomeToast, languages, secili_dil }: PageProps) {
    const { t } = useTranslation();
    const { flash } = usePage().props;
    useEffect(() => {
        if (typeof flash === 'object' && flash !== null && 'error' in flash && typeof flash.error === 'string') {
            toast.error(flash.error);
        }
    }, [flash]);

    useEffect(() => {
        if (showWelcomeToast) {
            toast.success(t('dashboard.welcomeMessage'), {
                position: "top-center",
                autoClose: 10000, // 10 saniye açık kalması için değiştirildi
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                theme: "colored",
                icon: () => "🎉",
            });
        }
    }, [showWelcomeToast, t]);

    useEffect(() => {
        if (auth.user.roles.some(role => role.name === 'admin')) {
            window.location.href = route('admin.dashboard');
        }
    }, [auth.user.roles]);

    return (
        <AuthenticatedLayout
            auth={auth}
          
            header={
                <h2 className="text-2xl font-bold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300">
                    {t('dashboard')}
                </h2>
            }
        >
            <Head title={t('dashboard')} />

            <div className="py-12 transition-colors duration-300 min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <StatCard
                            title="total_customers"
                            value="10,482"
                            icon={Users}
                            change="+2.5%"
                        />
                        <StatCard
                            title="total_sales"
                            value="₺45,231.89"
                            icon={DollarSign}
                            change="+15.2%"
                        />
                        <StatCard
                            title="active_projects"
                            value="23"
                            icon={TrendingUp}
                            change="+4"
                        />
                        <StatCard
                            title="planned_events"
                            value="7"
                            icon={Calendar}
                            change="-2"
                        />
                    </div>

                    <div className="mt-8 rounded-xl shadow-lg p-6 transition-all duration-300">
                        <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-6">
                            {t('monthly_sales_chart')}
                        </h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <XAxis dataKey="name" stroke="currentColor" />
                                    <YAxis stroke="currentColor" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'var(--color-light-surface)',
                                            color: 'var(--color-light-text)',
                                            border: '1px solid var(--color-light-primary)',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Bar dataKey="value" fill="var(--color-light-primary)" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="mt-8 grid gap-6 md:grid-cols-2">
                        <div className="rounded-xl shadow-lg p-6 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                                {t('recent_activities')}
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-light-primary dark:bg-dark-primary rounded-full mr-2"></span>
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('new_customer_registration', { name: 'Ahmet Yılmaz' })}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('hours_ago', { hours: 2 })}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('project_completed', { project: t('website_renewal') })}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('yesterday')}</span>
                                </li>
                                <li className="flex items-center">
                                    <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('new_order_received', { order: '#1234' })}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('days_ago', { days: 3 })}</span>
                                </li>
                            </ul>
                        </div>
                        <div className="rounded-xl shadow-lg p-6 transition-all duration-300">
                            <h3 className="text-xl font-semibold text-light-text dark:text-dark-text mb-4">
                                {t('upcoming_tasks')}
                            </h3>
                            <ul className="space-y-4">
                                <li className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary" />
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('prepare_client_meeting')}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('today')}</span>
                                </li>
                                <li className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary" />
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('send_project_proposal')}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('tomorrow')}</span>
                                </li>
                                <li className="flex items-center">
                                    <input type="checkbox" className="mr-2 rounded text-light-primary dark:text-dark-primary focus:ring-light-primary dark:focus:ring-dark-primary" />
                                    <span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">{t('team_evaluation_meeting')}</span>
                                    <span className="ml-auto text-xs text-light-text-secondary dark:text-dark-text-secondary">{t('days_later', { days: 3 })}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 