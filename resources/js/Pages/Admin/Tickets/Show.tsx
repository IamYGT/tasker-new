import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaReply, FaClock, FaUser, FaTag, FaExclamationCircle, FaLock, FaUnlock, FaHistory, FaEdit, FaTrash, FaPaperclip, FaEye, FaDownload, FaTimes } from 'react-icons/fa';
import { PriorityBadge, StatusBadge } from './Components/Badges';
import { motion } from 'framer-motion';
import { Transition } from '@headlessui/react';
import { toast } from 'react-hot-toast';

interface Message {
    id: number;
    user: {
        id: number;
        name: string;
        email: string;
    };
    message: string;
    created_at: string;
    attachments: Attachment[];
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
    auth: any;
    ticket: Ticket;
    statuses: string[];
}

export default function Show({ auth, ticket, statuses }: Props) {
    const { t } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [selectedAttachments, setSelectedAttachments] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Null check yardımcı fonksiyonu
    const safeArray = <T,>(arr: T[] | undefined | null): T[] => {
        return arr || [];
    };

    const { data, setData, post, processing, reset, errors } = useForm({
        message: '',
        status: ticket.status,
        attachments: [] as File[],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('admin.tickets.reply', ticket.id), {
            onSuccess: () => {
                reset('message');
                setIsReplying(false);
                toast.success(t('ticket.replySent'));
            },
        });
    };

    const handleStatusChange = (newStatus: string) => {
        // Form verisi oluştur
        const formData = new FormData();
        formData.append('_method', 'PUT'); // Laravel method spoofing
        formData.append('status', newStatus);

        // Axios veya fetch kullanarak PUT isteği gönder
        router.post(route('admin.tickets.update-status', ticket.id), {
            _method: 'PUT', // Laravel method spoofing
            status: newStatus
        }, {
            preserveScroll: true,
            onSuccess: () => toast.success(t('ticket.statusUpdated')),
        });
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setSelectedAttachments(Array.from(e.target.files));
            setData('attachments', Array.from(e.target.files));
        }
    };

    return (
        <AuthenticatedLayout auth={auth}>
            <Head title={`${t('ticket.ticket')} #${ticket.id}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
                        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                            {ticket.subject}
                                        </h1>
                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <FaUser className="w-4 h-4" />
                                                <span>{ticket.user.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaClock className="w-4 h-4" />
                                                <span>{formatDate(ticket.created_at)}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaTag className="w-4 h-4" />
                                                <span>{t(`ticket.category.${ticket.category}`)}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-3">
                                        <PriorityBadge priority={ticket.priority} />
                                        <StatusBadge status={ticket.status} />
                                    </div>
                                </div>
                            </div>

                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/50 flex flex-wrap items-center gap-3">
                                <div className="flex-1">
                                    <select
                                        value={ticket.status}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="rounded-lg text-sm border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>
                                                {t(`ticket.statuses.${status}`)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={() => setShowHistory(!showHistory)}
                                    className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg"
                                >
                                    <FaHistory className="w-4 h-4 mr-2" />
                                    {t('ticket.history')}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200/50 dark:border-gray-700/50">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                                    {t('ticket.details')}
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{t('ticket.id')}</span>
                                        <span className="text-gray-900 dark:text-gray-100">#{ticket.id}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{t('ticket.createdAt')}</span>
                                        <span className="text-gray-900 dark:text-gray-100">{formatDate(ticket.created_at)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 dark:text-gray-400">{t('ticket.lastReply')}</span>
                                        <span className="text-gray-900 dark:text-gray-100">{formatDate(ticket.last_reply_at)}</span>
                                    </div>
                                </div>
                            </div>

                            {safeArray(ticket.attachments).length > 0 && (
                                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 border border-gray-200/50 dark:border-gray-700/50">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">
                                        {t('ticket.attachments')}
                                    </h3>
                                    <div className="space-y-2">
                                        {safeArray(ticket.attachments).map((file) => (
                                            <div key={file.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                                <div className="flex items-center space-x-3">
                                                    <FaPaperclip className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                                </div>
                                                <a
                                                    href={file.url}
                                                    download
                                                    className="p-1 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                                >
                                                    <FaDownload className="w-4 h-4" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden border border-gray-200/50 dark:border-gray-700/50">
                        <div className="p-6">
                            <div className="space-y-6">
                                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                {ticket.user.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                    {ticket.user.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(ticket.created_at)}
                                                </div>
                                            </div>
                                            <div className="mt-2 text-gray-700 dark:text-gray-300 prose dark:prose-invert max-w-none">
                                                {ticket.message}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {safeArray(ticket.replies).map((reply) => (
                                    <div 
                                        key={reply.id}
                                        className={`p-6 rounded-xl ${
                                            reply.user.id === auth.user.id
                                                ? 'bg-indigo-50 dark:bg-indigo-900/20 ml-6'
                                                : 'bg-gray-50 dark:bg-gray-700/50'
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {reply.user.name.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {reply.user.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        {formatDate(reply.created_at)}
                                                    </div>
                                                </div>
                                                <div className="mt-2 text-gray-700 dark:text-gray-300">
                                                    {reply.message}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <motion.div 
                                initial={false}
                                animate={{ height: isReplying ? 'auto' : 0, opacity: isReplying ? 1 : 0 }}
                                className="mt-6 overflow-hidden"
                            >
                                <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('ticket.yourReply')}
                                        </label>
                                        <textarea
                                            value={data.message}
                                            onChange={e => setData('message', e.target.value)}
                                            className="w-full rounded-xl border-0 ring-1 ring-gray-200 dark:ring-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 p-4 min-h-[120px]"
                                            placeholder={t('ticket.typeYourReply')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {t('ticket.attachments')}
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                            >
                                                <FaPaperclip className="w-4 h-4 mr-2" />
                                                {t('ticket.addFiles')}
                                            </button>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                onChange={handleFileSelect}
                                                multiple
                                                className="hidden"
                                            />
                                        </div>
                                        {selectedAttachments.length > 0 && (
                                            <div className="mt-2 space-y-2">
                                                {selectedAttachments.map((file, index) => (
                                                    <div key={index} className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded-lg">
                                                        <span className="text-sm text-gray-700 dark:text-gray-300">{file.name}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const newFiles = selectedAttachments.filter((_, i) => i !== index);
                                                                setSelectedAttachments(newFiles);
                                                                setData('attachments', newFiles);
                                                            }}
                                                            className="p-1 text-gray-400 hover:text-red-500"
                                                        >
                                                            <FaTrash className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setIsReplying(false);
                                                setSelectedAttachments([]);
                                                reset();
                                            }}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150"
                                            disabled={processing}
                                        >
                                            {t('common.cancel')}
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors duration-150 disabled:opacity-50"
                                            disabled={processing}
                                        >
                                            {processing ? t('common.sending') : t('ticket.sendReply')}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    </div>

                    <Transition show={showHistory}>
                        <div className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50">
                            <div className="fixed inset-0 overflow-y-auto">
                                <div className="flex min-h-full items-center justify-center p-4">
                                    <Transition.Child
                                        enter="ease-out duration-300"
                                        enterFrom="opacity-0 scale-95"
                                        enterTo="opacity-100 scale-100"
                                        leave="ease-in duration-200"
                                        leaveFrom="opacity-100 scale-100"
                                        leaveTo="opacity-0 scale-95"
                                    >
                                        <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                            <div className="flex justify-between items-center mb-4">
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                    {t('ticket.history')}
                                                </h3>
                                                <button
                                                    onClick={() => setShowHistory(false)}
                                                    className="text-gray-400 hover:text-gray-500"
                                                >
                                                    <span className="sr-only">{t('common.close')}</span>
                                                    <FaTimes className="w-5 h-5" />
                                                </button>
                                            </div>
                                            <div className="space-y-4">
                                                {safeArray(ticket.history).map((event) => (
                                                    <div key={event.id} className="flex items-start gap-3">
                                                        <div className="flex-shrink-0">
                                                            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                                                                <FaHistory className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                                                {event.user.name} {t(`ticket.actions.${event.action}`)}
                                                            </p>
                                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                                {formatDate(event.created_at)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </Transition.Child>
                                </div>
                            </div>
                        </div>
                    </Transition>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}; 