import React, { useState, useEffect, useCallback } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaSpinner, FaUserPlus, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';

interface RegisterProps {
    languages: any;
    secili_dil: any;
}

export default function Register({ languages, secili_dil }: RegisterProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [registrationSuccess, setRegistrationSuccess] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const validateEmail = useCallback((email: string) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }, []);

    useEffect(() => {
        setIsValidEmail(validateEmail(data.email));
    }, [data.email, validateEmail]);

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
        if (registrationSuccess) {
            const timer = setTimeout(() => {
                window.location.href = route('login');
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [registrationSuccess]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (passwordsMatch && isValidEmail && passwordStrength >= 3) {
            post(route('register'), {
                onSuccess: () => {
                    setRegistrationSuccess(true);
                },
                onError: () => {
                    // Hata durumunda yapılacak işlemler
                },
            });
        }
    };



    const inputVariants = {
        focus: { scale: 1.02, boxShadow: '0px 0px 8px rgba(59, 130, 246, 0.5)', transition: { duration: 0.2 } },
        blur: { scale: 1, boxShadow: 'none', transition: { duration: 0.2 } },
        tap: { scale: 0.98, transition: { duration: 0.1 } }
    };

    const buttonVariants = {
        idle: { scale: 1 },
        hover: { scale: 1.05 },
        tap: { scale: 0.95 }
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

    const renderInput = (
        name: 'name' | 'email' | 'password' | 'password_confirmation',
        icon: React.ReactNode,
        type: string,
        placeholder: string,
        showPasswordToggle = false
    ) => (
        <motion.div
            variants={inputVariants}
            initial="blur"
            whileFocus="focus"
            whileTap="tap"
            animate="blur"
            className="mb-4"
        >
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t(`register.${name}`)}
            </label>
            <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {icon}
                </div>
                <input
                    id={name}
                    type={showPasswordToggle ? (name === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')) : type}
                    name={name}
                    value={data[name]}
                    onChange={(e) => {
                        setData(name, e.target.value);
                        if (name === 'password') {
                            setPasswordStrength(checkPasswordStrength(e.target.value));
                        }
                    }}
                    className={`block w-full pl-10 pr-${showPasswordToggle ? '10' : '3'} py-2 sm:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 dark:bg-gray-700 dark:text-white bg-white text-gray-900 border-gray-300 dark:border-gray-600 transition duration-200 ${name === 'password_confirmation' && !passwordsMatch && data.password_confirmation
                        ? 'border-red-500 dark:border-red-700'
                        : ''
                        }`}
                    placeholder={t(`register.${placeholder}`)}
                    required
                />
                {showPasswordToggle && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none focus:text-gray-500 dark:text-gray-300 dark:hover:text-gray-200 dark:focus:text-gray-200"
                        >
                            {(name === 'password' ? showPassword : showConfirmPassword) ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                        </motion.button>
                    </div>
                )}
                {name === 'email' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {isValidEmail ? (
                            <FaCheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                            data.email && <FaTimesCircle className="h-5 w-5 text-red-500" />
                        )}
                    </div>
                )}
            </div>
            <InputError message={errors[name]} className="mt-2" />
            {name === 'password' && data.password && renderPasswordStrengthBar()}
            {name === 'password_confirmation' && !passwordsMatch && data.password_confirmation && (
                <p className="text-xs mt-1 text-red-500">{t('register.passwordsDontMatch')}</p>
            )}
        </motion.div>
    );

    return (
        <GuestLayout languages={languages} secili_dil={secili_dil}>
            <Head title={t('register.title')} />

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
                                className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center"
                            >
                                {t('register.createAccount')}
                            </motion.h2>
                        </AnimatePresence>

                        <form onSubmit={submit} className="space-y-6">
                            {renderInput('name', <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />, 'text', 'namePlaceholder')}
                            {renderInput('email', <FaEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />, 'email', 'emailPlaceholder')}
                            {renderInput('password', <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />, 'password', 'passwordPlaceholder', true)}
                            {renderInput('password_confirmation', <FaLock className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />, 'password', 'confirmPasswordPlaceholder', true)}

                            <div>
                                <motion.button
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={processing || !isValidEmail || passwordStrength < 3 || !passwordsMatch || registrationSuccess}
                                    className={`
                                        w-full flex justify-center items-center py-3 px-4 
                                        text-sm font-medium 
                                        text-white
                                        rounded-lg
                                        transition-all duration-200 ease-in-out
                                        ${processing || !isValidEmail || passwordStrength < 3 || !passwordsMatch || registrationSuccess
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <FaSpinner className="h-5 w-5 mr-3 animate-spin" />
                                    ) : registrationSuccess ? (
                                        <FaCheckCircle className="h-5 w-5 mr-3" />
                                    ) : (
                                        <FaUserPlus className="h-5 w-5 mr-3" />
                                    )}
                                    {registrationSuccess ? t('register.redirecting') : t('register.register')}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                        {t('register.orContinueWith')}
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
                                        className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md shadow-sm                                        bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <FaGoogle className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">Google</span>
                                    </a>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <a
                                        href="#"
                                        className="w-full inline-flex justify-center items-center py-2 px-4 rounded-md shadow-sm
                                        bg-white dark:bg-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <FaGithub className="h-5 w-5 mr-2" />
                                        <span className="text-sm font-medium">GitHub</span>
                                    </a>
                                </motion.div>
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <Link
                                href={route('login')}
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {t('register.alreadyRegistered')}
                            </Link>
                        </div>
                    </div>
                </div>
            </motion.div>
        </GuestLayout>
    );
}