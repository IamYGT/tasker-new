import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaUserPlus, FaEdit, FaTrash, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Tippy from '@tippyjs/react';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
}

interface Props {
    auth: any;
    users: User[];
    languages: any;
    secili_dil: any;
}

export default function Index({ auth, users, languages, secili_dil }: Props) {
    const { t } = useTranslation();

    const handleDelete = (userId: number) => {
        if (confirm(t('users.confirmDelete'))) {
            router.delete(route('users.destroy', userId), {
                onSuccess: () => {
                    toast.success(t('users.deleteSuccess'));
                },
            });
        }
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {t('users.title')}
                </h2>
            }
        >
            <Head title={t('users.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex justify-end">
                                <Link
                                    href={route('users.create')}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 focus:bg-blue-700 active:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150"
                                >
                                    <FaUserPlus className="mr-2" />
                                    {t('users.addNew')}
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {t('users.name')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {t('users.email')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {t('users.role')}
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                                {t('users.createdAt')}
                                            </th>
                                            <th scope="col" className="relative px-6 py-3">
                                                <span className="sr-only">{t('users.actions')}</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                                        {users.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.name}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {user.roles[0]?.name.charAt(0).toUpperCase() + user.roles[0]?.name.slice(1) || t('users.noRole')}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-3">
                                                        <Tippy content={t('users.resetPassword')}>
                                                            <Link
                                                                href={route('users.reset-password-form', { user: user.id })}
                                                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors duration-150"
                                                                preserveScroll
                                                            >
                                                                <FaKey className="w-5 h-5" />
                                                            </Link>
                                                        </Tippy>
                                                        <Tippy content={t('users.edit')}>
                                                            <Link
                                                                href={route('users.edit', user.id)}
                                                                className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors duration-150"
                                                            >
                                                                <FaEdit className="w-5 h-5" />
                                                            </Link>
                                                        </Tippy>
                                                        <Tippy content={t('users.delete')}>
                                                            <button
                                                                onClick={() => handleDelete(user.id)}
                                                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-150"
                                                            >
                                                                <FaTrash className="w-5 h-5" />
                                                            </button>
                                                        </Tippy>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 