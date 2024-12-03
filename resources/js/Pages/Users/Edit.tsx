import InputError from '@/Components/InputError';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';
import {
    FaCheckCircle,
    FaEnvelope,
    FaSpinner,
    FaTimesCircle,
    FaUser,
    FaUserEdit,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles: Array<{
        id: number;
        name: string;
    }>;
}

interface EditUserProps {
    auth: any;
    user: User;
    languages: any;
    secili_dil: any;
    availableRoles: Array<{
        id: number;
        name: string;
    }>;
}

export default function EditUser({
    auth,
    user,
    languages,
    secili_dil,
    availableRoles,
}: EditUserProps) {
    const { t } = useTranslation();
    const [isValidEmail, setIsValidEmail] = useState(true);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.id || '',
        is_active: user.is_active,
    });

    const validateEmail = useCallback((email: string) => {
        const re =
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }, []);

    useEffect(() => {
        setIsValidEmail(validateEmail(data.email));
    }, [data.email, validateEmail]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isValidEmail) {
            put(route('admin.users.update', user.id), {
                onSuccess: () => {
                    toast.success(t('users.updateSuccess'));
                    router.visit(route('admin.users.index'));
                },
                onError: () => {
                    toast.error(t('users.updateError'));
                },
            });
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } },
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('users.editUser')}
                </h2>
            }
        >
            <Head title={t('users.editUser')} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12"
            >
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-gray-100"
                            >
                                {t('users.editUser')}
                            </motion.h2>

                            <form onSubmit={submit} className="space-y-6">
                                {/* İsim Alanı */}
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t('users.name')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="relative mt-1 rounded-md shadow-sm"
                                    >
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                    </motion.div>
                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Email Alanı */}
                                <div>
                                    <label
                                        htmlFor="email"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t('users.email')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="relative mt-1 rounded-md shadow-sm"
                                    >
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                            {isValidEmail ? (
                                                <FaCheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                data.email && (
                                                    <FaTimesCircle className="h-5 w-5 text-red-500" />
                                                )
                                            )}
                                        </div>
                                    </motion.div>
                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Rol Seçimi - Radio buttons */}
                                <div>
                                    <label className="mb-3 block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('users.role')}
                                    </label>
                                    <div className="space-y-2">
                                        {availableRoles.map((role) => (
                                            <label
                                                key={role.id}
                                                className="mr-6 inline-flex items-center"
                                            >
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.id}
                                                    checked={
                                                        data.role === role.id
                                                    }
                                                    onChange={(e) =>
                                                        setData(
                                                            'role',
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
                                                    className="form-radio h-4 w-4 text-blue-600 focus:ring-blue-500 dark:text-blue-400"
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">
                                                    {role.name
                                                        .charAt(0)
                                                        .toUpperCase() +
                                                        role.name.slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError
                                        message={errors.role}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Aktif/Pasif Toggle Switch - Yeni Tasarım */}
                                <div className="mt-6 rounded-lg bg-gray-50 p-4 shadow-sm dark:bg-gray-700">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                {t('users.accountStatus')}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {t(
                                                    'users.accountStatusDescription',
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <label className="flex cursor-pointer items-center">
                                                <div className="relative">
                                                    <input
                                                        type="checkbox"
                                                        checked={data.is_active}
                                                        onChange={(e) => {
                                                            setData(
                                                                'is_active',
                                                                e.target
                                                                    .checked,
                                                            );
                                                            console.log(
                                                                'is_active changed:',
                                                                e.target
                                                                    .checked,
                                                            ); // Debug için
                                                        }}
                                                        className="sr-only"
                                                    />
                                                    <div
                                                        className={`h-7 w-14 rounded-full transition-colors duration-300 ease-in-out ${data.is_active ? 'bg-green-500' : 'bg-gray-400'} shadow-inner`}
                                                    >
                                                        <div
                                                            className={`absolute left-0.5 top-0.5 flex h-6 w-6 transform items-center justify-center rounded-full bg-white shadow-lg transition-transform duration-300 ease-in-out ${data.is_active ? 'translate-x-7' : 'translate-x-0'} `}
                                                        >
                                                            {data.is_active ? (
                                                                <FaCheckCircle className="h-4 w-4 text-green-500" />
                                                            ) : (
                                                                <FaTimesCircle className="h-4 w-4 text-gray-400" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                <span
                                                    className={`ml-3 text-sm font-medium ${
                                                        data.is_active
                                                            ? 'text-green-600 dark:text-green-400'
                                                            : 'text-gray-500 dark:text-gray-400'
                                                    } `}
                                                >
                                                    {data.is_active
                                                        ? t(
                                                              'users.statusActive',
                                                          )
                                                        : t(
                                                              'users.statusInactive',
                                                          )}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="mt-2">
                                        <div
                                            className={`rounded-md p-2 text-sm ${
                                                data.is_active
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            } `}
                                        >
                                            {data.is_active
                                                ? t(
                                                      'users.activeAccountMessage',
                                                  )
                                                : t(
                                                      'users.inactiveAccountMessage',
                                                  )}
                                        </div>
                                    </div>
                                </div>

                                {/* Gönder Butonu */}
                                <div className="flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() =>
                                            router.visit(
                                                route('admin.users.index'),
                                            )
                                        }
                                        className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        {t('common.cancel')}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing || !isValidEmail}
                                        className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white ${
                                            processing || !isValidEmail
                                                ? 'cursor-not-allowed bg-gray-400'
                                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                        } `}
                                    >
                                        {processing ? (
                                            <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <FaUserEdit className="mr-2 h-5 w-5" />
                                        )}
                                        {t('users.update')}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
