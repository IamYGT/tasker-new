import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { PageProps } from '@/types';

interface Props extends PageProps {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles: Array<{
                id: number;
                name: string;
            }>;
        };
    };
}

export default function Create({ auth}: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={auth}
           
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                {t('withdrawal.request')}
            </h2>}
        >
            <Head title={t('withdrawal.request')} />
            
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* Form içeriği buraya gelecek */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 