import React from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/TranslationContext';
import { useForm } from '@inertiajs/react';

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

export default function WithdrawalRequest({ auth }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        amount: '',
        bank_account: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('withdrawal.store'));
    };

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
                    {t('withdrawal.request.title')}
                </h2>
            }
        >
            <Head title={t('withdrawal.request.title')} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="amount" className="block text-sm font-medium">
                                        {t('withdrawal.request.amount')}
                                    </label>
                                    <input
                                        type="number"
                                        id="amount"
                                        value={data.amount}
                                        onChange={e => setData('amount', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {errors.amount && <div className="text-red-500 text-sm mt-1">{errors.amount}</div>}
                                </div>

                                <div>
                                    <label htmlFor="bank_account" className="block text-sm font-medium">
                                        {t('withdrawal.request.bankAccount')}
                                    </label>
                                    <input
                                        type="text"
                                        id="bank_account"
                                        value={data.bank_account}
                                        onChange={e => setData('bank_account', e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600"
                                    />
                                    {errors.bank_account && <div className="text-red-500 text-sm mt-1">{errors.bank_account}</div>}
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        {processing ? (
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3.148 7.935l3.502-3.502z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-5v-3h-9zM5 20h2a2 2 0 002-2v-2H5v2z"></path>
                                            </svg>
                                        )}
                                        {t('withdrawal.request.submit')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 