import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import SocialAccountsList from './Partials/SocialAccountsList';
import { useTranslation } from '@/Contexts/TranslationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, KeyIcon, TrashIcon, ChevronDownIcon, LinkIcon } from '@heroicons/react/24/outline';

interface Section {
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    component: React.ComponentType<any>;
    props: any;
}

export default function Edit({
    auth,
    mustVerifyEmail,
    status,
    socialLogin,
    hasPassword,
    connectedAccounts,
}: PageProps) {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<string>('profile');

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
                socialLogin,
                hasPassword
            }
        },
        {
            id: 'password',
            title: t('update_password'),
            icon: KeyIcon,
            component: UpdatePasswordForm,
            props: {
                className: 'max-w-xl'
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
                                    className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
                                        activeSection === section.id ? 'transform rotate-180' : ''
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
        </AuthenticatedLayout>
    );
}