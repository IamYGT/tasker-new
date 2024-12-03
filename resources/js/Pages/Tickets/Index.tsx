import { PriorityBadge, StatusBadge } from '@/Components/Badges';
import { StatCard } from '@/Components/StatCard';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/Utils/ticket_format';
import { Head, Link } from '@inertiajs/react';
import { FaCheckCircle, FaComments, FaTicketAlt } from 'react-icons/fa';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
        };
    };
    tickets: {
        data: Array<{
            id: number;
            subject: string;
            status: string;
            priority: string;
            last_reply_at: string;
        }>;
        links?: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        meta?: {
            current_page: number;
            from: number;
            last_page: number;
            path: string;
            per_page: number;
            to: number;
            total: number;
        };
    };
    stats: {
        total: number;
        open: number;
        answered: number;
    };
}

export default function Index({ auth, tickets, stats }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('tickets.title')}
                </h2>
            }
        >
            <Head title={t('tickets.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <StatCard
                            title={t('tickets.stats.total')}
                            value={stats.total}
                            icon={FaTicketAlt}
                            color="bg-indigo-500"
                            textColor="text-white"
                        />
                        <StatCard
                            title={t('tickets.stats.open')}
                            value={stats.open}
                            icon={FaComments}
                            color="bg-blue-500"
                            textColor="text-white"
                        />
                        <StatCard
                            title={t('tickets.stats.answered')}
                            value={stats.answered}
                            icon={FaCheckCircle}
                            color="bg-green-500"
                            textColor="text-white"
                        />
                    </div>

                    {/* Yeni Ticket Oluştur Butonu */}
                    <div className="mb-6">
                        <Link
                            href={route('tickets.create')}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                        >
                            <FaTicketAlt className="mr-2" />
                            {t('tickets.create')}
                        </Link>
                    </div>

                    {/* Ticket Listesi */}
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm dark:bg-gray-800">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {t('tickets.subject')}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {t('tickets.priority')}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {t('tickets.status')}
                                        </th>
                                        <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            {t('tickets.lastReply')}
                                        </th>
                                        <th className="relative px-6 py-3">
                                            <span className="sr-only">
                                                {t('common.actions')}
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {tickets.data.map((ticket) => (
                                        <tr key={ticket.id}>
                                            <td className="whitespace-nowrap px-6 py-4">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {ticket.subject}
                                                </div>
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                <PriorityBadge
                                                    priority={ticket.priority}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center">
                                                <StatusBadge
                                                    status={ticket.status}
                                                />
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(
                                                    ticket.last_reply_at,
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                <Link
                                                    href={route(
                                                        'tickets.show',
                                                        ticket.id,
                                                    )}
                                                    className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                >
                                                    {t('common.view')}
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
