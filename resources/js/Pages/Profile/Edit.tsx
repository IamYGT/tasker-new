import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import {
    ChevronDownIcon,
    KeyIcon,
    TrashIcon,
    UserIcon,
} from '@heroicons/react/24/outline';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

// Base component props
interface BaseComponentProps {
    className: string;
}

// Profile form props
interface ProfileSectionProps extends BaseComponentProps {
    mustVerifyEmail: boolean;
    status?: string;
    socialLogin: boolean;
    hasPassword: boolean;
}

// Password form props
interface PasswordSectionProps extends BaseComponentProps {
    socialLogin: boolean;
}

// Delete form props
interface DeleteSectionProps extends BaseComponentProps {
    // Özel prop'lar varsa buraya eklenebilir
}

// Generic Section interface'i oluştur
interface Section<T extends BaseComponentProps> {
    id: string;
    title: string;
    icon: React.ComponentType<React.ComponentProps<any>>;
    component: React.ComponentType<T>;
    props: T;
}

// Her section için ayrı tip tanımla
type ProfileSection = Section<ProfileSectionProps>;
type PasswordSection = Section<PasswordSectionProps>;
type DeleteSection = Section<DeleteSectionProps>;

// Sections array'i için union type
type SectionType = ProfileSection | PasswordSection | DeleteSection;

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string;
    socialLogin: boolean;
    hasPassword: boolean;
}

function ErrorFallback({
    error,
    resetErrorBoundary,
}: {
    error: Error;
    resetErrorBoundary: () => void;
}): JSX.Element {
    const { t } = useTranslation();

    useEffect(() => {
        toast.error(t('error_loading_profile'));
    }, [error, t]);

    return (
        <div role="alert" className="border-l-4 border-red-400 bg-red-50 p-4">
            <p className="text-red-700">{t('error_occurred')}:</p>
            <pre className="text-sm text-red-500">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
                {t('try_again')}
            </button>
        </div>
    );
}

export default function Edit({
    auth,
    mustVerifyEmail = false,
    status,
    socialLogin = false,
    hasPassword = false,
}: PageProps<EditProps>): JSX.Element {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<string>('profile');

    useEffect(() => {
        setIsLoading(false);
    }, []);

    if (!auth?.user) {
        window.location.href = route('login');
        return null as unknown as JSX.Element;
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    const handleError = (error: Error): void => {
        console.error('Profile page error:', error);
        toast.error(t('error_loading_profile'));
    };

    const sections: SectionType[] = [
        {
            id: 'profile',
            title: t('profile_information'),
            icon: UserIcon,
            component: UpdateProfileInformationForm,
            props: {
                mustVerifyEmail,
                status,
                className: 'max-w-xl',
                socialLogin,
                hasPassword,
            },
        },
        {
            id: 'password',
            title: t('update_password'),
            icon: KeyIcon,
            component: UpdatePasswordForm,
            props: {
                className: 'max-w-xl',
                socialLogin,
            },
        },
        {
            id: 'delete',
            title: t('delete_account'),
            icon: TrashIcon,
            component: DeleteUserForm,
            props: {
                className: 'max-w-xl',
            },
        },
    ];

    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={() => window.location.reload()}
        >
            <AuthenticatedLayout
                auth={auth}
                header={
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('profile')}
                    </h2>
                }
            >
                <Head title={t('profile')} />
                <div className="py-12">
                    <div className="mx-auto max-w-3xl space-y-4 sm:px-6 lg:px-8">
                        {sections.map((section) => (
                            <motion.div
                                key={section.id}
                                className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg"
                                initial={false}
                            >
                                <button
                                    onClick={() =>
                                        setActiveSection(
                                            activeSection === section.id
                                                ? ''
                                                : section.id,
                                        )
                                    }
                                    className="flex w-full items-center justify-between p-6 text-left"
                                >
                                    <div className="flex items-center space-x-3">
                                        <section.icon className="h-6 w-6 text-gray-500" />
                                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            {section.title}
                                        </span>
                                    </div>
                                    <ChevronDownIcon
                                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                            activeSection === section.id
                                                ? 'rotate-180 transform'
                                                : ''
                                        }`}
                                    />
                                </button>

                                <AnimatePresence initial={false}>
                                    {activeSection === section.id && (
                                        <motion.div
                                            initial="collapsed"
                                            animate="open"
                                            exit="collapsed"
                                            variants={{
                                                open: {
                                                    opacity: 1,
                                                    height: 'auto',
                                                },
                                                collapsed: {
                                                    opacity: 0,
                                                    height: 0,
                                                },
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                ease: 'easeInOut',
                                            }}
                                        >
                                            <div className="border-t px-6 pb-6 dark:border-gray-700">
                                                <section.component
                                                    {...(section.props as ProfileSectionProps)}
                                                />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </AuthenticatedLayout>
        </ErrorBoundary>
    );
}
