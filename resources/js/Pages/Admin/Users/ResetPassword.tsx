import InputError from '@/Components/InputError';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import { FormEventHandler, useCallback, useEffect, useState } from 'react';
import {
    FaCopy,
    FaEye,
    FaEyeSlash,
    FaKey,
    FaLock,
    FaRandom,
    FaSpinner,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ResetPasswordProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{
                name: string;
            }>;
        };
    };
    user: {
        id: number;
        name: string;
        email: string;
    };
}

export default function ResetPassword({ auth, user }: ResetPasswordProps) {
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

    const generatePassword = () => {
        const length = 16;
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const numbers = '0123456789';
        const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`"\'\\';
        const punctuation = ',.!?;:';

        let password = '';

        password += lowercase.charAt(
            Math.floor(Math.random() * lowercase.length),
        );
        password += uppercase.charAt(
            Math.floor(Math.random() * uppercase.length),
        );
        password += numbers.charAt(Math.floor(Math.random() * numbers.length));
        password += symbols.charAt(Math.floor(Math.random() * symbols.length));
        password += punctuation.charAt(
            Math.floor(Math.random() * punctuation.length),
        );

        const allChars =
            lowercase + uppercase + numbers + symbols + punctuation;
        for (let i = password.length; i < length; i++) {
            password += allChars.charAt(
                Math.floor(Math.random() * allChars.length),
            );
        }

        password = password
            .split('')
            .sort(() => Math.random() - 0.5)
            .join('');

        setData((prevData) => ({
            ...prevData,
            password: password,
            password_confirmation: password,
        }));

        setShowPassword(true);
        setShowConfirmPassword(true);
    };

    const copyPassword = () => {
        navigator.clipboard.writeText(data.password);
        toast.success(t('common.copied'));
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (passwordsMatch && passwordStrength >= 3) {
            post(
                route('admin.users.reset-password.update', { user: user.id }),
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        router.post(
                            route('admin.users.store-password'),
                            {
                                user_id: user.id,
                                password: data.password,
                                email: user.email,
                            },
                            {
                                preserveState: true,
                                preserveScroll: true,
                                onSuccess: () => {
                                    toast.success(
                                        t('users.resetPasswordSuccess'),
                                    );
                                    router.visit(route('admin.users.index'), {
                                        data: {
                                            showUserDetails: user.id,
                                            tempPassword: data.password,
                                        },
                                        preserveState: true,
                                    });
                                },
                                onError: (errors) => {
                                    console.error(
                                        'Error storing password:',
                                        errors,
                                    );
                                    toast.error(t('users.resetPasswordError'));
                                },
                            },
                        );
                    },
                    onError: () => {
                        toast.error(t('users.resetPasswordError'));
                    },
                },
            );
        }
    };

    const inputVariants = {
        focus: { scale: 1.02, transition: { duration: 0.2 } },
        blur: { scale: 1, transition: { duration: 0.2 } },
    };

    const renderPasswordStrengthBar = () => {
        const strengthColors = [
            '#EF4444',
            '#F59E0B',
            '#EAB308',
            '#84CC16',
            '#22C55E',
        ];
        const strengthTexts = [
            t('register.passwordVeryWeak'),
            t('register.passwordWeak'),
            t('register.passwordMedium'),
            t('register.passwordStrong'),
            t('register.passwordVeryStrong'),
        ];

        return (
            <div className="mt-2">
                <div className="mb-1 flex">
                    {[0, 1, 2, 3, 4].map((level) => (
                        <motion.div
                            key={level}
                            className="mr-1 h-2 w-1/5 rounded-full"
                            style={{
                                backgroundColor:
                                    level < passwordStrength
                                        ? strengthColors[
                                              Math.min(passwordStrength - 1, 4)
                                          ]
                                        : '#E5E7EB',
                                transform: `scaleX(${level < passwordStrength ? 1 : 0.5})`,
                            }}
                        />
                    ))}
                </div>
                {passwordStrength > 0 && (
                    <p
                        className="mt-1 text-xs"
                        style={{
                            color: strengthColors[
                                Math.min(passwordStrength - 1, 4)
                            ],
                        }}
                    >
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
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('users.resetPasswordFor').replace('{name}', user.name)}
                </h2>
            }
        >
            <Head title={t('users.resetPassword')} />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-xl dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-8">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Şifre Alanı */}
                                <div>
                                    <div className="flex items-center justify-between">
                                        <label
                                            htmlFor="password"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            {t('users.newPassword')}
                                        </label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={generatePassword}
                                                className="inline-flex items-center rounded bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                                            >
                                                <FaRandom className="mr-1" />
                                                {t('users.generatePassword')}
                                            </button>
                                            {data.password && (
                                                <button
                                                    type="button"
                                                    onClick={copyPassword}
                                                    className="inline-flex items-center rounded bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                                                >
                                                    <FaCopy className="mr-1" />
                                                    {t('common.copy')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="relative mt-1 rounded-md shadow-sm"
                                    >
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            id="password"
                                            name="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            className={`block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white ${
                                                data.password ? 'font-mono' : ''
                                            }`}
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword(!showPassword)
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </motion.div>
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                    {data.password &&
                                        renderPasswordStrengthBar()}
                                </div>

                                {/* Şifre Onay Alanı */}
                                <div>
                                    <label
                                        htmlFor="password_confirmation"
                                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                    >
                                        {t('users.confirmNewPassword')}
                                    </label>
                                    <motion.div
                                        variants={inputVariants}
                                        whileFocus="focus"
                                        className="relative mt-1 rounded-md shadow-sm"
                                    >
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <FaLock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type={
                                                showConfirmPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-10 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    !showConfirmPassword,
                                                )
                                            }
                                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                                        >
                                            {showConfirmPassword ? (
                                                <FaEyeSlash className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <FaEye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </motion.div>
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                    {!passwordsMatch &&
                                        data.password_confirmation && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {t('users.passwordsDontMatch')}
                                            </p>
                                        )}
                                </div>

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
                                        className="inline-flex items-center rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"
                                    >
                                        {t('common.cancel')}
                                    </motion.button>

                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        disabled={
                                            processing ||
                                            !passwordsMatch ||
                                            passwordStrength < 3
                                        }
                                        className={`inline-flex items-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-white ${
                                            processing ||
                                            !passwordsMatch ||
                                            passwordStrength < 3
                                                ? 'cursor-not-allowed bg-gray-400'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                        } `}
                                    >
                                        {processing ? (
                                            <FaSpinner className="mr-2 h-5 w-5 animate-spin" />
                                        ) : (
                                            <FaKey className="mr-2 h-5 w-5" />
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
