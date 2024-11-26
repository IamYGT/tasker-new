import { FormEventHandler, useState } from 'react';
import { Link, useForm, usePage } from '@inertiajs/react';
import { Transition } from '@headlessui/react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { User } from '@/types';


// Components
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import PasswordSetupForm from './PasswordSetupForm';
import EmailVerificationNotice from './EmailVerificationNotice';

// Types
interface UpdateProfileInformationProps {
    mustVerifyEmail: boolean;
    status?: string;
    className?: string;
    socialLogin: boolean;
    hasPassword: boolean;
}

interface PasswordData extends Record<string, string> {
    password: string;
    password_confirmation: string;
}

export default function UpdateProfileInformation({
    mustVerifyEmail = false,
    status,
    className = '',
    socialLogin = false,
    hasPassword = false,
}: UpdateProfileInformationProps) {
    const { t } = useTranslation();
    const user = usePage<{ auth: { user: User } }>().props.auth.user;
    
    // Prop kontrolü
    if (!user) {
        return null; // veya loading component'i
    }

    // State
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [passwordData, setPasswordData] = useState<PasswordData>({
        password: '',
        password_confirmation: ''
    });

    // Form handling
    const { data, setData, patch, post, errors, processing, recentlySuccessful } = useForm({
        name: user.name,
        email: user.email,
    });

    // Event handlers
    const handleProfileUpdate: FormEventHandler = (e) => {
        e.preventDefault();
        patch(route('profile.update'));
    };

    const handlePasswordSet: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('profile.set-password'), {
            data: passwordData,
            onSuccess: () => {
                setShowPasswordForm(false);
                setPasswordData({ password: '', password_confirmation: '' });
            }
        });
    };

    const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    return (
        <section className={className}>
            {/* Header */}
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('profile_information')}
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {t('update_profile_info')}
                </p>
            </header>

            {/* Profile Form */}
            <form onSubmit={handleProfileUpdate} className="mt-6 space-y-6">
                {/* Name Input */}
                <div>
                    <InputLabel htmlFor="name" value={t('name')} />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        isFocused
                        autoComplete="name"
                    />
                    <InputError className="mt-2" message={errors.name && t(errors.name)} />
                </div>

                {/* Email Input */}
                <div>
                    <InputLabel htmlFor="email" value={t('email')} />
                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />
                    <InputError className="mt-2" message={errors.email && t(errors.email)} />
                </div>

                {/* Email Verification Notice */}
                {mustVerifyEmail && user.email_verified_at === null && (
                    <EmailVerificationNotice status={status} />
                )}

                {/* Submit Button */}
                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>{t('save')}</PrimaryButton>
                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out"
                        enterFrom="opacity-0"
                        leave="transition ease-in-out"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">{t('saved')}</p>
                    </Transition>
                </div>
            </form>

            {/* Password Setup Section */}
            {Boolean(socialLogin) && !Boolean(hasPassword) && (
                <div className="mt-6">
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-yellow-700">{t('social_login_password_notice')}</p>
                                <button
                                    onClick={() => setShowPasswordForm(true)}
                                    className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-600"
                                >
                                    {t('set_password')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Password Setup Form */}
            {showPasswordForm && (
                <PasswordSetupForm
                    passwordData={passwordData}
                    onSubmit={handlePasswordSet}
                    onChange={handlePasswordInputChange}
                />
            )}
        </section>
    );
}