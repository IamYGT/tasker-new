import DeleteConfirmationModal from '@/Components/DeleteConfirmationModal';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { PageProps, User } from '@/types';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { FaBuildingColumns } from 'react-icons/fa6';
import { FiCopy, FiCreditCard, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { toast } from 'react-toastify';

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
    bank_details: Bank;
    name: string;
    surname: string;
}

interface Props extends PageProps {
    ibans: UserIban[];
    banks: Bank[];
    auth: {
        user: User;
    };
}

interface ValidationErrors {
    message?: string;
    [key: string]: string | undefined;
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

export default function UserIbanIndex({ auth, ibans, banks }: Props) {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedIban, setSelectedIban] = useState<UserIban | null>(null);
    const [ibanValid, setIbanValid] = useState<boolean | null>(null);
    const [lastValidIban, setLastValidIban] = useState<string>('');
    const [hasExistingIban, setHasExistingIban] = useState<boolean>(false);
    const [existingIbanError, setExistingIbanError] = useState<string>('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [ibanToDelete, setIbanToDelete] = useState<UserIban | null>(null);

    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        errors,
        reset,
    } = useForm({
        bank_id: '',
        iban: '',
        title: '',
        is_default: false,
        name: '',
        surname: '',
    });

    const handleIbanChange = (value: string) => {
        let formattedValue = value.replace(/[^A-Z0-9]/g, '').toUpperCase();

        if (formattedValue && !formattedValue.startsWith('TR')) {
            formattedValue = 'TR' + formattedValue;
        }

        if (formattedValue.length > 26) {
            formattedValue = formattedValue.slice(0, 26);
        }

        const isValid = validateIBAN(formattedValue);
        setIbanValid(isValid);

        const existingIban = ibans.find(
            (iban) =>
                iban.iban === formattedValue &&
                (!selectedIban || selectedIban.id !== iban.id),
        );

        if (existingIban) {
            setHasExistingIban(true);
            setExistingIbanError(t('iban.alreadyExists'));
            toast.warning(t('iban.alreadyExists'), {
                position: 'top-right',
                autoClose: 3000,
            });
        } else {
            setHasExistingIban(false);
            setExistingIbanError('');
        }

        if (formattedValue.length === 26) {
            if (isValid && !existingIban) {
                if (formattedValue !== lastValidIban) {
                    toast.success(t('iban.validIBAN'), {
                        position: 'top-right',
                        autoClose: 3000,
                    });
                    setLastValidIban(formattedValue);
                }
            } else if (!isValid) {
                toast.error(t('iban.invalidIBAN'), {
                    position: 'top-right',
                    autoClose: 3000,
                });
            }
        }

        setData('iban', formattedValue);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!ibanValid) {
            toast.error(t('iban.errors.invalid_iban'));
            return;
        }

        if (hasExistingIban) {
            toast.error(t('iban.errors.already_exists'));
            return;
        }

        if (isEditMode && selectedIban) {
            put(route('profile.ibans.update', selectedIban.id), {
                onSuccess: () => {
                    toast.success(t('iban.updated'));
                    handleCloseModal();
                },
                onError: (errors: ValidationErrors) => {
                    Object.values(errors).forEach((error) => {
                        if (error) toast.error(error);
                    });
                },
            });
        } else {
            post(route('profile.ibans.store'), {
                onSuccess: () => {
                    toast.success(t('iban.added'));
                    handleCloseModal();
                },
                onError: (errors: ValidationErrors) => {
                    Object.values(errors).forEach((error) => {
                        if (error) toast.error(error);
                    });
                },
            });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setIsEditMode(false);
        setSelectedIban(null);
        reset();
    };

    const handleEdit = (iban: UserIban) => {
        setSelectedIban(iban);
        setIsEditMode(true);
        setData({
            bank_id: iban.bank_id,
            iban: iban.iban,
            title: iban.title,
            is_default: iban.is_default,
            name: iban.name,
            surname: iban.surname,
        });
        setIsModalOpen(true);
    };

    const handleDelete = (iban: UserIban) => {
        setIbanToDelete(iban);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!ibanToDelete) return;

        try {
            await destroy(route('profile.ibans.destroy', ibanToDelete.id), {
                onSuccess: () => {
                    toast.success(t('iban.deleted'));
                    setDeleteModalOpen(false);
                    setIbanToDelete(null);
                },
                onError: () => {
                    toast.error(t('iban.errors.delete_failed'));
                },
                preserveScroll: true,
            });
        } catch {
            toast.error(t('iban.errors.delete_failed'));
        }
    };

    const copyToClipboard = async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast.success(t('common.copied'));
        } catch {
            toast.error(t('common.copyError'));
        }
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            const cleanedText = text.replace(/\s/g, '');
            handleIbanChange(cleanedText);
            toast.success(t('withdrawal.ibanPasted'), {
                position: 'top-right',
                autoClose: 2000,
            });
        } catch (error) {
            toast.error(t('withdrawal.pasteError'), {
                position: 'top-right',
                autoClose: 3000,
            });
        }
    };

    const canSubmit = () => {
        return (
            ibanValid &&
            !hasExistingIban &&
            !processing &&
            data.iban.length === 26 &&
            data.bank_id &&
            data.title &&
            data.name &&
            data.surname
        );
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={t('iban.management')} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg">
                        <div className="p-6">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                    {t('iban.management')}
                                </h2>
                                <PrimaryButton
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    {t('iban.add')}
                                </PrimaryButton>
                            </div>

                            {ibans.length === 0 ? (
                                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
                                    <FaBuildingColumns className="mb-4 h-12 w-12 text-gray-400 dark:text-gray-600" />
                                    <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-white">
                                        {t('iban.noIbans')}
                                    </h3>
                                    <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
                                        {t('iban.addFirst')}
                                    </p>
                                    <PrimaryButton
                                        onClick={() => setIsModalOpen(true)}
                                    >
                                        {t('iban.addNew')}
                                    </PrimaryButton>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                    {ibans.map((iban) => {
                                        const bankDetails = banks.find(
                                            (bank) => bank.id === iban.bank_id,
                                        );

                                        return (
                                            <div
                                                key={iban.id}
                                                className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] ${
                                                    iban.is_default
                                                        ? 'bg-gradient-to-br from-light-primary/10 to-light-accent/5 shadow-lg ring-2 ring-light-primary/20 dark:from-dark-primary/20 dark:to-dark-accent/10 dark:ring-dark-primary/30'
                                                        : 'bg-white shadow-md hover:shadow-xl dark:bg-gray-900'
                                                }`}
                                            >
                                                {iban.is_default && (
                                                    <div className="absolute right-0 top-0">
                                                        <div className="flex items-center gap-1 rounded-bl-xl bg-light-primary px-3 py-1 text-white dark:bg-dark-primary">
                                                            <svg
                                                                className="h-4 w-4"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M5 13l4 4L19 7"
                                                                />
                                                            </svg>
                                                            <span className="text-xs font-medium">
                                                                {t(
                                                                    'iban.default',
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className="absolute right-4 top-4 flex space-x-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                                    <button
                                                        onClick={() =>
                                                            handleEdit(iban)
                                                        }
                                                        className="rounded-full bg-light-primary/10 p-2 text-light-primary hover:bg-light-primary/20 dark:bg-dark-primary/20 dark:text-dark-primary dark:hover:bg-dark-primary/30"
                                                    >
                                                        <FiEdit2 className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDelete(iban)
                                                        }
                                                        className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                                                    >
                                                        <FiTrash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                <div className="mb-4 flex items-center gap-3">
                                                    <div className="rounded-full bg-light-primary/10 p-2 dark:bg-dark-primary/20">
                                                        <FaBuildingColumns className="h-5 w-5 text-light-primary dark:text-dark-primary" />
                                                    </div>
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {bankDetails?.name ||
                                                            t(
                                                                'iban.bankNotFound',
                                                            )}
                                                    </span>
                                                </div>

                                                <div className="mb-4">
                                                    <div className="flex flex-col space-y-2">
                                                        <div>
                                                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                                {t('iban.accountTitle')}
                                                            </span>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {iban.title}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                                {t('iban.accountHolder')}
                                                            </span>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {iban.name} {iban.surname}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="mt-2 space-y-2">
                                                    <div>
                                                        <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                                            {t('iban.number')}
                                                        </span>
                                                        <div className="font-mono text-lg tracking-wider text-gray-700 dark:text-gray-300">
                                                            {formatIBAN(iban.iban)}
                                                        </div>
                                                    </div>
                                                    <div className="flex justify-end">
                                                        <button
                                                            onClick={() =>
                                                                copyToClipboard(
                                                                    iban.iban,
                                                                )
                                                            }
                                                            className="flex items-center gap-1 rounded-lg bg-light-primary/10 px-3 py-1.5 text-sm text-light-primary hover:bg-light-primary/20 dark:bg-dark-primary/20 dark:text-dark-primary dark:hover:bg-dark-primary/30"
                                                        >
                                                            <FiCopy className="h-4 w-4" />
                                                            {t('common.copy')}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={isModalOpen} onClose={handleCloseModal}>
                <form onSubmit={handleSubmit} className="p-6">
                    <h2 className="mb-6 text-lg font-medium text-gray-900 dark:text-white">
                        {isEditMode ? t('iban.edit') : t('iban.add')}
                    </h2>

                    <div className="mb-4">
                        <InputLabel
                            htmlFor="bank_id"
                            value={t('iban.bankSelect')}
                        />
                        <select
                            id="bank_id"
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-white sm:text-sm"
                            value={data.bank_id}
                            onChange={(e) => setData('bank_id', e.target.value)}
                        >
                            <option value="">{t('common.select')}</option>
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
                        <div className="relative">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <FiCreditCard
                                    className={`h-5 w-5 ${
                                        data.iban.length > 0
                                            ? hasExistingIban
                                                ? 'text-red-500'
                                                : ibanValid
                                                  ? 'text-green-500'
                                                  : 'text-red-500'
                                            : 'text-gray-400'
                                    }`}
                                />
                            </div>
                            <input
                                type="text"
                                value={formatIBAN(data.iban)}
                                onChange={(e) =>
                                    handleIbanChange(e.target.value)
                                }
                                placeholder="TR00 0000 0000 0000 0000 0000 00"
                                className={`block w-full rounded-lg border pl-10 pr-32 uppercase ${
                                    data.iban.length > 0
                                        ? hasExistingIban
                                            ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                            : ibanValid
                                              ? 'border-green-500 focus:border-green-500 focus:ring-green-200'
                                              : 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                        : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
                                } dark:border-gray-600 dark:bg-gray-700`}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                                <button
                                    type="button"
                                    onClick={handlePaste}
                                    className="flex items-center rounded-md bg-gray-100 px-3 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-gray-100"
                                >
                                    <FiCopy className="mr-1.5 h-4 w-4" />
                                    {t('common.paste')}
                                </button>
                            </div>
                        </div>
                        {existingIbanError && (
                            <p className="mt-2 text-sm text-red-600">
                                {existingIbanError}
                            </p>
                        )}
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
                        <InputLabel htmlFor="name" value={t('iban.name')} />
                        <TextInput
                            id="name"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                        />
                        <InputError message={errors.name} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <InputLabel htmlFor="surname" value={t('iban.surname')} />
                        <TextInput
                            id="surname"
                            type="text"
                            className="mt-1 block w-full"
                            value={data.surname}
                            onChange={(e) => setData('surname', e.target.value)}
                        />
                        <InputError message={errors.surname} className="mt-2" />
                    </div>

                    <div className="mb-4">
                        <label className="flex items-center">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-900"
                                checked={data.is_default}
                                onChange={(e) =>
                                    setData('is_default', e.target.checked)
                                }
                            />
                            <span className="ml-2 text-gray-900 dark:text-white">
                                {t('iban.setDefault')}
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton onClick={handleCloseModal}>
                            {t('common.cancel')}
                        </SecondaryButton>

                        <PrimaryButton className="ml-3" disabled={!canSubmit()}>
                            {isEditMode ? t('common.update') : t('common.save')}
                        </PrimaryButton>
                    </div>
                </form>
            </Modal>

            <DeleteConfirmationModal
                isOpen={deleteModalOpen}
                onClose={() => {
                    setDeleteModalOpen(false);
                    setIbanToDelete(null);
                }}
                onConfirm={confirmDelete}
                title={t('iban.deleteTitle')}
                confirmText={t('common.delete')}
                cancelText={t('common.cancel')}
                processing={processing}
            >
                <p>
                    {t('iban.deleteConfirmation', {
                        title: ibanToDelete?.title || '',
                        iban: ibanToDelete ? formatIBAN(ibanToDelete.iban) : '',
                    })}
                </p>
                {ibanToDelete?.is_default && (
                    <p className="mt-2 text-sm text-red-600">
                        {t('iban.deleteDefaultWarning')}
                    </p>
                )}
            </DeleteConfirmationModal>
        </AuthenticatedLayout>
    );
}
