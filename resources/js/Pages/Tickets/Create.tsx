import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatFileSize } from '@/Utils/ticket_format';
import { Head, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import { FaTicketAlt, FaTimes, FaUpload } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Props {
    auth: {
        user: {
            id: number;
            name: string;
            email: string;
            roles?: Array<{ name: string }>;
        };
    };
    subject?: string;
    message?: string;
    priority?: string;
    category?: string;
}

interface FormData {
    subject: string;
    message: string;
    priority: string;
    category: string;
    attachments: File[];
}

export default function Create({ auth, subject, message, priority = 'medium', category = 'general' }: Props) {
    const { t } = useTranslation();
    const [dragActive, setDragActive] = useState(false);

    const { data, setData, post, processing, errors, reset } =
        useForm<FormData>({
            subject: subject || '',
            message: message || '',
            priority: priority,
            category: category,
            attachments: [],
        });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('subject', data.subject);
        formData.append('message', data.message);
        formData.append('priority', data.priority);
        formData.append('category', data.category);

        data.attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        post(route('tickets.store'), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                toast.success(t('tickets.created'));
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(Array.from(e.dataTransfer.files));
        }
    };

    const handleFiles = (files: File[]) => {
        const validFiles = files.filter((file) => {
            const isValidType = [
                'image/jpeg',
                'image/png',
                'image/gif',
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ].includes(file.type);

            const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB

            if (!isValidType) {
                toast.error(t('tickets.invalidFileType', { name: file.name }));
            }
            if (!isValidSize) {
                toast.error(t('tickets.fileTooLarge', { name: file.name }));
            }

            return isValidType && isValidSize;
        });

        setData('attachments', [...data.attachments, ...validFiles]);
    };

    const removeFile = (index: number) => {
        const newFiles = [...data.attachments];
        newFiles.splice(index, 1);
        setData('attachments', newFiles);
    };

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('tickets.createNew')}
                </h2>
            }
        >
            <Head title={t('tickets.createNew')} />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="overflow-hidden bg-white shadow-sm dark:bg-gray-800 sm:rounded-lg"
                    >
                        <form onSubmit={handleSubmit} className="p-6">
                            {/* Konu */}
                            <div className="mb-6">
                                <label
                                    htmlFor="subject"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    {t('tickets.subject')}
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    value={data.subject}
                                    onChange={(e) =>
                                        setData('subject', e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-500"
                                    required
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.subject}
                                    </p>
                                )}
                            </div>

                            {/* Öncelik */}
                            <div className="mb-6">
                                <label
                                    htmlFor="priority"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    {t('tickets.priority')}
                                </label>
                                <select
                                    id="priority"
                                    value={data.priority}
                                    onChange={(e) =>
                                        setData('priority', e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-500"
                                >
                                    <option value="low">
                                        {t('tickets.priority.low')}
                                    </option>
                                    <option value="medium">
                                        {t('tickets.priority.medium')}
                                    </option>
                                    <option value="high">
                                        {t('tickets.priority.high')}
                                    </option>
                                </select>
                            </div>

                            {/* Kategori */}
                            <div className="mb-6">
                                <label
                                    htmlFor="category"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    {t('tickets.category')}
                                </label>
                                <select
                                    id="category"
                                    value={data.category}
                                    onChange={(e) =>
                                        setData('category', e.target.value)
                                    }
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-500"
                                >
                                    <option value="general">
                                        {t('tickets.category.general')}
                                    </option>
                                    <option value="technical">
                                        {t('tickets.category.technical')}
                                    </option>
                                    <option value="billing">
                                        {t('tickets.category.billing')}
                                    </option>
                                    <option value="other">
                                        {t('tickets.category.other')}
                                    </option>
                                </select>
                            </div>

                            {/* Mesaj */}
                            <div className="mb-6">
                                <label
                                    htmlFor="message"
                                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100"
                                >
                                    {t('tickets.message')}
                                </label>
                                <textarea
                                    id="message"
                                    value={data.message}
                                    onChange={(e) =>
                                        setData('message', e.target.value)
                                    }
                                    rows={6}
                                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-indigo-500"
                                    required
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.message}
                                    </p>
                                )}
                            </div>

                            {/* Dosya Yükleme Alanı */}
                            <div className="mb-6">
                                <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-100">
                                    {t('tickets.attachments')}
                                </label>
                                <div
                                    onDragEnter={handleDrag}
                                    onDragLeave={handleDrag}
                                    onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                    className={`relative flex min-h-[100px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
                                        dragActive
                                            ? 'border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-900/20'
                                            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                                    }`}
                                >
                                    <div className="text-center">
                                        <FaUpload className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('tickets.dropFiles')}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
                                            {t('tickets.maxFileSize')}
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            handleFiles(
                                                Array.from(
                                                    e.target.files || [],
                                                ),
                                            )
                                        }
                                        className="absolute inset-0 cursor-pointer opacity-0"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                </div>

                                {/* Yüklenen Dosyalar */}
                                {data.attachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {data.attachments.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <FaTicketAlt className="mr-2 h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {file.name}
                                                    </span>
                                                    <span className="ml-2 text-xs text-gray-500">
                                                        (
                                                        {formatFileSize(
                                                            file.size,
                                                        )}
                                                        )
                                                    </span>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeFile(index)
                                                    }
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <FaTimes className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
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
                                            <FaTicketAlt className="mr-2 h-4 w-4" />
                                            {t('tickets.submit')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
