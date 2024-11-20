import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaUser, FaEnvelope, FaSpinner, FaUserEdit, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { toast } from 'react-toastify';

interface User {
    id: number;
    name: string;
    email: string;
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

export default function EditUser({ auth, user, languages, secili_dil, availableRoles }: EditUserProps) {
    const { t } = useTranslation();
    const [isValidEmail, setIsValidEmail] = useState(true);

    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        role: user.roles[0]?.id || '',
    });

    const validateEmail = useCallback((email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }, []);

    useEffect(() => {
        setIsValidEmail(validateEmail(data.email));
    }, [data.email, validateEmail]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isValidEmail) {
            put(route('users.update', user.id), {
                onSuccess: () => {
                    toast.success(t('users.updateSuccess'));
                    router.visit(route('users.index'));
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
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
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
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100"
                            >
                                {t('users.editUser')}
                            </motion.h2>

                            <form onSubmit={submit} className="space-y-6">
                                {/* İsim Alanı */}
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('users.name')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="mt-1 relative rounded-md shadow-sm"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                    </motion.div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                {/* Email Alanı */}
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('users.email')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="mt-1 relative rounded-md shadow-sm"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            {isValidEmail ? (
                                                <FaCheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                data.email && <FaTimesCircle className="h-5 w-5 text-red-500" />
                                            )}
                                        </div>
                                    </motion.div>
                                    <InputError message={errors.email} className="mt-2" />
                                </div>

                                {/* Rol Seçimi - Radio buttons */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {t('users.role')}
                                    </label>
                                    <div className="space-y-2">
                                        {availableRoles.map((role) => (
                                            <label key={role.id} className="inline-flex items-center mr-6">
                                                <input
                                                    type="radio"
                                                    name="role"
                                                    value={role.id}
                                                    checked={data.role === role.id}
                                                    onChange={(e) => setData('role', Number(e.target.value))}
                                                    className="form-radio h-4 w-4 text-blue-600 dark:text-blue-400 focus:ring-blue-500"
                                                />
                                                <span className="ml-2 text-gray-700 dark:text-gray-300">
                                                    {role.name.charAt(0).toUpperCase() + role.name.slice(1)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                    <InputError message={errors.role} className="mt-2" />
                                </div>

                                {/* Gönder Butonu */}
                                <div className="flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => router.visit(route('users.index'))}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                    >
                                        {t('common.cancel')}
                                    </motion.button>
                                    
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing || !isValidEmail}
                                        className={`
                                            inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-sm text-white
                                            ${processing || !isValidEmail
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                            }
                                        `}
                                    >
                                        {processing ? (
                                            <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                                        ) : (
                                            <FaUserEdit className="h-5 w-5 mr-2" />
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