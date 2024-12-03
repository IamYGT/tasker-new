import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

interface Bank {
    id: string;
    name: string;
    code: string;
    swift: string;
}

interface UserIban {
    id: number;
    bank_id: string;
    iban: string;
    title: string;
    is_default: boolean;
    is_active: boolean;
    formatted_iban: string;
    bank_details: Bank;
}

interface Props extends PageProps {
    ibans: UserIban[];
    banks: Bank[];
    auth: {
        user: User;
    };
}

export default function UserIbanIndex({ ibans, banks }: Props) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        bank_id: '',
        iban: '',
        title: '',
        is_default: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('profile.ibans.store'), {
            onSuccess: () => {
                reset();
                setIsModalOpen(false);
            },
        });
    };

    const getBankDetails = (bankId: string): Bank | undefined => {
        return banks.find((bank) => bank.id === bankId);
    };

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    id: 0,
                    name: '',
                    email: '',
                    roles: [],
                },
            }}
        >
            <Head title="IBAN Yönetimi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold dark:text-white">
                                    {t('iban.management')}
                                </h2>
                                <PrimaryButton
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    {t('iban.add')}
                                </PrimaryButton>
                            </div>

                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {ibans.map((iban) => {
                                    const bankDetails = getBankDetails(
                                        iban.bank_id,
                                    );

                                    return (
                                        <div
                                            key={iban.id}
                                            className="rounded-lg border p-4 dark:border-gray-700 dark:bg-gray-900"
                                        >
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="font-medium dark:text-white">
                                                    {bankDetails?.name ||
                                                        t('iban.bankNotFound')}
                                                </span>
                                            </div>
                                            <div className="mb-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {iban.title}
                                                </span>
                                            </div>
                                            <p className="font-mono text-gray-600 dark:text-gray-400">
                                                {iban.formatted_iban}
                                            </p>
                                            {iban.is_default && (
                                                <span className="mt-2 inline-block rounded bg-green-100 px-2 py-1 text-xs text-green-800 dark:bg-green-900 dark:text-green-200">
                                                    {t('iban.default')}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="mb-6 text-lg font-medium dark:text-white">
                        {t('iban.add')}
                    </h2>

                    <div className="mb-4">
                        <InputLabel
                            htmlFor="bank_id"
                            value={t('iban.bankSelect')}
                        />
                        <select
                            id="bank_id"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                            value={data.bank_id}
                            onChange={(e) => setData('bank_id', e.target.value)}
                        >
                            <option value="">{t('iban.bankSelect')}</option>
                            {banks.map((bank) => (
                                <option key={bank.id} value={bank.id}>
                                    {bank.name}
                                </option>
                            ))}
                        </select>
                        <InputError message={errors.bank_id} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="iban" value={t('iban.number')} />
                        <TextInput
                            id="iban"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.iban}
                            onChange={(e) => setData('iban', e.target.value)}
                        />
                        <InputError message={errors.iban} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="title" value={t('iban.title')} />
                        <TextInput
                            id="title"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                        />
                        <InputError message={errors.title} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900"
                                checked={data.is_default}
                                onChange={(e) =>
                                    setData('is_default', e.target.checked)
                                }
                            />
                            <span className="ml-2 dark:text-white">
                                {t('iban.setDefault')}
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? t('common.saving') : t('common.save')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>
        </AuthenticatedLayout>
    );
}
