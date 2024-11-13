import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SocialAccountsList from './Partials/SocialAccountsList';
import { useTranslation } from '@/Contexts/TranslationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, KeyIcon, TrashIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/24/outline';
import { ErrorBoundary } from 'react-error-boundary';
import { toast } from 'react-toastify';

interface Section {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any>;
    props: any;
}

interface EditProps {
    mustVerifyEmail: boolean;
    status?: string;
    socialLogin: boolean;
    hasPassword: boolean;
    connectedAccounts?: any;
}

function ErrorFallback({ error, resetErrorBoundary }: { error: Error, resetErrorBoundary: () => void }) {
    const { t } = useTranslation();

    useEffect(() => {
        toast.error(t('error_loading_profile'));
    }, [error]);

    return (
        <div role="alert" className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{t('error_occurred')}:</p>
            <pre className="text-sm text-red-500">{error.message}</pre>
            <button
                onClick={resetErrorBoundary}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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
    connectedAccounts = [],
}: PageProps<EditProps>) {
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(true);
    const [activeSection, setActiveSection] = useState<string>('profile');

    useEffect(() => {
        // Component mount olduğunda
        setIsLoading(false);
    }, []);

    if (!auth?.user) {
        window.location.href = route('login');
        return null;
    }

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    const handleError = (error: Error) => {
        console.error('Profile page error:', error);
        toast.error(t('error_loading_profile'));
    };

    const sections: Section[] = [
        {
            id: 'profile',
            title: t('profile_information'),
            icon: UserIcon,
            component: UpdateProfileInformationForm,
            props: {
                mustVerifyEmail,
                status,
                className: 'max-w-xl',
                socialLogin: socialLogin || false,
                hasPassword: hasPassword || false
            }
        },
        {
            id: 'password',
            title: t('update_password'),
            icon: KeyIcon,
            component: UpdatePasswordForm,
            props: {
                className: 'max-w-xl',
                socialLogin: socialLogin || false
            }
        },
        {
            id: 'delete',
            title: t('delete_account'),
            icon: TrashIcon,
            component: DeleteUserForm,
            props: {
                className: 'max-w-xl'
            }
        }
    ];
    return (
        <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onError={handleError}
            onReset={() => window.location.reload()}
        >
            <AuthenticatedLayout
                auth={auth}
                header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">{t('profile')}</h2>}
            >
                <Head title={t('profile')} />
                <div className="py-12">
                    <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-4">
                        {sections.map((section) => (
                            <motion.div
                                key={section.id}
                                className="overflow-hidden bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg"
                                initial={false}
                            >
                                <button
                                    onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                                    className="w-full p-6 flex items-center justify-between text-left"
                                >
                                    <div className="flex items-center space-x-3">
                                        <section.icon className="h-6 w-6 text-gray-500" />
                                        <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                            {section.title}
                                        </span>
                                    </div>
                                    <ChevronDownIcon
                                        className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${activeSection === section.id ? 'transform rotate-180' : ''
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
                                                open: { opacity: 1, height: "auto" },
                                                collapsed: { opacity: 0, height: 0 }
                                            }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                        >
                                            <div className="px-6 pb-6 border-t dark:border-gray-700">
                                                <section.component {...section.props} />
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
                </AuthenticatedLayout >
        </ErrorBoundary>
        
    );
}
