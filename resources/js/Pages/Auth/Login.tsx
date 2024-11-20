import React, { useState, useEffect, FormEventHandler } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { PageProps } from '@inertiajs/inertia';
import { useTranslation } from '@/Contexts/TranslationContext';
import {
    FaEnvelope,
    FaLock,
    FaEye,
    FaEyeSlash,
    FaSpinner,
    FaSignInAlt,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import { toast } from 'react-toastify';

interface LoginProps extends PageProps {
    status?: string;
    canResetPassword: boolean;
    languages: any;
    secili_dil: any;
    showResetSuccessToast?: boolean;
}

const Login: React.FC<LoginProps> = ({
    status,
    canResetPassword,
    languages,
    secili_dil,
    showResetSuccessToast,
}) => {
    const { t, locale } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {
        console.log('Current locale:', locale);
        console.log('Translations loaded:', t('login.title'));
    }, [locale, t]);

    useEffect(() => {
        if (showResetSuccessToast) {
            toast.success(t('login.passwordResetSuccess'), {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    }, [showResetSuccessToast, t]);

    useEffect(() => {
        const error = route().params.error;
        if (error) {
            toast.error(error);
        }
    }, []);

    const handleError = (errors: any) => {
        if (errors.email) {
            toast.error(errors.email, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
        if (errors.password) {
            toast.error(errors.password, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
            });
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        console.log('Submitting form with data:', data);
        post(route('login'), {
            onError: handleError,
            onFinish: () => {
                console.log('Login attempt finished');
                reset('password');
            },
        });
    };

    const inputVariants = {
        focus: {
            scale: 1.02,
            boxShadow: '0px 0px 8px theme("colors.light.primary")',
            transition: { duration: 0.2 },
        },
        blur: { scale: 1, boxShadow: 'none', transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } },
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 },
    };

    return (
        <GuestLayout languages={languages} secili_dil={secili_dil}>
            <Head title={t('login.title')} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-30 dark:bg-opacity-30 border border-gray-200 dark:border-gray-700 border-opacity-20">
                    <div className="border-b border-gray-200 dark:border-gray-700 border-opacity-20 p-8 sm:p-10">
                        <AnimatePresence>
                            <motion.h2
                                key="welcome-text"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="text-4xl font-extrabold text-black dark:text-white mb-8 text-center"
                            >
                                {t('login.welcomeBack')}
                            </motion.h2>
                        </AnimatePresence>

                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Input */}
                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    {t('login.email')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope
                                            className="h-5 w-5 text-light-secondary dark:text-dark-secondary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 sm:text-sm rounded-md focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary dark:bg-dark-surface dark:text-dark-text bg-light-surface text-light-text bg-opacity-50 dark:bg-opacity-50 border border-transparent transition duration-200"
                                        placeholder={t('login.emailPlaceholder')}
                                        required
                                    />
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </motion.div>

                            {/* Password Input */}
                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    {t('login.password')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock
                                            className="h-5 w-5 text-light-secondary dark:text-dark-secondary"
                                            aria-hidden="true"
                                        />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary dark:bg-dark-surface dark:text-dark-text bg-light-surface text-light-text bg-opacity-50 dark:bg-opacity-50 border border-transparent transition duration-200"
                                        placeholder={t('login.passwordPlaceholder')}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-light-secondary hover:text-light-primary focus:outline-none focus:text-light-primary dark:text-dark-secondary dark:hover:text-dark-primary dark:focus:text-dark-primary"
                                            aria-label={
                                                showPassword
                                                    ? t('login.hidePassword')
                                                    : t('login.showPassword')
                                            }
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5" />
                                            ) : (
                                                <FaEye className="h-5 w-5" />
                                            )}
                                        </motion.button>
                                    </div>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </motion.div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                        className="h-4 w-4 text-light-primary focus:ring-light-primary dark:text-dark-primary dark:focus:ring-dark-primary rounded"
                                    />
                                    <label
                                        htmlFor="remember-me"
                                        className="ml-2 block text-sm text-light-text dark:text-dark-text"
                                    >
                                        {t('login.rememberMe')}
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link
                                            href={route('password.request')}
                                            className="font-medium text-light-primary hover:text-light-accent dark:text-dark-primary dark:hover:text-dark-accent"
                                        >
                                            {t('login.forgotPassword')}
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div>
                                <motion.button
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={processing}
                                    className={`
                                        w-full flex justify-center items-center py-3 px-4 
                                        text-sm font-medium 
                                        text-white
                                        rounded-lg
                                        transition-all duration-200 ease-in-out
                                        ${
                                            processing
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-light-primary hover:bg-blue-400 hover:shadow-lg'
                                        }
                                    `}
                                    aria-label={t('login.logIn')}
                                >
                                    {processing ? (
                                        <FaSpinner className="h-5 w-5 mr-3 animate-spin" />
                                    ) : (
                                        <FaSignInAlt className="h-5 w-5 mr-3" />
                                    )}
                                    {t('login.logIn')}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </GuestLayout>
    );
};

export default Login;
