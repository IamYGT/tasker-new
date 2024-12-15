import { WithdrawalMethodSelector } from '@/Components/Withdrawal/WithdrawalMethodSelector';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import { Bank, UserIban } from '@/types';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
        };
    };
    exchangeRate: number;
    savedIbans: UserIban[];
    banks: Bank[];
}

export default function WithdrawalRequest({
    auth,
    exchangeRate,
    savedIbans,
    banks,
}: Props) {
    const { t } = useTranslation();
    const [amount, setAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessingChange = (status: boolean) => {
        setIsLoading(status);
    };

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('withdrawal.request.title')}
                </h2>
            }
        >
            <Head title={t('withdrawal.request.title')} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <WithdrawalMethodSelector
                        exchangeRate={exchangeRate}
                        savedIbans={savedIbans}
                        banks={banks}
                        onAmountChange={setAmount}
                        onProcessingChange={handleProcessingChange}
                    />
                </div>
            </div>

            {/* Yükleme Animasyonu */}
            <AnimatePresence>
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="rounded-xl bg-white p-6 shadow-xl dark:bg-gray-800"
                        >
                            <div className="flex flex-col items-center">
                                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"></div>
                                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {t('withdrawal.processing')}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AuthenticatedLayout>
    );
}
