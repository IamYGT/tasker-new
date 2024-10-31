import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaSpinner, FaSignInAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function Login({
    status,
    canResetPassword,
    languages,
    secili_dil,
}: {
    status?: string;
    canResetPassword: boolean;
    languages: any;
    secili_dil: any;
}) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
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
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('login.email')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaEnvelope className="h-5 w-5 text-light-secondary dark:text-dark-secondary" aria-hidden="true" />
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
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('login.password')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-light-secondary dark:text-dark-secondary" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
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
                                        >
                                            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
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
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-light-text dark:text-dark-text">
                                        {t('login.rememberMe')}
                                    </label>
                                </div>

                                {canResetPassword && (
                                    <div className="text-sm">
                                        <Link href={route('password.request')} className="font-medium text-light-primary hover:text-light-accent dark:text-dark-primary dark:hover:text-dark-accent">
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
                                        ${processing
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

                        {/* Social Login */}
                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        {t('login.orContinueWith')}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a
                                        href="#"
                                        className="w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
                                    >
                                        <span className="sr-only">Google ile giriş yap</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                                        </svg>
                                    </a>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a
                                        href="#"
                                        className="w-full inline-flex justify-center py-2 px-4 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition duration-200"
                                    >
                                        <span className="sr-only">GitHub ile giriş yap</span>
                                        <FaGithub className="w-5 h-5 text-black dark:text-white" />
                                    </a>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                    {/* Sign Up Link */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        className="px-4 py-6 bg-light-background dark:bg-dark-surface sm:px-10"
                    >
                        <p className="text-sm leading-6 text-light-text-secondary dark:text-dark-text-secondary">
                            {t('login.noAccount')}{' '}
                            <Link href={route('register')} className="font-medium text-light-primary hover:text-light-accent dark:text-dark-primary dark:hover:text-dark-accent">
                                {t('login.signUp')}
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </motion.div>
        </GuestLayout>
    );
}