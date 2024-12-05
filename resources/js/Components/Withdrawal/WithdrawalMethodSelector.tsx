import { useTranslation } from '@/Contexts/TranslationContext';
import { UserIban, Bank } from '@/types';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaBuildingColumns, FaWallet } from 'react-icons/fa6';
import { CryptoWithdrawalForm } from './CryptoWithdrawalForm';
import { WithdrawalForm } from './WithdrawalForm';

interface WithdrawalMethodSelectorProps {
    exchangeRate: number;
    savedIbans: UserIban[];
    banks: Bank[];
    onAmountChange: (amount: string) => void;
    onProcessingChange: (status: boolean) => void;
}

type WithdrawalMethod = 'bank' | 'crypto';

export const WithdrawalMethodSelector = ({
    exchangeRate,
    savedIbans,
    banks,
    onAmountChange,
    onProcessingChange,
}: WithdrawalMethodSelectorProps) => {
    const { t } = useTranslation();
    const [selectedMethod, setSelectedMethod] = useState<WithdrawalMethod>('bank');

    const methods = [
        {
            id: 'bank',
            name: t('withdrawal.methods.bank'),
            icon: FaBuildingColumns,
            description: t('withdrawal.methods.bankDescription'),
        },
        {
            id: 'crypto',
            name: t('withdrawal.methods.crypto'),
            icon: FaWallet,
            description: t('withdrawal.methods.cryptoDescription'),
        },
    ];

    return (
        <div className="space-y-6">
            {/* Metod Seçimi */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {methods.map((method) => (
                    <motion.div
                        key={method.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMethod(method.id as WithdrawalMethod)}
                        className={`cursor-pointer rounded-xl border-2 p-4 transition-colors ${
                            selectedMethod === method.id
                                ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                                : 'border-gray-200 hover:border-indigo-200 dark:border-gray-700 dark:hover:border-indigo-700'
                        }`}
                    >
                        <div className="flex items-center space-x-4">
                            <div
                                className={`rounded-lg p-3 ${
                                    selectedMethod === method.id
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-gray-100 text-gray-500 dark:bg-gray-800'
                                }`}
                            >
                                <method.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                    {method.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {method.description}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Seçilen Metoda Göre Form */}
            <motion.div
                key={selectedMethod}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                {selectedMethod === 'bank' ? (
                    <WithdrawalForm
                        exchangeRate={exchangeRate}
                        savedIbans={savedIbans}
                        banks={banks}
                        onAmountChange={onAmountChange}
                        onProcessingChange={onProcessingChange}
                    />
                ) : (
                    <CryptoWithdrawalForm
                        exchangeRate={exchangeRate}
                        onAmountChange={onAmountChange}
                        onProcessingChange={onProcessingChange}
                    />
                )}
            </motion.div>
        </div>
    );
};
