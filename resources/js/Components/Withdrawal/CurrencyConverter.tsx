import { motion } from 'framer-motion';
import React from 'react';
import {
    FaDollarSign,
    FaEuroSign,
    FaExchangeAlt,
    FaInfoCircle,
    FaLiraSign,
} from 'react-icons/fa';

interface CurrencyConverterProps {
    amount: string;
    exchangeRate: number;
    t: (key: string) => string;
}

export const CurrencyConverter = ({
    amount,
    exchangeRate,
    t,
}: CurrencyConverterProps) => {
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
