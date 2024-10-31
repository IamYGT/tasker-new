import React, { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { useTranslation } from '@/Contexts/TranslationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserIcon, KeyIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

interface EditPageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit({
    mustVerifyEmail,
    status,
    auth,
}: PageProps<EditPageProps>) {
    const { t } = useTranslation();
    const [activeSection, setActiveSection] = useState<string>('profile');

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    const contentVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' },
    };

    const sections = [
        { id: 'profile', title: t('update_profile'), icon: UserIcon, color: 'indigo', component: UpdateProfileInformationForm },
        { id: 'password', title: t('update_password'), icon: KeyIcon, color: 'yellow', component: UpdatePasswordForm },
        { id: 'delete', title: t('delete_account'), icon: TrashIcon, color: 'red', component: DeleteUserForm },
    ];

    return (
        <AuthenticatedLayout>
            <Head title={t('profile')} />

            <div className="min-h-screen py-6 sm:py-12 transition-all duration-300 ease-in-out">
                <div className="mx-auto max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
                    <motion.h2
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-3xl sm:text-4xl font-extrabold leading-tight text-gray-800 dark:text-gray-200 transition-colors duration-300 mb-6 sm:mb-8"
                    >
                        {t('profile')}
                    </motion.h2>

                    {sections.map((section, index) => (
                        <motion.div
                            key={section.id}
                            initial="hidden"
                            animate="visible"
                            variants={cardVariants}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 overflow-hidden shadow-lg sm:shadow-2xl rounded-2xl sm:rounded-3xl transition-all duration-300 ease-in-out backdrop-filter backdrop-blur-lg bg-opacity-90 dark:bg-opacity-90 border border-gray-200 dark:border-gray-700"
                        >
                            <div 
                                className="p-4 sm:p-6 cursor-pointer"
                                onClick={() => setActiveSection(activeSection === section.id ? '' : section.id)}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 sm:space-x-4">
                                        <section.icon className={`h-8 w-8 sm:h-10 sm:w-10 text-${section.color}-500`} />
                                        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-200">{section.title}</h3>
                                    </div>
                                    <ChevronDownIcon 
                                        className={`h-5 w-5 sm:h-6 sm:w-6 text-gray-400 transition-transform duration-300 ${activeSection === section.id ? 'transform rotate-180' : ''}`}
                                    />
                                </div>
                            </div>
                            <AnimatePresence initial={false}>
                                {activeSection === section.id && (
                                    <motion.div
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={contentVariants}
                                        transition={{ duration: 0.3 }}
                                        className="px-4 pb-4 sm:px-6 sm:pb-6"
                                    >
                                        <section.component
                                            mustVerifyEmail={mustVerifyEmail}
                                            status={status}
                                            className="max-w-xl mx-auto"
                                        />
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