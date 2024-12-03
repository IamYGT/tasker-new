import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

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

export default function SettingsIndex({ auth }: Props) {
    const { t } = useTranslation();

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    roles: [{ name: auth.user.role }],
                    id: 0,
                    name: '',
                    email: '',
                },
            }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('admin.settings.title')}
                </h2>
            }
        >
            <Head title={t('admin.settings.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {t('admin.settings.content')}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
