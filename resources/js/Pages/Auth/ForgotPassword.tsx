import React, { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaEnvelope, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function ForgotPassword({ status, languages, secili_dil }: { status?: string, languages: any, secili_dil: any }) {
    const { t } = useTranslation();
    const [isValidEmail, setIsValidEmail] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const validateEmail = (email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    const inputVariants = {
        focus: { scale: 1.02, boxShadow: '0px 0px 8px theme("colors.light.primary")', transition: { duration: 0.2 } },
        blur: { scale: 1, boxShadow: 'none', transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
    };

    return (
        <GuestLayout languages={languages} secili_dil={secili_dil}>
            <Head title={t('forgotPassword.title')} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-30 dark:bg-opacity-30 border border-gray-200 dark:border-gray-700 border-opacity-20">
                    <div className="p-8 sm:p-10">
                        <AnimatePresence>
                            <motion.h2
                                key="forgot-password-text"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center"
                            >
                                {t('forgotPassword.title')}
                            </motion.h2>
                        </AnimatePresence>

                        <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                            {t('forgotPassword.description')}
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                                {t('forgotPassword.linkSent')}
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-6">
                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('forgotPassword.email')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => {
                                            setData('email', e.target.value);
                                            setIsValidEmail(validateEmail(e.target.value));
                                        }}
                                        className="block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary dark:bg-dark-surface dark:text-dark-text bg-light-surface text-light-text bg-opacity-50 dark:bg-opacity-50 border border-transparent transition duration-200"
                                        placeholder={t('forgotPassword.emailPlaceholder')}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </motion.div>

                            <div>
                                <motion.button
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={processing || !isValidEmail}
                                    className={`
                                        w-full flex justify-center items-center py-3 px-4 
                                        text-sm font-medium 
                                        text-white
                                        rounded-lg
                                        transition-all duration-200 ease-in-out
                                        ${processing || !isValidEmail
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-light-primary hover:bg-blue-400 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <FaSpinner className="h-5 w-5 mr-3 animate-spin" />
                                    ) : (
                                        <FaEnvelope className="h-5 w-5 mr-3" />
                                    )}
                                    {t('forgotPassword.sendResetLink')}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </GuestLayout>
    );
}