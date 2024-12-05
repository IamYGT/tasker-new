import { PriorityBadge, StatusBadge } from '@/Components/Badges';
import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { formatDate } from '@/Utils/ticket_format';
import { Head, router, useForm } from '@inertiajs/react';
import { motion } from 'framer-motion';
import React, { useState } from 'react';
import {
    FaCheckCircle,
    FaDownload,
    FaEye,
    FaFile,
    FaPaperclip,
    FaQuoteRight,
    FaTimes,
    FaUser,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface HistoryParams {
    from?: string;
    to?: string;
    [key: string]: string | undefined;
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
    ticket: {
        id: number;
        subject: string;
        status: string;
        priority: string;
        category: string;
        created_at: string;
        last_reply_at: string;
        user: {
            id: number;
            name: string;
            email: string;
        };
        replies: Array<{
            id: number;
            message: string;
            created_at: string;
            quote?: string;
            user: {
                id: number;
                name: string;
                email: string;
            };
            attachments: Array<{
                id: number;
                name: string;
                url: string;
                type: string;
                size: number;
            }>;
        }>;
        histories: Array<{
            id: number;
            action: string;
            type: string;
            params?: HistoryParams;
            created_at: string;
            user: {
                name: string;
            };
        }>;
    };
    statuses: string[];
}

interface FormData {
    message: string;
    attachments: File[];
    quote: string | null;
}

export default function Show({ auth, ticket, statuses }: Props) {
    const { t } = useTranslation();
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [quoteText, setQuoteText] = useState<string | null>(null);

    const { data, setData, post, processing, reset } = useForm<FormData>({
        message: '',
        attachments: [],
        quote: null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', data.message);

        if (data.quote) {
            formData.append('quote', data.quote);
        }

        data.attachments.forEach((file, index) => {
            formData.append(`attachments[${index}]`, file);
        });

        post(route('tickets.reply', ticket.id), {
            data: formData,
            forceFormData: true,
            onSuccess: () => {
                reset();
                setQuoteText(null);
                toast.success(t('tickets.replySent'));
            },
            onError: () => {
                toast.error(t('common.error'));
            },
        });
    };

    const handleFiles = (files: FileList | null) => {
        if (!files) return;

        const validFiles = Array.from(files).filter((file) => {
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

    const handleQuote = (text: string) => {
        setQuoteText(text);
        setData('quote', text);
    };

    return (
        <AuthenticatedLayout
            auth={{ user: { ...auth.user, roles: auth.user.roles || [] } }}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    {t('tickets.ticket')} #{ticket.id}
                    {' - '}
                    <span
                        className={`text-sm ${
                            ticket.status === 'open'
                                ? 'text-blue-600'
                                : ticket.status === 'answered'
                                  ? 'text-green-600'
                                  : 'text-gray-600'
                        }`}
                    >
                        {t(`tickets.status.${ticket.status}`)}
                    </span>
                </h2>
            }
        >
            <Head title={`${t('tickets.ticket')} #${ticket.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Ticket Detayları */}
                    <div className="mb-6 overflow-hidden rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                    {ticket.subject}
                                </h3>
                                <div className="mt-1 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span>
                                        {t('tickets.createdAt')}:{' '}
                                        {formatDate(ticket.created_at)}
                                    </span>
                                    <span>•</span>
                                    <span>
                                        {t('tickets.lastReply')}:{' '}
                                        {formatDate(ticket.last_reply_at)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <PriorityBadge priority={ticket.priority} />
                                <StatusBadge status={ticket.status} />
                            </div>
                        </div>
                    </div>

                    {/* Mesajlar */}
                    <div className="mb-6 space-y-6">
                        {ticket.replies.map((reply) => (
                            <motion.div
                                key={reply.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`overflow-hidden rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800 ${
                                    reply.user.id === auth.user.id
                                        ? 'ml-auto'
                                        : 'mr-auto'
                                }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                                            <FaUser className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                        </div>
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-gray-100">
                                                {reply.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {formatDate(reply.created_at)}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handleQuote(reply.message)
                                        }
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <FaQuoteRight className="h-4 w-4" />
                                    </button>
                                </div>

                                {reply.quote && (
                                    <div className="mt-4 rounded-lg border-l-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
                                        <div className="text-sm text-gray-600 dark:text-gray-300">
                                            {reply.quote}
                                        </div>
                                    </div>
                                )}

                                <div className="mt-4 whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                                    {reply.message}
                                </div>

                                {reply.attachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {reply.attachments.map((attachment) => (
                                            <div
                                                key={attachment.id}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <FaFile className="mr-2 h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {attachment.name}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {attachment.type.startsWith(
                                                        'image/',
                                                    ) && (
                                                        <button
                                                            onClick={() =>
                                                                setPreviewImage(
                                                                    attachment.url,
                                                                )
                                                            }
                                                            className="text-gray-400 hover:text-blue-500"
                                                        >
                                                            <FaEye className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <a
                                                        href={attachment.url}
                                                        download
                                                        className="text-gray-400 hover:text-blue-500"
                                                    >
                                                        <FaDownload className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Yanıt Formu */}
                    <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                        <form onSubmit={handleSubmit}>
                            {quoteText && (
                                <div className="mb-4 rounded-lg border-l-4 border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700/50">
                                    <div className="flex items-center justify-between">
                                        <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('tickets.quote')}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setQuoteText(null);
                                                setData('quote', null);
                                            }}
                                            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        >
                                            <FaTimes className="h-4 w-4" />
                                        </button>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                        {quoteText}
                                    </div>
                                </div>
                            )}

                            <textarea
                                value={data.message}
                                onChange={(e) =>
                                    setData('message', e.target.value)
                                }
                                className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                                rows={6}
                                placeholder={t('tickets.writeReply')}
                                required
                            />

                            {/* Dosya Yükleme */}
                            <div className="mt-4">
                                <div className="flex items-center gap-4">
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            handleFiles(e.target.files)
                                        }
                                        className="hidden"
                                        id="attachments"
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <label
                                        htmlFor="attachments"
                                        className="flex cursor-pointer items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        <FaPaperclip className="h-4 w-4" />
                                        {t('tickets.attachFiles')}
                                    </label>
                                </div>

                                {data.attachments.length > 0 && (
                                    <div className="mt-4 space-y-2">
                                        {data.attachments.map((file, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-700"
                                            >
                                                <div className="flex items-center">
                                                    <FaFile className="mr-2 h-4 w-4 text-gray-400" />
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">
                                                        {file.name}
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

                            <div className="mt-4 flex justify-end">
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
                                            <FaCheckCircle className="mr-2 h-4 w-4" />
                                            {t('tickets.send')}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            {/* Resim Önizleme Modalı */}
            {previewImage && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="max-h-[90vh] max-w-[90vw]">
                        <img
                            src={previewImage}
                            alt="Preview"
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                </div>
            )}

            {/* Durum Seçici - Sadece admin için gösterilecek */}
            {auth.user.roles?.some((role) => role.name === 'admin') && (
                <div className="mt-4">
                    <select
                        value={ticket.status}
                        onChange={(e) => {
                            const newStatus = e.target.value;
                            router.post(
                                route('tickets.update-status', ticket.id),
                                {
                                    status: newStatus,
                                },
                                {
                                    preserveScroll: true,
                                },
                            );
                        }}
                        className="rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    >
                        {statuses.map((status) => (
                            <option key={status} value={status}>
                                {t(`tickets.status.${status}`)}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
