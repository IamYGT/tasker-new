import { useTranslation } from '@/Contexts/TranslationContext';
import turkeyBanks from '@/Data/turkey_banks.json';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
    FaCheck,
    FaCopy,
    FaCreditCard,
    FaDollarSign,
    FaEuroSign,
    FaExchangeAlt,
    FaExclamationTriangle,
    FaInfoCircle,
    FaLiraSign,
    FaMoneyBillWave,
    FaUniversity,
} from 'react-icons/fa';

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
    savedIbans: UserIban[]; // Kullanıcının kayıtlı IBAN'ları
}

interface FormData {
    amount_usd: string;
    bank_id: string;
    bank_account: string;
}

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

// Currency Converter komponenti
const CurrencyConverter = ({
    amount,
    exchangeRate,
    t,
}: {
    amount: string;
    exchangeRate: number;
    t: (key: string) => string;
}) => {
    const euroRate = 0.92;

    const amountNumber = parseFloat(amount || '0');
    const tryAmount = amountNumber * exchangeRate;
    const eurAmount = amountNumber * euroRate;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 p-6 shadow-sm dark:from-gray-800 dark:to-gray-700"
        >
            <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t('withdrawal.currencyInfo')}
                </h3>
                <FaExchangeAlt className="h-5 w-5 text-gray-400" />
            </div>

            <div className="mb-6 rounded-lg bg-white p-4 shadow-sm dark:bg-gray-800">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <FaInfoCircle className="mr-2 h-4 w-4 text-blue-500" />
                    {t('withdrawal.usdOnlyInfo')}
                </div>
            </div>

            <div className="space-y-4">
                {/* USD Gösterimi */}
                <motion.div
                    className="flex items-center justify-between rounded-lg bg-green-50 p-4 dark:bg-green-900/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="flex items-center">
                        <FaDollarSign className="mr-2 h-5 w-5 text-green-600 dark:text-green-400" />
                        <span className="font-medium text-green-800 dark:text-green-200">
                            USD
                        </span>
                    </div>
                    <span className="text-lg font-bold text-green-800 dark:text-green-200">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                        }).format(amountNumber)}
                    </span>
                </motion.div>

                {/* EUR Dönüşümü */}
                <motion.div
                    className="flex items-center justify-between rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="flex items-center">
                        <FaEuroSign className="mr-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                        <span className="font-medium text-blue-800 dark:text-blue-200">
                            EUR
                        </span>
                    </div>
                    <span className="text-lg font-bold text-blue-800 dark:text-blue-200">
                        {new Intl.NumberFormat('de-DE', {
                            style: 'currency',
                            currency: 'EUR',
                        }).format(eurAmount)}
                    </span>
                </motion.div>

                {/* TRY Dönüşümü */}
                <motion.div
                    className="flex items-center justify-between rounded-lg bg-red-50 p-4 dark:bg-red-900/20"
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                >
                    <div className="flex items-center">
                        <FaLiraSign className="mr-2 h-5 w-5 text-red-600 dark:text-red-400" />
                        <span className="font-medium text-red-800 dark:text-red-200">
                            TRY
                        </span>
                    </div>
                    <span className="text-lg font-bold text-red-800 dark:text-red-200">
                        {new Intl.NumberFormat('tr-TR', {
                            style: 'currency',
                            currency: 'TRY',
                        }).format(tryAmount)}
                    </span>
                </motion.div>

                {/* Kur Bilgileri */}
                <div className="mt-4 rounded-lg bg-gray-100 p-4 text-sm dark:bg-gray-700/50">
                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                        <span>1 USD = {exchangeRate.toFixed(2)} TRY</span>
                        <span>1 USD = {euroRate.toFixed(2)} EUR</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function WithdrawalRequest({
    auth,
    exchangeRate,
    savedIbans,
}: Props) {
    const { t } = useTranslation();
    const [tryAmount, setTryAmount] = useState<string>('');
    const [ibanValid, setIbanValid] = useState<boolean | null>(null);
    const [showIbanFeedback, setShowIbanFeedback] = useState(false);

    const { data, setData, post, processing, errors } = useForm<FormData>({
        amount_usd: '',
        bank_id: '',
        bank_account: '',
    });

    // IBAN seçimi için state
    const [selectedIban] = useState<UserIban | null>(
        savedIbans.find((iban) => iban.is_default) || null,
    );

    // IBAN seçildiğinde form verilerini güncelle
    useEffect(() => {
        if (selectedIban) {
            setData({
                ...data,
                bank_id: selectedIban.bank_id,
                bank_account: selectedIban.iban,
            });
        }
    }, [data, selectedIban, setData]);

    // USD miktarı değiştiğinde TL miktarını hesapla
    useEffect(() => {
        if (data.amount_usd) {
            const tryValue = (
                parseFloat(data.amount_usd) * exchangeRate
            ).toFixed(2);
            setTryAmount(tryValue);
        } else {
            setTryAmount('');
        }
    }, [data.amount_usd, exchangeRate]);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('withdrawal.store'), {
            onSuccess: () => {
                toast.success(t('withdrawal.request.success'));
            },
            onError: () => {
                toast.error(t('withdrawal.request.error'));
            },
        });
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
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Form Alanı */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800"
                        >
                            <div className="p-6">
                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                                    {/* USD Miktar Girişi */}
                                    <div>
                                        <label
                                            htmlFor="amount_usd"
                                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            {t('withdrawal.request.amountUSD')}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaMoneyBillWave className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="number"
                                                id="amount_usd"
                                                step="0.01"
                                                min="1"
                                                value={data.amount_usd}
                                                onChange={(e) =>
                                                    setData(
                                                        'amount_usd',
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                                required
                                            />
                                        </div>
                                        {tryAmount && (
                                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                                ≈{' '}
                                                {new Intl.NumberFormat(
                                                    'tr-TR',
                                                    {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    },
                                                ).format(parseFloat(tryAmount))}
                                                <span className="ml-2 text-xs">
                                                    (1 USD ={' '}
                                                    {exchangeRate.toFixed(2)}{' '}
                                                    TRY)
                                                </span>
                                            </p>
                                        )}
                                        {errors.amount_usd && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.amount_usd}
                                            </p>
                                        )}
                                    </div>

                                    {/* Banka Seçimi */}
                                    <div>
                                        <label
                                            htmlFor="bank_id"
                                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            {t('withdrawal.request.selectBank')}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaUniversity className="h-5 w-5 text-gray-400" />
                                            </div>
                                            <select
                                                id="bank_id"
                                                value={data.bank_id}
                                                onChange={(e) =>
                                                    setData(
                                                        'bank_id',
                                                        e.target.value,
                                                    )
                                                }
                                                className="block w-full rounded-lg border-gray-300 pl-10 focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
                                                required
                                            >
                                                <option value="">
                                                    {t('common.select')}
                                                </option>
                                                {turkeyBanks.banks.map(
                                                    (bank) => (
                                                        <option
                                                            key={bank.id}
                                                            value={bank.id}
                                                        >
                                                            {bank.name}
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </div>
                                        {errors.bank_id && (
                                            <p className="mt-1 text-sm text-red-600">
                                                {errors.bank_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* IBAN Girişi - Güncellenmiş Versiyon */}
                                    <div>
                                        <label
                                            htmlFor="bank_account"
                                            className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                        >
                                            {t('withdrawal.request.iban')}
                                        </label>
                                        <div className="relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                                <FaCreditCard
                                                    className={`h-5 w-5 ${
                                                        ibanValid === true
                                                            ? 'text-green-500'
                                                            : ibanValid ===
                                                                false
                                                              ? 'text-red-500'
                                                              : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                id="bank_account"
                                                value={formatIBAN(
                                                    data.bank_account,
                                                )}
                                                onChange={(e) =>
                                                    handleIbanChange(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                                                className={`block w-full rounded-lg border pl-10 pr-32 uppercase focus:ring-2 ${
                                                    ibanValid === true
                                                        ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                                                        : ibanValid === false
                                                          ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                                          : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                                } dark:border-gray-600 dark:bg-gray-700`}
                                                required
                                            />
                                            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                                                {/* Yapıştır Butonu - Daha anlaşılır versiyon */}
                                                <button
                                                    type="button"
                                                    onClick={handlePaste}
                                                    className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100"
                                                    title={t('common.paste')}
                                                >
                                                    <FaCopy className="mr-1.5 h-4 w-4" />
                                                    {t('common.paste')}
                                                </button>
                                                {/* Validasyon İkonu */}
                                                {showIbanFeedback && (
                                                    <div className="flex items-center">
                                                        {ibanValid ? (
                                                            <div className="flex items-center text-green-500">
                                                                <FaCheck className="h-4 w-4" />
                                                                <span className="ml-1 text-xs">
                                                                    {t(
                                                                        'withdrawal.validIBAN',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <div className="flex items-center text-red-500">
                                                                <FaExclamationTriangle className="h-4 w-4" />
                                                                <span className="ml-1 text-xs">
                                                                    {t(
                                                                        'withdrawal.invalidIBAN',
                                                                    )}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* IBAN Yardım Metni */}
                                        <div className="mt-2 rounded-lg bg-blue-50 p-3 text-sm dark:bg-blue-900/20">
                                            <div className="flex items-start">
                                                <FaInfoCircle className="mr-2 mt-0.5 h-4 w-4 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-blue-800 dark:text-blue-200">
                                                        {t(
                                                            'withdrawal.ibanHelp.title',
                                                        )}
                                                    </p>
                                                    <ul className="mt-1 list-inside list-disc space-y-1 text-blue-700 dark:text-blue-300">
                                                        <li>
                                                            {t(
                                                                'withdrawal.ibanHelp.format',
                                                            )}
                                                        </li>
                                                        <li>
                                                            {t(
                                                                'withdrawal.ibanHelp.paste',
                                                            )}
                                                        </li>
                                                        <li>
                                                            {t(
                                                                'withdrawal.ibanHelp.check',
                                                            )}
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        {/* IBAN Örneği */}
                                        <div className="mt-3 flex items-center rounded-lg bg-gray-50 p-3 dark:bg-gray-700/30">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {t(
                                                        'withdrawal.ibanExample',
                                                    )}
                                                    :
                                                </p>
                                                <p className="mt-1 font-mono text-sm text-gray-600 dark:text-gray-400">
                                                    TR33 0006 1005 1978 6457
                                                    8413 26
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    copyToClipboard(
                                                        'TR330006100519786457841326',
                                                    )
                                                }
                                                className="flex items-center rounded-md bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500"
                                            >
                                                <FaCopy className="mr-1.5 h-4 w-4" />
                                                {t('common.copy')}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Submit Butonu */}
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="inline-flex items-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                                        >
                                            {processing ? (
                                                <>
                                                    <svg
                                                        className="mr-2 h-4 w-4 animate-spin"
                                                        viewBox="0 0 24 24"
                                                    >
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
                                                    {t(
                                                        'withdrawal.request.submit',
                                                    )}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>

                        {/* Para Birimi Dönüşüm Alanı */}
                        <CurrencyConverter
                            amount={data.amount_usd}
                            exchangeRate={exchangeRate}
                            t={t}
                        />
                    </div>
                </div>
            </div>

            {/* Başarılı İşlem Animasyonu */}
            <AnimatePresence>
                {processing && (
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
