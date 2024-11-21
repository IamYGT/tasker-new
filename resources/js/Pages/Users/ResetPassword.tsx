import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaLock, FaEye, FaEyeSlash, FaSpinner, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { toast } from 'react-toastify';

interface ResetPasswordProps {
    auth: any;
    user: {
        id: number;
        name: string;
        email: string;
    };
    languages: any;
    secili_dil: any;
}

export default function ResetPassword({ auth, user, languages, secili_dil }: ResetPasswordProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { data, setData, post, processing, errors } = useForm({
        password: '',
        password_confirmation: '',
    });

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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (passwordsMatch && passwordStrength >= 3) {
            post(route('users.reset-password.update', { user: user.id }), {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success(t('users.resetPasswordSuccess'));
                    router.visit(route('users.index'));
                },
                onError: () => {
                    toast.error(t('users.resetPasswordError'));
                },
            });
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } },
    };

    const renderPasswordStrengthBar = () => {
        const strengthColors = ['#EF4444', '#F59E0B', '#EAB308', '#84CC16', '#22C55E'];
        const strengthTexts = [
            t('register.passwordVeryWeak'),
            t('register.passwordWeak'),
            t('register.passwordMedium'),
            t('register.passwordStrong'),
            t('register.passwordVeryStrong')
        ];

        return (
            <div className="mt-2">
                <div className="flex mb-1">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <motion.div
                            key={level}
                            className="h-2 w-1/5 mr-1 rounded-full"
                            style={{
                                backgroundColor: level < passwordStrength ? strengthColors[Math.min(passwordStrength - 1, 4)] : '#E5E7EB',
                                transform: `scaleX(${level < passwordStrength ? 1 : 0.5})`,
                            }}
                        />
                    ))}
                </div>
                {passwordStrength > 0 && (
                    <p className="text-xs mt-1" style={{ color: strengthColors[Math.min(passwordStrength - 1, 4)] }}>
                        {strengthTexts[Math.min(passwordStrength - 1, 4)]}
                    </p>
                )}
            </div>
        );
    };

    return (
        <AuthenticatedLayout
            auth={auth}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {t('users.resetPasswordFor').replace('{name}', user.name)}
                </h2>
            }
        >
            <Head title={t('users.resetPassword')} />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-xl sm:rounded-lg">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Şifre Alanı */}
                                <div>
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('users.newPassword')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="mt-1 relative rounded-md shadow-sm"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) => setData('password', e.target.value)}
                                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </motion.div>
                                    <InputError message={errors.password} className="mt-2" />
                                    {data.password && renderPasswordStrengthBar()}
                                </div>

                                {/* Şifre Onay Alanı */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {t('users.confirmNewPassword')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="mt-1 relative rounded-md shadow-sm"
                                    >
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) => setData('password_confirmation', e.target.value)}
                                            className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        >
                                            {showConfirmPassword ? <FaEyeSlash className="h-5 w-5 text-gray-400" /> : <FaEye className="h-5 w-5 text-gray-400" />}
                                        </button>
                                    </motion.div>
                                    <InputError message={errors.password_confirmation} className="mt-2" />
                                    {!passwordsMatch && data.password_confirmation && (
                                        <p className="text-sm text-red-600 mt-1">{t('users.passwordsDontMatch')}</p>
                                    )}
                                </div>

                                <div className="flex justify-end space-x-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="button"
                                        onClick={() => window.location.href = route('users.index')}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md font-semibold text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                        {t('common.cancel')}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={processing || !passwordsMatch || passwordStrength < 3}
                                        className={`
                                            inline-flex items-center px-4 py-2 border border-transparent rounded-md font-semibold text-sm text-white
                                            ${processing || !passwordsMatch || passwordStrength < 3
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                            }
                                        `}
                                    >
                                        {processing ? (
                                            <FaSpinner className="animate-spin h-5 w-5 mr-2" />
                                        ) : (
                                            <FaKey className="h-5 w-5 mr-2" />
                                        )}
                                        {t('users.resetPassword')}
                                    </motion.button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 