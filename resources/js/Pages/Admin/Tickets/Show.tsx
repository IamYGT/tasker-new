import { useTranslation } from '@/Contexts/TranslationContext';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, useForm } from '@inertiajs/react';
import React, { useRef, useState, useCallback } from 'react';
import {
    FaDownload,
    FaEye,
    FaFile,
    FaHeadset,
    FaHistory,
    FaImage,
    FaPaperclip,
    FaQuoteRight,
    FaReply,
    FaTicketAlt,
    FaTimes,
    FaUser,
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import { PriorityBadge } from './Components/Badges';
import PreviewModal from './Components/PreviewModal';
import StatusSelect from './Components/StatusSelect';
import TicketHistoryPanel from './Components/TicketHistoryPanel';

interface Message {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
        avatar?: string;
    };
    message: string;
    created_at: string;
    attachments: Attachment[];
    quote?: string;
}

interface TicketHistory {
    id: number;
    action: string;
    type: string;
    params?: any;
    user: {
        name: string;
    };
    created_at: string;
}

interface Attachment {
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
}

interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    category: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    replies: Message[];
    created_at: string;
    last_reply_at: string;
    history: TicketHistory[];
    attachments: Attachment[];
}

interface Props {
    auth: {
        user: {
            roles: { name: string; }[];
            email: string;
            id: number;
            name: string;
        };
    };
    ticket: Ticket;
    statuses: string[];
}

interface MessageBubbleProps {
    isAdmin: boolean;
    message: string;
    user: { name: string; avatar?: string };
    date: string;
    attachments?: Attachment[];
    quote?: string;
    onPreviewImage: (url: string) => void;
    onQuote: () => void;
    t: (key: string, params?: Record<string, any>) => string;
    formatDate: (date: string) => string;
}

interface AttachmentItemProps {
    attachment: Attachment;
    onPreview: () => void;
}

const MessageBubble = ({
    isAdmin,
    message,
    user,
    date,
    attachments,
    quote,
    onPreviewImage,
    formatDate,
}: MessageBubbleProps) => {
    return (
        <div
            className={`group flex gap-3 p-2 transition-all ${
                isAdmin ? 'flex-row-reverse' : 'flex-row'
            }`}
        >
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="relative">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-10 w-10 rounded-full object-cover shadow-sm ring-2 ring-white dark:ring-gray-700"
                        />
                    ) : (
                        <div
                            className={`flex h-10 w-10 items-center justify-center rounded-full shadow-sm ${isAdmin ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-emerald-100 dark:bg-emerald-900/50'}`}
                        >
                            <FaUser
                                className={`h-5 w-5 ${isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`}
                            />
                        </div>
                    )}
                    {isAdmin && (
                        <div className="absolute -bottom-0.5 -right-0.5 rounded-full bg-indigo-500 p-1">
                            <FaHeadset className="h-2.5 w-2.5 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Mesaj İçeriği */}
            <div
                className={`min-w-0 flex-1 space-y-1.5 rounded-xl p-3 shadow-sm ${
                    isAdmin
                        ? 'bg-indigo-50 dark:bg-indigo-900/20'
                        : 'bg-emerald-50 dark:bg-emerald-900/20'
                }`}
            >
                {/* Alıntı varsa göster */}
                {quote && (
                    <div className="mb-2 rounded-lg border-l-2 border-gray-300 bg-gray-100 p-2 text-sm text-gray-600 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400">
                        {quote}
                    </div>
                )}
                <div className="flex items-center justify-between gap-2">
                    <span
                        className={`text-sm font-medium ${
                            isAdmin
                                ? 'text-indigo-900 dark:text-indigo-100'
                                : 'text-emerald-900 dark:text-emerald-100'
                        }`}
                    >
                        {user.name}
                    </span>
                    <span className="whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(date)}
                    </span>
                </div>

                <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {message}
                </div>

                {/* Ekler */}
                {attachments && attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5 border-t border-gray-100 pt-2 dark:border-gray-700/50">
                        {attachments.map((attachment) => (
                            <AttachmentItem
                                key={attachment.id}
                                attachment={attachment}
                                onPreview={() => onPreviewImage(attachment.url)}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Show({ auth, ticket, statuses }: Props) {
    const { t, locale } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [, setCurrentStatus] = useState(ticket.status);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    const { data, setData, processing, reset } = useForm({
        message: '',
        status: ticket.status,
        attachments: [] as File[],
        quote: '' as string | null,
    });

    // Statü değişim fonksiyonu
    const handleStatusChange = async (newStatus: string) => {
        setIsStatusUpdating(true);

        router.put(
            route('admin.tickets.update-status', ticket.id),
            {
                status: newStatus,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setCurrentStatus(newStatus);
                    // Toast mesajı otomatik olarak flash message'dan gelecek
                },
                onError: () => {
                    toast.error(t('common.error'));
                },
                onFinish: () => {
                    setIsStatusUpdating(false);
                },
            },
        );
    };

    // Alıntı yapma işlemi
    const handleQuote = (message: string) => {
        setData('quote', message);
        setIsReplying(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('message', data.message);

        if (data.quote) {
            formData.append('quote', data.quote);
        }

        // Dosyaları ekle
        if (data.attachments.length > 0) {
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        try {
            await router.post(
                route('admin.tickets.reply', ticket.id),
                formData,
                {
                    forceFormData: true,
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setData('message', '');
                        setData('quote', null);
                        setData('attachments', []);
                        setIsReplying(false);
                        toast.success(t('ticket.replyAdded'));
                    },
                    onError: (errors) => {
                        console.error('Reply errors:', errors);
                        toast.error(t('common.error'));
                    },
                },
            );
        } catch (error) {
            console.error('Reply failed:', error);
            toast.error(t('common.error'));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        const validFiles = files.filter((file) => {
            if (file.size > maxSize) {
                toast.error(t('ticket.fileTooLarge', { name: file.name }));
                return false;
            }

            if (!allowedTypes.includes(file.type)) {
                toast.error(t('ticket.invalidFileType', { name: file.name }));
                return false;
            }

            return true;
        });

        setData('attachments', [...data.attachments, ...validFiles]);
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);
    };

    // formatDate fonksiyonunu tanımla
    const formatDate = useCallback((date: string) => {
        const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };

        const dateFormats = {
            'tr': {
                ...options,
                timeZone: 'Europe/Istanbul'
            },
            'en': {
                ...options,
                timeZone: 'UTC'
            }
        };

        try {
            return new Date(date).toLocaleDateString(
                locale === 'tr' ? 'tr-TR' : 'en-US',
                dateFormats[locale as keyof typeof dateFormats]
            );
        } catch (error) {
            console.error('Date formatting error:', error);
            return date;
        }
    }, [locale]);

    return (
        <AuthenticatedLayout
            auth={{
                user: {
                    id: auth.user.id,
                    name: auth.user.name,
                    email: auth.user.email,
                    roles: auth.user.roles
                }
            }}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {t('ticket.details')}
                    </h2>
                </div>
            }
        >
            <Head title={`${t('ticket.ticket')} #${ticket.id}`} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Üst Bilgi Kartı */}
                    <div className="mb-8 rounded-2xl bg-white p-8 shadow-sm dark:bg-gray-800">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="rounded-xl bg-indigo-50 p-3 dark:bg-indigo-900/30">
                                    <FaTicketAlt className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {ticket.subject}
                                    </h1>
                                    <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                                        <span className="font-medium">
                                            #{ticket.id}
                                        </span>
                                        <span>•</span>
                                        <span>
                                            {formatDate(ticket.created_at)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <PriorityBadge priority={ticket.priority} />
                                <StatusSelect
                                    currentStatus={ticket.status}
                                    statuses={statuses}
                                    onChange={handleStatusChange}
                                    isLoading={isStatusUpdating}
                                    t={t}
                                    ticketId={ticket.id}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ana İçerik Grid */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                        {/* Sol Taraf - Mesajlaşma */}
                        <div className="space-y-6 lg:col-span-3">
                            <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                                {/* Mesajlar */}
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <div className="space-y-4 p-6">
                                        <MessageBubble
                                            isAdmin={false}
                                            message={ticket.message}
                                            user={ticket.user}
                                            date={ticket.created_at}
                                            attachments={ticket.attachments}
                                            onPreviewImage={setPreviewImage}
                                            onQuote={() =>
                                                handleQuote(ticket.message)
                                            }
                                            t={t}
                                            formatDate={formatDate}
                                        />

                                        {ticket.replies.map((reply) => (
                                            <MessageBubble
                                                key={reply.id}
                                                isAdmin={
                                                    reply.user.id ===
                                                    auth.user.id
                                                }
                                                message={reply.message}
                                                user={reply.user}
                                                date={reply.created_at}
                                                attachments={reply.attachments}
                                                quote={reply.quote}
                                                onPreviewImage={setPreviewImage}
                                                onQuote={() =>
                                                    handleQuote(reply.message)
                                                }
                                                t={t}
                                                formatDate={formatDate}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Yanıt Formu */}
                                <div className="border-t p-6 dark:border-gray-700">
                                    {!isReplying ? (
                                        <button
                                            onClick={() => setIsReplying(true)}
                                            className="w-full rounded-xl border-2 border-dashed border-gray-200 px-8 py-6 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:border-gray-600 dark:hover:text-gray-300"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <FaReply className="h-4 w-4" />
                                                <span>
                                                    {t('ticket.clickToReply')}
                                                </span>
                                            </div>
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={handleSubmit}
                                            className="space-y-6"
                                        >
                                            {data.quote && (
                                                <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800/50">
                                                    <div className="mb-2 flex items-center gap-2">
                                                        <FaQuoteRight className="h-4 w-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">
                                                            {t('ticket.quote')}
                                                        </span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {data.quote}
                                                    </div>
                                                </div>
                                            )}

                                            <textarea
                                                value={data.message}
                                                onChange={(e) =>
                                                    setData(
                                                        'message',
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full rounded-xl border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                                                rows={6}
                                                placeholder={t(
                                                    'ticket.writeReply',
                                                )}
                                            />

                                            {/* Dosya Yükleme */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={
                                                            handleFileChange
                                                        }
                                                        multiple
                                                        className="hidden"
                                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            fileInputRef.current?.click()
                                                        }
                                                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                                    >
                                                        <FaPaperclip className="h-4 w-4" />
                                                        {t(
                                                            'ticket.attachFiles',
                                                        )}
                                                    </button>
                                                </div>

                                                {/* Yüklenen Dosyalar */}
                                                {data.attachments.length >
                                                    0 && (
                                                    <div className="space-y-2">
                                                        {data.attachments.map(
                                                            (file, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="flex items-center justify-between rounded-lg bg-gray-50 p-2 dark:bg-gray-800"
                                                                >
                                                                    <span className="truncate text-sm text-gray-600 dark:text-gray-400">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() =>
                                                                            removeAttachment(
                                                                                index,
                                                                            )
                                                                        }
                                                                        className="text-red-500 hover:text-red-700"
                                                                    >
                                                                        <FaTimes className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Form Aksiyonları */}
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsReplying(false);
                                                        reset();
                                                    }}
                                                    className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                                                >
                                                    {t('common.cancel')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={
                                                        processing ||
                                                        !data.message.trim()
                                                    }
                                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    {processing
                                                        ? t('common.sending')
                                                        : t('common.send')}
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Sağ Panel */}
                        <div className="space-y-6">
                            {/* Kullanıcı Bilgileri */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className="mb-6 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    <FaUser className="h-5 w-5 text-gray-400" />
                                    {t('ticket.userInfo')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                {ticket.user.name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                {ticket.user.name}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {ticket.user.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
                                        <dl className="space-y-3">
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.createdAt')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(
                                                        ticket.created_at,
                                                    )}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.lastReply')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(
                                                        ticket.last_reply_at,
                                                    )}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.category')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {t(
                                                        `ticket.category.${ticket.category}`,
                                                    )}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Geçmişi */}
                            <div className="rounded-2xl bg-white p-6 shadow-sm dark:bg-gray-800">
                                <h2 className="mb-6 flex items-center gap-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                                    <FaHistory className="h-5 w-5 text-gray-400" />
                                    {t('ticket.history')}
                                </h2>
                                <TicketHistoryPanel
                                    history={ticket.history as any}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Resim Önizleme Modalı */}
            <PreviewModal
                isOpen={!!previewImage}
                imageUrl={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </AuthenticatedLayout>
    );
}

// Yardımcı Bileşenler
const AttachmentItem = ({ attachment, onPreview }: AttachmentItemProps) => {
    const isImage = attachment.type.startsWith('image/');
    const fileSize = formatFileSize(attachment.size);

    return (
        <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-white p-2.5 shadow-sm transition-colors hover:border-indigo-200 dark:border-gray-700/50 dark:bg-gray-800/50 dark:hover:border-indigo-700/50">
            <div className="rounded-lg bg-gray-50 p-2 dark:bg-gray-800">
                {isImage ? (
                    <FaImage className="h-4 w-4 text-indigo-500" />
                ) : (
                    <FaFile className="h-4 w-4 text-gray-400" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">
                    {attachment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fileSize}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {isImage && (
                    <button
                        onClick={onPreview}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-800"
                    >
                        <FaEye className="h-4 w-4" />
                    </button>
                )}
                <a
                    href={attachment.url}
                    download
                    className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-50 hover:text-indigo-600 dark:hover:bg-gray-800"
                >
                    <FaDownload className="h-4 w-4" />
                </a>
            </div>
        </div>
    );
};

const formatFileSize = (size: number) => {
    if (size < 1024) {
        return `${size} B`;
    } else if (size < 1024 * 1024) {
        return `${(size / 1024).toFixed(2)} KB`;
    } else if (size < 1024 * 1024 * 1024) {
        return `${(size / (1024 * 1024)).toFixed(2)} MB`;
    } else {
        return `${(size / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
};
