import React, { useState, useEffect, useCallback } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner, FaUserPlus, FaCheckCircle, FaTimesCircle, FaKey } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import { toast } from 'react-toastify';

interface CreateUserProps {
    auth: any;
    languages: any;
    secili_dil: any;
}

interface FormData {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
}

type FormField = keyof FormData;

interface InputProps {
    name: FormField;
    icon: React.ReactNode;
    type: string;
    placeholder: string;
    showPasswordToggle?: boolean;
}

export default function CreateUser({ auth, languages, secili_dil }: CreateUserProps) {
    const { t } = useTranslation();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [isValidEmail, setIsValidEmail] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const { data, setData, post, processing, errors, reset } = useForm<FormData>({
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

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (passwordsMatch && isValidEmail && passwordStrength >= 3) {
            post(route('admin.users.store'), {
                onSuccess: () => {
                    toast.success(t('users.createSuccess'));
                    router.visit(route('admin.users.index'));
                },
                onError: () => {
                    toast.error(t('users.createError'));
                },
            });
        }
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
                            className="h-2 w-1/5 mr-1 rounded-full"
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

    const renderInput = ({ name, icon, type, placeholder, showPasswordToggle = false }: InputProps) => (
        <motion.div
            whileFocus="focus"
            animate="blur"
            className="mb-4"
        >
            <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t(`users.${name}`)}
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
                    className={`block w-full pl-10 pr-${showPasswordToggle ? '10' : '3'} py-2 sm:text-sm rounded-md
                        focus:ring-blue-500 focus:border-blue-500
                        dark:focus:ring-blue-400 dark:focus:border-blue-400
                        dark:bg-gray-700 dark:text-white bg-white text-gray-900
                        border-gray-300 dark:border-gray-600 transition duration-200
                        ${name === 'password_confirmation' && !passwordsMatch && data.password_confirmation ? 'border-red-500' : ''}`}
                    required
                />
                {showPasswordToggle && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => name === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}
                            className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                            {(name === 'password' ? showPassword : showConfirmPassword) ?
                                <FaEyeSlash className="h-5 w-5" /> :
                                <FaEye className="h-5 w-5" />}
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
                <p className="text-xs mt-1 text-red-500">{t('users.passwordsDontMatch')}</p>
            )}
        </motion.div>
    );

    const togglePasswordVisibility = (field: 'password' | 'password_confirmation') => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    const generatePassword = () => {
        const length = 12;
        const charset = {
            numbers: '0123456789',
            lowercase: 'abcdefghijklmnopqrstuvwxyz',
            uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
            special: '!@#$%^&*'
        };

        let password = '';
        password += charset.lowercase.charAt(Math.floor(Math.random() * charset.lowercase.length));
        password += charset.uppercase.charAt(Math.floor(Math.random() * charset.uppercase.length));
        password += charset.numbers.charAt(Math.floor(Math.random() * charset.numbers.length));
        password += charset.special.charAt(Math.floor(Math.random() * charset.special.length));

        const allChars = Object.values(charset).join('');
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(Math.floor(Math.random() * allChars.length));
        }

        password = password.split('').sort(() => Math.random() - 0.5).join('');

        setData(prevData => ({
            ...prevData,
            password: password,
            password_confirmation: password
        }));

        setPasswordStrength(checkPasswordStrength(password));
        setPasswordsMatch(true);

        toast.success(t('users.passwordGenerated'), {
            position: "top-right",
            autoClose: 2000
        });
    };

    const renderPasswordField = () => (
        <div className="mt-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                {t('users.password')}
            </label>
            <div className="relative mt-1 flex">
                <div className="relative flex-1">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        id="password"
                        value={data.password}
                        onChange={(e) => {
                            setData('password', e.target.value);
                            setPasswordStrength(checkPasswordStrength(e.target.value));
                        }}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 sm:text-sm pr-10"
                    />
                    <button
                        onClick={() => togglePasswordVisibility('password')}
                        type="button"
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
                    >
                        {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                    </button>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={generatePassword}
                    className="ml-2 inline-flex items-center rounded-md border border-transparent bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-900 dark:text-indigo-200 dark:hover:bg-indigo-800"
                >
                    <FaKey className="mr-2 h-4 w-4" />
                    {t('users.generatePassword')}
                </motion.button>
            </div>
            <InputError message={errors.password} className="mt-2" />
            {data.password && renderPasswordStrengthBar()}
        </div>
    );

    return (
        <AuthenticatedLayout auth={auth} header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('users.createNew')}</h2>}>
            <Head title={t('users.createNew')} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="py-12"
            >
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-3xl overflow-hidden backdrop-filter backdrop-blur-lg bg-opacity-30 dark:bg-opacity-30 border border-gray-200 dark:border-gray-700">
                        <div className="p-8">
                            <motion.h2
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-4xl font-extrabold text-gray-900 dark:text-white mb-8 text-center"
                            >
                                {t('users.createNew')}
                            </motion.h2>

                            <form onSubmit={submit} className="space-y-6">
                                {renderInput({
                                    name: 'name',
                                    icon: <FaUser className="h-5 w-5 text-gray-400" />,
                                    type: 'text',
                                    placeholder: 'name'
                                })}
                                {renderInput({
                                    name: 'email',
                                    icon: <FaEnvelope className="h-5 w-5 text-gray-400" />,
                                    type: 'email',
                                    placeholder: 'email'
                                })}
                                {renderPasswordField()}
                                {renderInput({
                                    name: 'password_confirmation',
                                    icon: <FaLock className="h-5 w-5 text-gray-400" />,
                                    type: 'password',
                                    placeholder: 'confirmPassword',
                                    showPasswordToggle: true
                                })}

                                <motion.button
                                    variants={buttonVariants}
                                    initial="idle"
                                    whileHover="hover"
                                    whileTap="tap"
                                    type="submit"
                                    disabled={processing || !isValidEmail || passwordStrength < 3 || !passwordsMatch}
                                    className={`
                                        w-full flex justify-center items-center py-3 px-4
                                        text-sm font-medium text-white rounded-lg
                                        transition-all duration-200 ease-in-out
                                        ${processing || !isValidEmail || passwordStrength < 3 || !passwordsMatch
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'
                                        }
                                    `}
                                >
                                    {processing ? (
                                        <FaSpinner className="h-5 w-5 mr-3 animate-spin" />
                                    ) : (
                                        <FaUserPlus className="h-5 w-5 mr-3" />
                                    )}
                                    {t('users.create')}
                                </motion.button>
                            </form>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
