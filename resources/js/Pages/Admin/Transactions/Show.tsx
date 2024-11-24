import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { Transaction } from '@/types';
import { FaArrowLeft, FaUser, FaCalendar, FaMoneyBillWave, FaCreditCard, FaFileAlt, FaCheckCircle, FaTimesCircle, FaEdit, FaStickyNote, FaHistory, FaExchangeAlt, FaUserEdit, FaChartBar } from 'react-icons/fa';
import { getStatusColor, getTypeColor, getStatusIcon } from '@/utils/transaction';
import { motion } from 'framer-motion';

interface HistoryItem {
    type: 'status_change' | 'notes_update' | 'info';
    messageKey: string;
    params?: Record<string, string>;
    date: string;
    user?: string;
}

interface Props {
    auth: any;
    transaction: Transaction & {
        history?: HistoryItem[];
    };
}

interface TransactionStats {
    totalAmount: number;
    lastUpdate: string;
    historyCount: number;
}

interface StatCardProps {
    title: string;
    value: React.ReactNode;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
}

export default function Show({ auth, transaction }: Props) {
    const { t } = useTranslation();

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

    const stats: TransactionStats = {
        totalAmount: transaction.amount,
        lastUpdate: transaction.updated_at,
        historyCount: transaction.history?.length || 0,
    };

    const StatCard = ({ title, value, icon: Icon, color }: StatCardProps) => (
        <motion.div
            variants={cardVariants}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${color}`}
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-2xl font-semibold mt-2">{value}</p>
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-l-4', 'bg-opacity-20')}`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
        </motion.div>
    );

    const renderHistoryMessage = (item: HistoryItem) => {
        let message = t(item.messageKey);
        
        if (item.params) {
            Object.entries(item.params).forEach(([key, value]) => {
                message = message.replace(`:${key}`, value);
            });
        }
        
        return message;
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${t('transaction.details')} - ${transaction.reference_id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                        className="space-y-6"
                    >
                       

                        {/* Üst Bar */}
                        <motion.div 
                            variants={cardVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4"
                        >
                            <div className="flex items-center justify-between">
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
                                            {t('transaction.details')}
                                        </h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            {t('transaction.viewDescription')}
                                        </p>
                                    </div>
                                </div>
                                <Link
                                    href={route('admin.transactions.edit', transaction.id)}
                                    className="inline-flex items-center px-4 py-2.5 bg-light-primary dark:bg-dark-primary hover:bg-light-primary/90 dark:hover:bg-dark-primary/90 text-white rounded-lg transition-all duration-200 font-medium shadow-sm hover:shadow-md group"
                                >
                                    <FaEdit className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                                    {t('common.edit')}
                                </Link>
                            </div>
                        </motion.div>

                        {/* Ana İçerik */}
                        <motion.div 
                            variants={cardVariants}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden"
                        >
                            {/* Durum Banner */}
                            <div className={`px-8 py-4 ${getStatusColor(transaction.status)} bg-opacity-10 dark:bg-opacity-20 border-b border-gray-100 dark:border-gray-700`}>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(transaction.status)}
                                        <span className="font-medium">
                                            {t(`status.${transaction.status}`)}
                                        </span>
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-lg text-sm font-medium ${getTypeColor(transaction.type)}`}>
                                        {t(`transaction.${transaction.type}`)}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Sol Kolon - Temel Bilgiler */}
                                    <div className="space-y-8">
                                        {/* Kullanıcı Bilgileri */}
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                                <FaUser className="w-5 h-5 mr-2 text-gray-500" />
                                                {t('transaction.userDetails')}
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-4">
                                                    <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/50 rounded-full flex items-center justify-center">
                                                        <span className="text-primary-700 dark:text-primary-300 text-lg font-medium">
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
                                            </div>
                                        </div>

                                        {/* Ödeme Detayları */}
                                        <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                                <FaMoneyBillWave className="w-5 h-5 mr-2 text-gray-500" />
                                                {t('transaction.paymentDetails')}
                                            </h3>
                                            <div className="space-y-4">
                                                <DetailItem
                                                    icon={<FaCreditCard />}
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
                                                    icon={<FaFileAlt />}
                                                    label={t('transaction.referenceId')}
                                                    value={transaction.reference_id}
                                                />
                                                <DetailItem
                                                    icon={<FaCalendar />}
                                                    label={t('transaction.date')}
                                                    value={new Date(transaction.created_at).toLocaleDateString('tr-TR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Sağ Kolon - Ek Bilgiler */}
                                    <div className="space-y-8">
                                        {/* İşlem Geçmişi */}
                                        {transaction.history && transaction.history.length > 0 && (
                                            <motion.div 
                                                variants={cardVariants}
                                                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                                    <FaHistory className="w-5 h-5 mr-2 text-gray-500" />
                                                    {t('transaction.history')}
                                                </h3>
                                                <div className="relative">
                                                    {/* Timeline çizgisi */}
                                                    <div className="absolute left-4 top-6 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-600" />
                                                    
                                                    <div className="space-y-6">
                                                        {transaction.history.map((item: HistoryItem, index: number) => (
                                                            <div key={index} className="relative flex items-start pl-8">
                                                                {/* Timeline noktası */}
                                                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                                    item.type === 'status_change' 
                                                                        ? 'bg-blue-100 dark:bg-blue-900/20' 
                                                                        : item.type === 'notes_update'
                                                                        ? 'bg-purple-100 dark:bg-purple-900/20'
                                                                        : 'bg-gray-100 dark:bg-gray-700/50'
                                                                }`}>
                                                                    {getHistoryIcon(item.type)}
                                                                </div>

                                                                {/* İçerik */}
                                                                <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm ml-4">
                                                                    <p className="text-gray-900 dark:text-gray-100 font-medium">
                                                                        {renderHistoryMessage(item)}
                                                                    </p>
                                                                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                                        <span>
                                                                            {new Date(item.date).toLocaleDateString('tr-TR', {
                                                                                day: 'numeric',
                                                                                month: 'long',
                                                                                year: 'numeric',
                                                                                hour: '2-digit',
                                                                                minute: '2-digit'
                                                                            })}
                                                                        </span>
                                                                        {item.user && (
                                                                            <>
                                                                                <span>•</span>
                                                                                <span className="flex items-center gap-1">
                                                                                    <FaUserEdit className="w-3 h-3" />
                                                                                    {item.user}
                                                                                </span>
                                                                            </>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Notlar */}
                                        {transaction.notes ? (
                                            <motion.div 
                                                variants={cardVariants}
                                                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                                    <FaStickyNote className="w-5 h-5 mr-2 text-gray-500" />
                                                    {t('transaction.notes')}
                                                </h3>
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                                                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                                        {transaction.notes}
                                                    </p>
                                                    <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                                        <FaCalendar className="w-4 h-4 mr-2" />
                                                        {t('transaction.lastUpdated')}: {' '}
                                                        {new Date(transaction.updated_at).toLocaleDateString('tr-TR', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            <motion.div 
                                                variants={cardVariants}
                                                className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
                                                    <FaStickyNote className="w-5 h-5 mr-2 text-gray-500" />
                                                    {t('transaction.notes')}
                                                </h3>
                                                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center">
                                                    <p className="text-gray-500 dark:text-gray-400 italic">
                                                        {t('transaction.noNotes')}
                                                    </p>
                                                    <Link
                                                        href={route('admin.transactions.edit', transaction.id)}
                                                        className="inline-flex items-center mt-4 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                                                    >
                                                        <FaEdit className="w-4 h-4 mr-1" />
                                                        {t('transaction.addNote')}
                                                    </Link>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

// Yardımcı Bileşen
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) => (
    <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-gray-100 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            {icon}
        </div>
        <div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
                {label}
            </div>
            <div className="text-gray-900 dark:text-gray-100">
                {value}
            </div>
        </div>
    </div>
);

const getHistoryIcon = (type: string) => {
    switch (type) {
        case 'status_change':
            return <FaExchangeAlt className="w-4 h-4 text-blue-600 dark:text-blue-400" />;
        case 'notes_update':
            return <FaStickyNote className="w-4 h-4 text-purple-600 dark:text-purple-400" />;
        default:
            return <FaHistory className="w-4 h-4 text-gray-600 dark:text-gray-400" />;
    }
}; 