import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaSearch, FaFilter, FaEdit, FaEye, FaSync, FaTicketAlt, FaExclamationCircle, FaCheckCircle, FaClock } from 'react-icons/fa';
import Pagination from '@/Components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';
import debounce from 'lodash/debounce';
import { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: number;
    icon: IconType;
    color: string;
    textColor: string;
    onClick?: () => void;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5
        }
    }
};

const StatCard = ({ title, value, icon: Icon, color, textColor, onClick }: StatCardProps) => (
    <div 
        className={`${color} rounded-2xl shadow-sm p-6 ${textColor} ${onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : ''}`}
        onClick={onClick}
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm opacity-90">{title}</p>
                <p className="text-2xl font-bold mt-2">{value}</p>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
                <Icon className="w-6 h-6" />
            </div>
        </div>
    </div>
);

interface Ticket {
    id: number;
    subject: string;
    status: string;
    priority: string;
    category: string;
    last_reply_at: string;
    user: {
        name: string;
        email: string;
    };
}

interface Props {
    auth: any;
    tickets: {
        data: Ticket[];
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        category?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    statuses: string[];
    priorities: string[];
    categories: string[];
    stats: {
        total: number;
        open: number;
        answered: number;
        high_priority: number;
    };
}

type SortDirection = 'asc' | 'desc';

interface SortState {
    column: string;
    direction: SortDirection;
}

export default function Index({ auth, tickets, filters = {}, statuses, priorities, categories, stats }: Props) {
    const { t } = useTranslation();
    const [showFilters, setShowFilters] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    
    const defaultFilters = {
        search: '',
        status: '',
        priority: '',
        category: '',
        sort: '',
        direction: 'asc' as SortDirection,
        page: '1'
    };

    const { data, setData, reset } = useForm({
        ...defaultFilters,
        ...filters
    });

    const [sortState, setSortState] = useState<SortState>({
        column: data.sort || '',
        direction: (data.direction as SortDirection) || 'asc'
    });

    // Filtreleri sıfırla ve ilk sayfaya dön
    const resetFilters = () => {
        reset();
        router.get(route('admin.tickets.index'), defaultFilters);
    };

    // Filtreleri uygula ve ilk sayfaya dön
    const applyFilters = (newData: typeof data) => {
        router.get(route('admin.tickets.index'), {
            ...newData,
            page: '1' // Her filtre değişiminde ilk sayfaya dön
        }, {
            preserveState: true,
            preserveScroll: false,
            onBefore: () => setIsLoading(true),
            onFinish: () => {
                setIsLoading(false);
                setShowFilters(false);
            },
            onError: () => {
                setIsLoading(false);
                resetFilters();
            }
        });
    };

    // Arama değiştiğinde
    const handleSearch = useCallback(
        debounce((query: string) => {
            if (!initialLoad) {
                const newData = { ...data, search: query, page: '1' };
                setData(newData);
                applyFilters(newData);
            }
        }, 300),
        [data, initialLoad]
    );

    // Filtre değiştiğinde
    useEffect(() => {
        if (!initialLoad) {
            applyFilters(data);
        }
    }, [data.status, data.priority, data.category]);

    // Sıralama değiştiğinde
    const handleSort = useCallback((column: string) => {
        const newDirection: SortDirection = sortState.column === column && sortState.direction === 'asc' ? 'desc' : 'asc';
        
        const newSortState: SortState = {
            column,
            direction: newDirection
        };

        setSortState(newSortState);
        
        const newData = {
            ...data,
            sort: column,
            direction: newDirection,
            page: '1' // Sıralama değiştiğinde ilk sayfaya dön
        };

        setData(newData);
        applyFilters(newData);
    }, [sortState, data]);

    // İstatistik kartlarına tıklandığında
    const handleStatCardClick = (filterType: 'status' | 'priority', value: string) => {
        const newData = {
            ...defaultFilters,
            [filterType]: value,
            page: '1'
        };
        setData(newData);
        applyFilters(newData);
    };

    const SortableHeader = ({ column, children }: { column: string; children: React.ReactNode }) => {
        const isActive = sortState.column === column;
        
        return (
            <th 
                scope="col" 
                className={`px-6 py-4 text-left text-xs font-medium tracking-wider whitespace-nowrap cursor-pointer transition-colors
                    ${isActive 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                    }`}
                onClick={() => handleSort(column)}
            >
                <div className="flex items-center space-x-1">
                    <span>{children}</span>
                    {isActive && (
                        <span className="text-indigo-600 dark:text-indigo-400">
                            {sortState.direction === 'asc' ? '↑' : '↓'}
                        </span>
                    )}
                </div>
            </th>
        );
    };

    // İlk yüklemeyi kontrol etmek için useEffect ekleyelim
    useEffect(() => {
        setInitialLoad(false);
    }, []);

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={t('admin.tickets')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* İstatistik Kartları */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <StatCard
                            title={t('stats.totalTickets')}
                            value={stats.total}
                            icon={FaTicketAlt}
                            color="bg-gradient-to-br from-indigo-500 to-purple-600"
                            textColor="text-white"
                            onClick={resetFilters}
                        />
                        <StatCard
                            title={t('stats.openTickets')}
                            value={stats.open}
                            icon={FaClock}
                            color="bg-gradient-to-br from-amber-500 to-orange-600"
                            textColor="text-white"
                            onClick={() => handleStatCardClick('status', 'open')}
                        />
                        <StatCard
                            title={t('stats.answeredTickets')}
                            value={stats.answered}
                            icon={FaCheckCircle}
                            color="bg-gradient-to-br from-emerald-500 to-teal-600"
                            textColor="text-white"
                            onClick={() => handleStatCardClick('status', 'answered')}
                        />
                        <StatCard
                            title={t('stats.highPriority')}
                            value={stats.high_priority}
                            icon={FaExclamationCircle}
                            color="bg-gradient-to-br from-rose-500 to-red-600"
                            textColor="text-white"
                            onClick={() => handleStatCardClick('priority', 'high')}
                        />
                    </div>

                    {/* Boş Durum */}
                    {tickets.data.length === 0 && !isLoading && (
                        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                            <FaTicketAlt className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">
                                {t('ticket.noTickets')}
                            </h3>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                {t('ticket.noTicketsDescription')}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={resetFilters}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    {t('common.resetFilters')}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    )}

                    {/* Ana Kart - Yeni Tasarım */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                        {/* Üst Kısım */}
                        <div className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                {/* Sol Taraf - Başlık ve Arama */}
                                <div className="flex-1 space-y-4">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                        {t('admin.tickets')}
                                    </h2>
                                    <div className="relative max-w-md">
                                        <input
                                            type="text"
                                            placeholder={t('common.search')}
                                            className="w-full pl-12 pr-4 py-3 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-shadow duration-150"
                                            value={data.search}
                                            onChange={e => {
                                                setData('search', e.target.value);
                                                handleSearch(e.target.value);
                                            }}
                                        />
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <FaSearch className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                </div>

                                {/* Sağ Taraf - Filtre Butonu */}
                                <div>
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className={`inline-flex items-center px-5 py-3 rounded-xl text-sm font-medium transition-all duration-150
                                            ${showFilters 
                                                ? 'bg-indigo-500 text-white hover:bg-indigo-600' 
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                                            }`}
                                    >
                                        <FaFilter className={`w-4 h-4 mr-2 ${showFilters ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`} />
                                        {t('common.filters')}
                                    </button>
                                </div>
                            </div>

                            {/* Filtre Paneli */}
                            <AnimatePresence>
                                {showFilters && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="mt-6"
                                    >
                                        <div className="p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-750 rounded-xl border border-gray-200/50 dark:border-gray-700/50">
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                {/* Durum Filtresi */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {t('ticket.status')}
                                                    </label>
                                                    <select
                                                        value={data.status}
                                                        onChange={e => setData('status', e.target.value)}
                                                        className="w-full py-3 pl-4 pr-10 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                                    >
                                                        <option value="">{t('ticket.allStatuses')}</option>
                                                        {statuses.map(status => (
                                                            <option key={status} value={status}>
                                                                {t(`ticket.status.${status}`)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Öncelik Filtresi */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {t('ticket.priority')}
                                                    </label>
                                                    <select
                                                        value={data.priority}
                                                        onChange={e => setData('priority', e.target.value)}
                                                        className="w-full py-3 pl-4 pr-10 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                                    >
                                                        <option value="">{t('ticket.allPriorities')}</option>
                                                        {priorities.map(priority => (
                                                            <option key={priority} value={priority}>
                                                                {t(`ticket.priority.${priority}`)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>

                                                {/* Kategori Filtresi */}
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {t('ticket.category')}
                                                    </label>
                                                    <select
                                                        value={data.category}
                                                        onChange={e => setData('category', e.target.value)}
                                                        className="w-full py-3 pl-4 pr-10 rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
                                                    >
                                                        <option value="">{t('ticket.allCategories')}</option>
                                                        {categories.map(category => (
                                                            <option key={category} value={category}>
                                                                {t(`ticket.category.${category}`)}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tablo */}
                        <div className="border-t border-gray-200 dark:border-gray-700">
                            <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead>
                                            <tr className="bg-gray-50/50 dark:bg-gray-800/50">
                                                <SortableHeader column="subject">
                                                    {t('ticket.subject')}
                                                </SortableHeader>
                                                <SortableHeader column="user">
                                                    {t('ticket.user')}
                                                </SortableHeader>
                                                <SortableHeader column="priority">
                                                    {t('ticket.priority')}
                                                </SortableHeader>
                                                <SortableHeader column="status">
                                                    {t('ticket.status')}
                                                </SortableHeader>
                                                <SortableHeader column="last_reply_at">
                                                    {t('ticket.lastReply')}
                                                </SortableHeader>
                                                <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap">
                                                    {t('common.actions')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {tickets.data.map((ticket, index) => (
                                                <tr 
                                                    key={ticket.id}
                                                    className={`group hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                                                        index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50/30 dark:bg-gray-800/30'
                                                    }`}
                                                >
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center">
                                                            <div className="min-w-0 flex-1">
                                                                <div 
                                                                    className="text-sm font-medium text-gray-900 dark:text-gray-100 group relative"
                                                                    title={ticket.subject}
                                                                >
                                                                    <div className="hidden md:block">
                                                                        <span className="cursor-help">
                                                                            {truncateText(ticket.subject, 60)}
                                                                        </span>
                                                                    </div>
                                                                    
                                                                    <div className="md:hidden">
                                                                        <span className="cursor-help">
                                                                            {truncateText(ticket.subject, 30)}
                                                                        </span>
                                                                    </div>

                                                                    <div className="absolute z-10 invisible group-hover:visible bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg py-2 px-3 -top-10 left-1/2 transform -translate-x-1/2 w-auto max-w-xs">
                                                                        {ticket.subject}
                                                                        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-gray-700"></div>
                                                                    </div>
                                                                </div>

                                                                <div className="md:hidden mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                                                    <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                                                                        <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                                                                            {ticket.user.name.charAt(0).toUpperCase()}
                                                                        </span>
                                                                    </div>
                                                                    <span className="truncate max-w-[120px]">{ticket.user.name}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                        <div className="flex items-center">
                                                            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                                    {ticket.user.name.charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div className="ml-3">
                                                                <div 
                                                                    className="text-sm font-medium text-gray-900 dark:text-gray-100 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400"
                                                                    onClick={() => {
                                                                        setData('search', ticket.user.name);
                                                                        router.get(route('admin.tickets.index', { search: ticket.user.name }));
                                                                    }}
                                                                >
                                                                    {ticket.user.name}
                                                                </div>
                                                                <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                                                    {ticket.user.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <PriorityBadge priority={ticket.priority} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                                        <StatusBadge status={ticket.status} />
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-400 hidden lg:table-cell">
                                                        {formatDate(ticket.last_reply_at)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <Link
                                                                href={route('admin.tickets.show', ticket.id)}
                                                                className="p-2 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                                                            >
                                                                <FaEye className="w-5 h-5" />
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination - Sticky yapıldı */}
                            <div className="sticky bottom-0 p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <Pagination links={tickets.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Yardımcı Bileşenler
const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
        low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        high: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority as keyof typeof colors]}`}>
            {priority}
        </span>
    );
};

const StatusBadge = ({ status }: { status: string }) => {
    const colors = {
        open: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        answered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
        closed: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    };

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status as keyof typeof colors]}`}>
            {status}
        </span>
    );
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }); 
};

const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};  