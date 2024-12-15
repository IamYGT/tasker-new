import { useTranslation } from '@/Contexts/TranslationContext';
import { router } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { FaCopy, FaInfoCircle, FaMoneyBillWave, FaQrcode } from 'react-icons/fa';
import { SiTether } from 'react-icons/si';
import { toast } from 'react-toastify';

interface FormData {
    amount_usd: string;
    wallet_address: string;
    network: string;
    type: 'crypto_withdrawal';
    exchange_rate: string;
}

interface FormErrors {
    amount_usd?: string;
    wallet_address?: string;
    network?: string;
}

interface CryptoWithdrawalFormProps {
    exchangeRate: number;
    onAmountChange: (amount: string) => void;
    onProcessingChange: (status: boolean) => void;
}

const NETWORKS = [
    { id: 'trc20', name: 'Tron (TRC20)', fee: '1', isDefault: true },

];

export const CryptoWithdrawalForm = ({
    exchangeRate,
    onAmountChange,
    onProcessingChange,
}: CryptoWithdrawalFormProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<FormData>({
        amount_usd: '',
        wallet_address: '',
        network: 'trc20',
        type: 'crypto_withdrawal',
        exchange_rate: exchangeRate.toString()
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        onAmountChange(formData.amount_usd);
    }, [formData.amount_usd, onAmountChange]);

    useEffect(() => {
        onProcessingChange(isProcessing);
    }, [isProcessing, onProcessingChange]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        router.post(route('withdrawal.store'), {
            ...formData,
            type: 'crypto_withdrawal',
            exchange_rate: exchangeRate.toString()
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setIsProcessing(false);
                toast.success(t('withdrawal.success'));
            },
            onError: (errors) => {
                setIsProcessing(false);
                setErrors(errors);
                toast.error(t('withdrawal.error'));
            },
        });
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'amount_usd') {
            onAmountChange(value);
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            handleChange('wallet_address', text);
            toast.success(t('withdrawal.crypto.addressPasted'));
        } catch (err) {
            toast.error(t('withdrawal.crypto.pasteError'));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
        >
            <div className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* USD Miktar Girişi */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('withdrawal.crypto.amount')}
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="number"
                                step="0.01"
                                min="1"
                                value={formData.amount_usd}
                                onChange={(e) => handleChange('amount_usd', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                required
                            />
                        </div>
                        {errors.amount_usd && (
                            <p className="mt-1 text-sm text-red-600">{errors.amount_usd}</p>
                        )}
                    </div>

                    {/* Network Seçimi */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('withdrawal.crypto.network')}
                        </label>
                        <div className="space-y-3">
                            {NETWORKS.map((network) => (
                                <div
                                    key={network.id}
                                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                        formData.network === network.id
                                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                                            : 'border-gray-200 hover:border-indigo-200 dark:border-gray-700 dark:hover:border-indigo-700'
                                    }`}
                                    onClick={() => handleChange('network', network.id)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <SiTether className="h-6 w-6 text-green-500" />
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                                    {network.name}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('withdrawal.crypto.fee')}: ${network.fee} USDT
                                                </p>
                                            </div>
                                        </div>
                                        <div
                                            className={`h-4 w-4 rounded-full border ${
                                                formData.network === network.id
                                                    ? 'border-indigo-500 bg-indigo-500'
                                                    : 'border-gray-300'
                                            }`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        {errors.network && (
                            <p className="mt-1 text-sm text-red-600">{errors.network}</p>
                        )}
                    </div>

                    {/* Cüzdan Adresi */}
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('withdrawal.crypto.walletAddress')}
                        </label>
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FaQrcode className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                value={formData.wallet_address}
                                onChange={(e) => handleChange('wallet_address', e.target.value)}
                                className="block w-full rounded-lg border-gray-300 pl-10 pr-20 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                placeholder={t('withdrawal.crypto.walletPlaceholder')}
                                required
                            />
                            <button
                                type="button"
                                onClick={handlePaste}
                                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
                            >
                                <FaCopy className="mr-1 h-4 w-4" />
                                {t('common.paste')}
                            </button>
                        </div>
                        {errors.wallet_address && (
                            <p className="mt-1 text-sm text-red-600">{errors.wallet_address}</p>
                        )}
                    </div>

                    {/* Uyarı Mesajı */}
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                        <div className="flex">
                            <FaInfoCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-400" />
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                    {t('withdrawal.crypto.warning.title')}
                                </h3>
                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                    <ul className="list-inside list-disc space-y-1">
                                        <li>{t('withdrawal.crypto.warning.network')}</li>
                                        <li>{t('withdrawal.crypto.warning.address')}</li>
                                        <li>{t('withdrawal.crypto.warning.fee')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Submit Butonu */}
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <>
                                    <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </svg>
                                    {t('common.processing')}
                                </>
                            ) : (
                                <>
                                    <SiTether className="mr-2 h-4 w-4" />
                                    {t('withdrawal.crypto.submit')}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </motion.div>
    );
};
