import Modal from '@/Components/Modal';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import Tippy from '@tippyjs/react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import {
    FaCopy,
    FaEdit,
    FaEnvelope,
    FaEye,
    FaKey,
    FaTicketAlt,
    FaTrash,
    FaUserPlus,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
    roles: Array<{
        id: number;
        name: string;
    }>;
    created_at: string;
    current_password: string | null;
    has_encrypted_password: boolean;
    password_updated_at: string | null;
}

interface SelectedUser extends Omit<User, 'current_password'> {
    current_password?: string | null;
}

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{
                name: string;
            }>;
        };
    };
    users: User[];
}

export default function Index({ auth, users }: Props) {
    const { t } = useTranslation();
    const [selectedUser, setSelectedUser] = useState<SelectedUser | null>(null);
    const [showUserModal, setShowUserModal] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const showUserDetails = params.get('showUserDetails');
        const tempPassword = params.get('tempPassword');

        if (showUserDetails && tempPassword) {
            const user = users.find((u) => u.id === parseInt(showUserDetails));
            if (user) {
                setSelectedUser({
                    ...user,
                    current_password: tempPassword,
                });
                setShowUserModal(true);
            }
        }
    }, [users]);

    const handleDelete = (userId: number) => {
        if (confirm(t('users.confirmDelete'))) {
            router.delete(route('admin.users.destroy', userId), {
                onSuccess: () => {
                    toast.success(t('users.deleteSuccess'));
                },
            });
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success(t('common.copied'));
    };

    const sendEmail = (userId: number) => {
        router.post(
            route('admin.users.send-credentials', userId),
            {},
            {
                onSuccess: () => toast.success(t('users.emailSent')),
                onError: () => toast.error(t('users.emailError')),
            },
        );
    };

    const createSupportTicket = (userId: number) => {
        router.post(
            route('admin.tickets.create-for-user', userId),
            {
                subject: 'Kullanıcı Bilgileri',
                message: `Kullanıcı bilgileri talep edildi.\nKullanıcı: ${selectedUser?.name}\nE-posta: ${selectedUser?.email}`,
            },
            {
                onSuccess: () => toast.success(t('tickets.created')),
                onError: () => toast.error(t('tickets.error')),
            },
        );
    };

    const sendCredentials = (userId: number) => {
        router.post(route('admin.users.send-credentials', userId), {}, {
            onSuccess: () => {
                toast.success(t('users.credentialsSent'));
                setShowUserModal(false);
                router.reload();
            },
            onError: () => {
                toast.error(t('users.credentialsError'));
            },
        });
    };

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    id: auth.user.id,
                    name: auth.user.name,
                    email: auth.user.email,
                    roles: auth.user.roles,
                },
            }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('users.title')}
                </h2>
            }
        >
            <Head title={t('users.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex justify-end">
                                <Link
                                    href={route('admin.users.create')}
                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-blue-900"
                                >
                                    <FaUserPlus className="mr-2" />
                                    {t('users.addNew')}
                                </Link>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-700">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                            >
                                                {t('users.name')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                            >
                                                {t('users.email')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                            >
                                                {t('users.role')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-300"
                                            >
                                                {t('users.createdAt')}
                                            </th>
                                            <th
                                                scope="col"
                                                className="relative px-6 py-3"
                                            >
                                                <span className="sr-only">
                                                    {t('users.actions')}
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-800">
                                        {users.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                whileHover={{
                                                    backgroundColor:
                                                        'rgba(0,0,0,0.05)',
                                                }}
                                                className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {user.name}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                    {user.email}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                    {user.roles[0]?.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        user.roles[0]?.name.slice(
                                                            1,
                                                        ) || t('users.noRole')}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-300">
                                                    {new Date(
                                                        user.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                                    <div className="flex justify-end space-x-3">
                                                        <Tippy
                                                            content={t(
                                                                'users.resetPassword',
                                                            )}
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'admin.users.reset-password-form',
                                                                    {
                                                                        user: user.id,
                                                                    },
                                                                )}
                                                                className="text-yellow-600 transition-colors duration-150 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                                                                preserveScroll
                                                            >
                                                                <FaKey className="h-5 w-5" />
                                                            </Link>
                                                        </Tippy>
                                                        <Tippy
                                                            content={t(
                                                                'users.edit',
                                                            )}
                                                        >
                                                            <Link
                                                                href={route(
                                                                    'admin.users.edit',
                                                                    user.id,
                                                                )}
                                                                className="text-indigo-600 transition-colors duration-150 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                                                            >
                                                                <FaEdit className="h-5 w-5" />
                                                            </Link>
                                                        </Tippy>
                                                        <Tippy
                                                            content={t(
                                                                'users.delete',
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        user.id,
                                                                    )
                                                                }
                                                                className="text-red-600 transition-colors duration-150 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                                            >
                                                                <FaTrash className="h-5 w-5" />
                                                            </button>
                                                        </Tippy>
                                                        <Tippy
                                                            content={t(
                                                                'users.viewDetails',
                                                            )}
                                                        >
                                                            <button
                                                                onClick={() => {
                                                                    setSelectedUser(
                                                                        {
                                                                            ...user,
                                                                            current_password: user.current_password
                                                                        }
                                                                    );
                                                                    setShowUserModal(
                                                                        true,
                                                                    );
                                                                }}
                                                                className="text-blue-600 transition-colors duration-150 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                                            >
                                                                <FaEye className="h-5 w-5" />
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

            {showUserModal && selectedUser && (
                <Modal
                    show={showUserModal}
                    onClose={() => setShowUserModal(false)}
                >
                    <div className="p-6">
                        <h3 className="mb-6 text-2xl font-bold text-gray-900 dark:text-gray-100">
                            {t('users.userDetails')}
                        </h3>

                        <div className="space-y-6">
                            {/* Kullanıcı Bilgi Kartı */}
                            <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700/50">
                                <div className="grid gap-4 md:grid-cols-2">
                                    {/* İsim Alanı */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('users.name')}
                                        </label>
                                        <div className="flex items-center justify-between rounded-md bg-white p-2 dark:bg-gray-800">
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {selectedUser.name}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedUser.name,
                                                    )
                                                }
                                                className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                            >
                                                <FaCopy className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* E-posta Alanı */}
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t('users.email')}
                                        </label>
                                        <div className="flex items-center justify-between rounded-md bg-white p-2 dark:bg-gray-800">
                                            <span className="text-gray-900 dark:text-gray-100">
                                                {selectedUser.email}
                                            </span>
                                            <button
                                                onClick={() =>
                                                    copyToClipboard(
                                                        selectedUser.email,
                                                    )
                                                }
                                                className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                            >
                                                <FaCopy className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Şifre Bilgisi */}
                            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            {t('users.currentPassword')}
                                        </label>
                                        {!selectedUser.has_encrypted_password && (
                                            <span className="text-xs text-yellow-600 dark:text-yellow-400">
                                                {t('users.noStoredPassword')}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between rounded-md bg-white p-2 dark:bg-gray-800">
                                        <span className="text-gray-900 dark:text-gray-100 font-mono">
                                            {selectedUser.current_password || t('users.notAvailable')}
                                        </span>
                                        <div className="flex items-center space-x-2">
                                            {selectedUser.current_password && (
                                                <button
                                                    onClick={() => selectedUser.current_password && copyToClipboard(selectedUser.current_password)}
                                                    className="ml-2 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-700"
                                                    title={t('common.copy')}
                                                >
                                                    <FaCopy className="h-4 w-4" />
                                                </button>
                                            )}
                                            {!selectedUser.current_password && selectedUser.id && (
                                                <button
                                                    onClick={() => sendCredentials(selectedUser.id)}
                                                    className="ml-2 rounded-full p-1 text-yellow-400 hover:bg-yellow-100 hover:text-yellow-600 dark:hover:bg-yellow-700"
                                                    title={t('users.generateNewPassword')}
                                                >
                                                    <FaKey className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    {selectedUser.password_updated_at && (
                                        <p className="mt-1 text-xs text-yellow-600 dark:text-yellow-400">
                                            {t('users.lastUpdated')}:{' '}
                                            {new Date(selectedUser.password_updated_at).toLocaleString()}
                                        </p>
                                    )}
                                    <div className="mt-2 text-xs text-yellow-600 dark:text-yellow-400">
                                        <p>{t('users.passwordNote')}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Aksiyon Butonları */}
                            <div className="flex justify-end space-x-3">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => sendEmail(selectedUser.id)}
                                    className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                                >
                                    <FaEnvelope className="mr-2 h-4 w-4" />
                                    {t('users.sendEmail')}
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() =>
                                        createSupportTicket(selectedUser.id)
                                    }
                                    className="inline-flex items-center rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                                >
                                    <FaTicketAlt className="mr-2 h-4 w-4" />
                                    {t('users.createTicket')}
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </Modal>
            )}
        </AuthenticatedLayout>
    );
}
