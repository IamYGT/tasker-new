import React, { useState, useCallback, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

export default function ResetPassword({
    token,
    email,
    languages,
    secili_dil,
}: {
    token: string;
    email: string;
    languages: any;
    secili_dil: any;
}) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const validatePassword = (password: string) => {
        // En az 8 karakter, bir büyük harf, bir küçük harf ve bir rakam içermeli
        const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return re.test(password);
    };

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        // Önce şifreyi sakla
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

        // Şifre sıfırlama işlemi
        post(route('password.store'), {
            preserveState: true,
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

    const checkPasswordStrength = useCallback((password: string) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (password.match(/[a-z]+/)) strength++;
        if (password.match(/[A-Z]+/)) strength++;
        if (password.match(/[0-9]+/)) strength++;
        if (password.match(/[$@#&!]+/)) strength++;
        return strength;
    }, []);

    useEffect(() => {
        setPasswordStrength(checkPasswordStrength(data.password));
        setPasswordsMatch(data.password === data.password_confirmation);
    }, [data.password, data.password_confirmation, checkPasswordStrength]);

    useEffect(() => {
        setData('email', email);
        setData('token', token);
    }, [email, token]);

    const renderPasswordStrengthBar = () => {
        const strengthColors = ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#22C55E'];
        const strengthTexts = [
            t('resetPassword.passwordVeryWeak'),
            t('resetPassword.passwordWeak'),
            t('resetPassword.passwordMedium'),
            t('resetPassword.passwordStrong'),
            t('resetPassword.passwordVeryStrong')
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
            >
                <div className="flex mb-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <motion.div
                            key={level}
                            className={`h-2 w-1/5 mr-1 rounded-full`}
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: passwordStrength > level ? 1 : 0,
                                backgroundColor: strengthColors[Math.min(passwordStrength - 1, 4)]
                            }}
                            transition={{ duration: 0.2, delay: level * 0.05 }}
                        />
                    ))}
                </div>
                <motion.p
                    className="text-xs mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: strengthColors[Math.min(passwordStrength - 1, 4)] }}
                >
                    {strengthTexts[Math.min(passwordStrength - 1, 4)]}
                </motion.p>
            </motion.div>
        );
    };

    return (
        <GuestLayout languages={languages} secili_dil={secili_dil}>
            <Head title={t('resetPassword.title')} />

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
                                key="reset-password-text"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.5 }}
                                className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6 text-center"
                            >
                                {t('resetPassword.title')}
                            </motion.h2>
                        </AnimatePresence>

                        <form onSubmit={submit} className="space-y-6">
                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('resetPassword.email')}
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-light-primary focus:border-light-primary sm:text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300"
                                    onChange={(e) => setData('email', e.target.value)}
                                    disabled
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </motion.div>

                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('resetPassword.password')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password"
                                        type={showPassword ? 'text' : 'password'}
                                        name="password"
                                        value={data.password}
                                        onChange={(e) => {
                                            setData('password', e.target.value);
                                            setPasswordStrength(checkPasswordStrength(e.target.value));
                                        }}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-light-primary focus:border-light-primary sm:text-sm"
                                        placeholder={t('resetPassword.passwordPlaceholder')}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 dark:focus:text-gray-200"
                                        >
                                            {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </motion.button>
                                    </div>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                                {data.password && renderPasswordStrengthBar()}
                            </motion.div>

                            <motion.div
                                variants={inputVariants}
                                initial="blur"
                                whileFocus="focus"
                                whileTap="tap"
                                animate="blur"
                            >
                                <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {t('resetPassword.confirmPassword')}
                                </label>
                                <div className="relative rounded-md shadow-sm">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <FaLock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-light-primary focus:border-light-primary sm:text-sm"
                                        placeholder={t('resetPassword.confirmPasswordPlaceholder')}
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 dark:focus:text-gray-200"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                                        </motion.button>
                                    </div>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                                {!passwordsMatch && data.password_confirmation && (
                                    <p className="text-xs mt-1 text-red-500">{t('resetPassword.passwordsDontMatch')}</p>
                                )}
                            </motion.div>

                            <div>
                                <motion.button
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={processing || passwordStrength < 3 || !passwordsMatch}
                                    className={`
                                        w-full flex justify-center items-center py-3 px-4
                                        border border-transparent rounded-md shadow-sm text-sm font-medium text-white
                                        focus:outline-none focus:ring-2 focus:ring-offset-2
                                        ${processing || passwordStrength < 3 || !passwordsMatch
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-light-primary hover:bg-blue-700 focus:ring-blue-500'
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <FaSpinner className="h-5 w-5 mr-3 animate-spin" />
                                    ) : (
                                        <FaCheckCircle className="h-5 w-5 mr-3" />
                                    )}
                                    {t('resetPassword.resetPassword')}
                                </motion.button>
                            </div>
                        </form>
                    </div>
                </div>
            </motion.div>
        </GuestLayout>
    );
}
