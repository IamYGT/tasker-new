import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState, useEffect } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

export default function UpdatePasswordForm({
    className = '',
    socialLogin = false,
}: {
    className?: string;
    socialLogin?: boolean;
}) {
    const { t } = useTranslation();
    const passwordInput = useRef<HTMLInputElement>(null);
    const currentPasswordInput = useRef<HTMLInputElement>(null);

    // Şifre görünürlüğü için state'ler
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // Şifre gereksinimleri için state'ler
    const [passwordRequirements, setPasswordRequirements] = useState({
        minLength: false,
        hasNumber: false,
        hasSpecial: false,
        hasLetter: false,
    });

    // Şifre eşleşmesi için state
    const [passwordsMatch, setPasswordsMatch] = useState(false);

    const { data, setData, errors, put, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    // Şifre gereksinimlerini kontrol et
    const checkPasswordRequirements = (password: string) => {
        setPasswordRequirements({
            minLength: password.length >= 8,
            hasNumber: /\d/.test(password),
            hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
            hasLetter: /[a-zA-Z]/.test(password),
        });
    };

    // Şifre gücünü kontrol et (1-3 arası)
    const checkPasswordStrength = (password: string): number => {
        let strength = 0;

        // Seviye 1 - Zayıf (minimum gereksinimler)
        if (password.length >= 8) {
            strength = 1;
        }

        // Seviye 2 - Orta (harf ve rakam)
        if (strength === 1 && /[a-zA-Z]/.test(password) && /\d/.test(password)) {
            strength = 2;
        }

        // Seviye 3 - Güçlü (özel karakter)
        if (strength === 2 && /[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            strength = 3;
        }

        return strength;
    };

    // Şifre eşleşmesini kontrol et
    useEffect(() => {
        setPasswordsMatch(
            data.password === data.password_confirmation &&
            data.password.length > 0 &&
            data.password_confirmation.length > 0
        );
    }, [data.password, data.password_confirmation]);

    // Tüm gereksinimlerin karşılanıp karşılanmadığını kontrol et
    const allRequirementsMet = Object.values(passwordRequirements).every(req => req);

    // Form gönderimi için buton durumu
    const isSubmitDisabled = () => {
        if (socialLogin) {
            return !allRequirementsMet || !passwordsMatch || processing;
        }
        return !allRequirementsMet || !passwordsMatch || !data.current_password || processing;
    };

    const updatePassword: FormEventHandler = (e) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                toast.success(t('password_updated_successfully'), {
                    position: "top-right",
                    autoClose: 1000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    onClose: () => {
                        setTimeout(() => {
                            window.location.reload();
                        }, 100);
                    }
                });
            },
            onError: (errors) => {
                toast.error(t('password_update_error'), {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                });

                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    // Şifre değiştiğinde gereksinimleri kontrol et
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newPassword = e.target.value;
        setData('password', newPassword);
        checkPasswordRequirements(newPassword);
    };

    // Şifre onayı değiştiğinde
    const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setData('password_confirmation', e.target.value);
    };

    const renderRequirement = (met: boolean, text: string) => (
        <div className="flex items-center space-x-2">
            {met ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
            ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
            )}
            <span className={`text-sm ${met ? 'text-green-600' : 'text-red-600'}`}>
                {text}
            </span>
        </div>
    );

    // Input'a tıklanma durumunu kontrol etmek için yeni state
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const renderPasswordStrengthBar = () => {
        const strength = checkPasswordStrength(data.password);
        const strengthColors = ['#EF4444', '#F59E0B', '#22C55E'];
        const strengthTexts = [
            t('password.weak'),
            t('password.medium'),
            t('password.strong')
        ];

        return (
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-2"
            >
                <div className="flex mb-1">
                    {[1, 2, 3].map((level) => (
                        <motion.div
                            key={level}
                            className="h-2 w-1/3 mr-1 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{
                                scaleX: strength >= level ? 1 : 0,
                                backgroundColor: strengthColors[strength - 1]
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
                    style={{ color: strengthColors[strength - 1] }}
                >
                    {strengthTexts[strength - 1]}
                </motion.p>
            </motion.div>
        );
    };

    return (
        <section className={`${className} p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm`}>
            <header className="mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t('ensure_long_password')}
                </p>
            </header>

            <form onSubmit={updatePassword} className="space-y-4">
                {!socialLogin && (
                    <div>
                        <InputLabel htmlFor="current_password" value={t('current_password')} />
                        <div className="relative mt-1">
                            <TextInput
                                id="current_password"
                                ref={currentPasswordInput}
                                value={data.current_password}
                                onChange={(e) => setData('current_password', e.target.value)}
                                type={showCurrentPassword ? 'text' : 'password'}
                                className="block w-full pr-10"
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                {showCurrentPassword ? (
                                    <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <EyeIcon className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.current_password ? t(errors.current_password) : ''} className="mt-1" />
                    </div>
                )}

                <div>
                    <InputLabel htmlFor="password" value={t('new_password')} />
                    <div className="relative mt-1">
                        <TextInput
                            id="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={handlePasswordChange}
                            onFocus={() => setIsPasswordFocused(true)}
                            type={showNewPassword ? 'text' : 'password'}
                            className="block w-full pr-10"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showNewPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password ? t(errors.password) : ''} className="mt-1" />

                    {isPasswordFocused && (
                        <div className="mt-2 space-y-1">
                            {renderRequirement(passwordRequirements.minLength, t('password_min_length_6'))}
                            {renderRequirement(passwordRequirements.hasLetter, t('password_letter'))}
                            {renderRequirement(passwordRequirements.hasNumber, t('password_number'))}
                            {renderRequirement(passwordRequirements.hasSpecial, t('password_special'))}
                            {renderRequirement(passwordsMatch, t('passwords_match'))}
                        </div>
                    )}
                </div>

                <div>
                    <InputLabel htmlFor="password_confirmation" value={t('confirm_password')} />
                    <div className="relative mt-1">
                        <TextInput
                            id="password_confirmation"
                            value={data.password_confirmation}
                            onChange={handleConfirmPasswordChange}
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="block w-full pr-10"
                            autoComplete="new-password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3"
                        >
                            {showConfirmPassword ? (
                                <EyeSlashIcon className="h-5 w-5 text-gray-500" />
                            ) : (
                                <EyeIcon className="h-5 w-5 text-gray-500" />
                            )}
                        </button>
                    </div>
                    <InputError message={errors.password_confirmation ? t(errors.password_confirmation) : ''} className="mt-1" />
                </div>

                <div className="flex items-center gap-4 pt-2">
                    <PrimaryButton
                        disabled={isSubmitDisabled()}
                        className={`px-3 py-1.5 ${isSubmitDisabled() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500'}`}
                    >
                        {t('save')}
                    </PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('saved')}
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
