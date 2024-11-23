import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { Transaction } from '@/types';
import { FaArrowLeft, FaUser, FaCalendar, FaMoneyBillWave, FaCreditCard, FaFileAlt, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { getStatusColor, getTypeColor, getStatusIcon } from '@/utils/transaction';
import { motion } from 'framer-motion';

interface HistoryItem {
    type: 'success' | 'info';
    message: string;
    date: string;
}

interface Props {
    auth: any;
    transaction: Transaction & {
        history?: HistoryItem[];
    };
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
                                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
                                >
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
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                    {t('transaction.history')}
                                                </h3>
                                                <div className="space-y-4">
                                                    {transaction.history.map((item: HistoryItem, index: number) => (
                                                        <div key={index} className="flex items-start space-x-3">
                                                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center ${
                                                                item.type === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                                                            }`}>
                                                                {item.type === 'success' ? <FaCheckCircle /> : <FaTimesCircle />}
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-900 dark:text-gray-100 font-medium">
                                                                    {item.message}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {new Date(item.date).toLocaleDateString('tr-TR', {
                                                                        day: 'numeric',
                                                                        month: 'long',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit'
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Notlar */}
                                        {transaction.notes && (
                                            <motion.div 
                                                variants={cardVariants}
                                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6"
                                            >
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                                                    {t('transaction.notes')}
                                                </h3>
                                                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                                    {transaction.notes}
                                                </p>
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