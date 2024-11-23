import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/TranslationContext';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            role: string;
        };
    };
}

export default function AdminDashboard({ auth }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    ...auth.user,
                    roles: [{ name: auth.user.role }]
                }
            }}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {t('sidebar.adminDashboard')}
                </h2>
            }
        >
            <Head title={t('sidebar.adminDashboard')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Admin Dashboard içeriği buraya gelecek */}
                            Admin Dashboard Content
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 