import { useTranslation } from '@/Contexts/TranslationContext';
import type { PageProps, Bank } from '@/types';
import turkeyBanksData from '@/Data/turkey_banks.json';
import { useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import {
    FaCheck,
    FaCopy,
    FaCreditCard,
    FaExclamationTriangle,
    FaInfoCircle,
    FaMoneyBillWave,
    FaUniversity,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface FormData {
    amount_usd: string;
    bank_id: string;
    bank_account: string;
    type: string;
}

interface UserIban {
    id: number;
    bank_id: string;
    iban: string;
    title: string | null;
    is_default: boolean;
    is_active: boolean;
    bank_details: {
        name: string;
        code: string;
        swift: string;
    };
}

interface WithdrawalFormProps {
    exchangeRate: number;
    savedIbans: UserIban[];
    onAmountChange: (amount: string) => void;
    onProcessingChange: (status: boolean) => void;
}

// JSON verisi için type assertion
interface TurkeyBanks {
    banks: Array<Bank>;
}

const turkeyBanks: TurkeyBanks = {
    banks: (turkeyBanksData as any).banks || []
};

// IBAN yardımcı fonksiyonları
const formatIBAN = (iban: string): string => {
    const cleaned = iban.replace(/\s/g, '');
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
};

const validateIBAN = (iban: string): boolean => {
    // IBAN formatını kontrol et
    const ibanRegex = /^TR[0-9]{24}$/;
    const cleaned = iban.replace(/\s/g, '').toUpperCase();

    if (!ibanRegex.test(cleaned)) {
        return false;
    }

    // IBAN algoritması kontrolü
    const reformat = cleaned.slice(4) + cleaned.slice(0, 4);
    const digits = reformat
        .split('')
        .map((d) => {
            const code = d.charCodeAt(0);
            return code >= 65 ? code - 55 : d;
        })
        .join('');

    let remainder = '';
    for (let i = 0; i < digits.length; i++) {
        remainder = remainder + digits[i];
        const temp = parseInt(remainder, 10);
        remainder = (temp % 97).toString();
    }

    return parseInt(remainder, 10) === 1;
};

export const WithdrawalForm = ({
    exchangeRate,
    savedIbans,
    onAmountChange,
    onProcessingChange,
}: WithdrawalFormProps) => {
    const { t } = useTranslation();
    const [ibanValid, setIbanValid] = useState<boolean | null>(null);
    const [showIbanFeedback, setShowIbanFeedback] = useState(false);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        amount_usd: '',
        bank_id: '',
        bank_account: '',
        type: 'bank_withdrawal',
    });

    // Amount değişikliklerini parent componente bildir
    useEffect(() => {
        onAmountChange(data.amount_usd);
    }, [data.amount_usd, onAmountChange]);

    // IBAN değişikliklerini izle ve validasyon yap
    useEffect(() => {
        if (data.bank_account) {
            const isValid = validateIBAN(data.bank_account);
            setIbanValid(isValid);
            setShowIbanFeedback(true);
        } else {
            setShowIbanFeedback(false);
        }
    }, [data.bank_account]);

    // IBAN'ı panoya kopyala
    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t('common.copied'));
        } catch (err) {
            toast.error(t('common.copyError'));
        }
    };

    // IBAN'ı yapıştır
    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            handleIbanChange(text);
            toast.success(t('withdrawal.ibanPasted'));
        } catch (err) {
            toast.error(t('withdrawal.pasteError'));
        }
    };

    // IBAN değişikliğini handle et
    const handleIbanChange = (value: string) => {
        // TR prefix'ini otomatik ekle
        let formattedValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();
        if (formattedValue && !formattedValue.startsWith('TR')) {
            formattedValue = 'TR' + formattedValue;
        }

        // IBAN uzunluk kontrolü
        if (formattedValue.length > 26) {
            formattedValue = formattedValue.slice(0, 26);
        }

        // IBAN validasyonu
        if (formattedValue.length === 26) {
            const isValid = validateIBAN(formattedValue);
            setIbanValid(isValid);
            setShowIbanFeedback(true);

            if (isValid) {
                toast.success(t('withdrawal.validIBAN'));
            } else {
                toast.error(t('withdrawal.invalidIBAN'));
            }
        } else {
            setIbanValid(null);
            setShowIbanFeedback(false);
        }

        setData('bank_account', formattedValue);
    };

    // Form submit handler'ı ekle
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onProcessingChange(true);

        post(route('withdrawal.store'), {
            onSuccess: () => {
                onProcessingChange(false);
                toast.success(t('withdrawal.requestCreated'));
            },
            onError: () => {
                onProcessingChange(false);
                toast.error(t('withdrawal.createError'));
            },
        });
    };

    useEffect(() => {
        onProcessingChange(processing);
    }, [processing, onProcessingChange]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800"
        >
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* USD Miktar Girişi */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        {t('withdrawal.amount')}
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="number"
                            step="0.01"
                            min="1"
                            value={data.amount_usd}
                            onChange={(e) => setData('amount_usd', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            required
                        />
                    </div>
                    {errors.amount_usd && (
                        <p className="mt-1 text-sm text-red-600">{errors.amount_usd}</p>
                    )}
                </div>

                {/* Banka Seçimi */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        {t('withdrawal.selectBank')}
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaUniversity className="h-5 w-5 text-gray-400" />
                        </div>
                        <select
                            value={data.bank_id}
                            onChange={(e) => setData('bank_id', e.target.value)}
                            className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                            required
                        >
                            <option value="">{t('common.select')}</option>
                            {turkeyBanks.banks.map((bank: Bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {errors.bank_id && (
                        <p className="mt-1 text-sm text-red-600">{errors.bank_id}</p>
                    )}
                </div>

                {/* Kayıtlı IBAN'lar */}
                {savedIbans.length > 0 && (
                    <div>
                        <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                            {t('withdrawal.savedIbans')}
                        </label>
                        <div className="space-y-3">
                            {savedIbans.map((iban) => (
                                <div
                                    key={iban.id}
                                    onClick={() => {
                                        setData({
                                            ...data,
                                            bank_id: iban.bank_id,
                                            bank_account: iban.iban,
                                        });
                                    }}
                                    className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                                        data.bank_account === iban.iban
                                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                                            : 'border-gray-200 hover:border-indigo-200 dark:border-gray-700 dark:hover:border-indigo-700'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                                <FaCreditCard className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {iban.bank_details.name}
                                                    {iban.is_default && (
                                                        <span className="ml-2 text-xs text-indigo-600 dark:text-indigo-400">
                                                            ({t('common.default')})
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="font-mono text-sm text-gray-500 dark:text-gray-400">
                                                    {formatIBAN(iban.iban)}
                                                </div>
                                                {iban.title && (
                                                    <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                        {iban.title}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {data.bank_account === iban.iban && (
                                            <FaCheck className="h-5 w-5 text-indigo-600" />
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Manuel IBAN Girişi */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                        {t('withdrawal.manualIban')}
                    </label>
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <FaCreditCard
                                className={`h-5 w-5 ${
                                    ibanValid === true
                                        ? 'text-green-500'
                                        : ibanValid === false
                                        ? 'text-red-500'
                                        : 'text-gray-400'
                                }`}
                            />
                        </div>
                        <input
                            type="text"
                            value={formatIBAN(data.bank_account)}
                            onChange={(e) => handleIbanChange(e.target.value)}
                            className={`block w-full rounded-lg border pl-10 pr-20 uppercase focus:ring-2 ${
                                ibanValid === true
                                    ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                                    : ibanValid === false
                                    ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                            } dark:border-gray-600 dark:bg-gray-700`}
                            placeholder="TR00 0000 0000 0000 0000 0000 00"
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
                    {showIbanFeedback && (
                        <div className="mt-2 flex items-center space-x-2">
                            {ibanValid ? (
                                <>
                                    <FaCheck className="h-4 w-4 text-green-500" />
                                    <span className="text-sm text-green-500">
                                        {t('withdrawal.validIBAN')}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <FaExclamationTriangle className="h-4 w-4 text-red-500" />
                                    <span className="text-sm text-red-500">
                                        {t('withdrawal.invalidIBAN')}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                    {errors.bank_account && (
                        <p className="mt-1 text-sm text-red-600">{errors.bank_account}</p>
                    )}
                </div>

                {/* Submit Butonu */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={processing || !data.amount_usd || !data.bank_id || !data.bank_account}
                        className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {processing ? (
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
                                <FaMoneyBillWave className="mr-2 h-4 w-4" />
                                {t('withdrawal.submit')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};
