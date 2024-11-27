import React, { useState, useRef, useEffect } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { FaReply, FaClock, FaUser, FaTag, FaHistory, FaPaperclip, FaEye, FaDownload, FaTimes, FaTicketAlt, FaQuoteRight, FaHeadset, FaImage, FaFile } from 'react-icons/fa';
import { PriorityBadge, StatusBadge } from './Components/Badges';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import UserInfoPanel from './Components/UserInfoPanel';
import TicketHistoryPanel from './Components/TicketHistoryPanel';
import PreviewModal from './Components/PreviewModal';
import StatusSelect from './Components/StatusSelect';


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
            id: number;
            name: string;
        }
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
    isReplying: boolean;
    handleAttachmentClick: (url: string) => Promise<void>;
    setIsReplying: (value: boolean) => void;
    t: (key: string, params?: Record<string, any>) => string;
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
    onQuote,
    isReplying,
    handleAttachmentClick,
    setIsReplying,
    t 
}: MessageBubbleProps) => {
    return (
        <div className={`group flex gap-3 p-2 transition-all ${
            isAdmin ? 'flex-row-reverse' : 'flex-row'
        }`}>
            {/* Avatar */}
            <div className="flex-shrink-0">
                <div className="relative">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.name} 
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-white 
                                dark:ring-gray-700 shadow-sm" 
                        />
                    ) : (
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm
                            ${isAdmin ? 'bg-indigo-100 dark:bg-indigo-900/50' : 'bg-emerald-100 dark:bg-emerald-900/50'}`}>
                            <FaUser className={`w-5 h-5 
                                ${isAdmin ? 'text-indigo-600 dark:text-indigo-400' : 'text-emerald-600 dark:text-emerald-400'}`} 
                            />
                        </div>
                    )}
                    {isAdmin && (
                        <div className="absolute -bottom-0.5 -right-0.5 bg-indigo-500 rounded-full p-1">
                            <FaHeadset className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                </div>
            </div>

            {/* Mesaj İçeriği */}
            <div className={`flex-1 min-w-0 space-y-1.5 p-3 rounded-xl shadow-sm ${
                isAdmin 
                    ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                    : 'bg-emerald-50 dark:bg-emerald-900/20'
            }`}>
                {/* Alıntı varsa göster */}
                {quote && (
                    <div className="p-2 mb-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm text-gray-600 dark:text-gray-400 border-l-2 border-gray-300 dark:border-gray-600">
                        {quote}
                    </div>
                )}
                <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium text-sm ${
                        isAdmin 
                            ? 'text-indigo-900 dark:text-indigo-100' 
                            : 'text-emerald-900 dark:text-emerald-100'
                    }`}>
                        {user.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {formatDate(date)}
                    </span>
                </div>

                <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                    {message}
                </div>

                {/* Ekler */}
                {attachments && attachments.length > 0 && (
                    <div className="mt-2 space-y-1.5 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                        {attachments.map((attachment) => (
                            <AttachmentItem
                                key={attachment.id}
                                attachment={attachment}
                                onPreview={() => {
                                    onPreviewImage(attachment.url);
                                    // Eğer resim ise ve yanıt formu açıksa, direkt olarak ekle
                                    if (attachment.type.startsWith('image/') && isReplying) {
                                        handleAttachmentClick(attachment.url);
                                    }
                                }}
                            />
                        ))}
                    </div>
                )}

                {/* Mesaj Aksiyonları */}
                <div className="flex items-center justify-end gap-2 mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                    <button
                        onClick={() => {
                            onQuote();
                            // Yanıt formunu otomatik aç
                            setIsReplying(true);
                        }}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 
                            dark:text-gray-400 dark:hover:text-indigo-400 transition-colors"
                    >
                        <FaQuoteRight className="w-3 h-3" />
                        {t('ticket.quote')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default function Show({ auth, ticket, statuses }: Props) {
    const { t } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isAttachmentLoading, setIsAttachmentLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replyFormRef = useRef<HTMLDivElement>(null);
    const [currentStatus, setCurrentStatus] = useState(ticket.status);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);
    const attachmentsContainerRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset } = useForm({
        message: '',
        status: currentStatus,
        attachments: [] as File[],
        quote: '' as string | null,
    });

    // Status değişikliklerini senkronize et
    useEffect(() => {
        setData('status', currentStatus);
    }, [currentStatus]);

    // Statü değişim fonksiyonu
    const handleStatusChange = async (newStatus: string) => {
        if (newStatus === currentStatus) return;
        
        setIsStatusUpdating(true);
        
        router.put(route('admin.tickets.update-status', ticket.id), {
            status: newStatus
        }, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setCurrentStatus(newStatus);
                setData('status', newStatus); // Form verisini de güncelle
                // Toast mesajı otomatik olarak flash message'dan gelecek
            },
            onError: () => {
                toast.error(t('common.error'));
            },
            onFinish: () => {
                setIsStatusUpdating(false);
            }
        });
    };

    // Alıntı yapma işlemi güncellendi
    const handleQuote = (message: string) => {
        setData('quote', message);
        setIsReplying(true);
        
        // Scroll işlemi için setTimeout kullan
        // Bu, form açıldıktan sonra scroll yapılmasını sağlar
        setTimeout(() => {
            replyFormRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

    // Yeni fonksiyon: Resim URL'sini dosya olarak indirip form'a eklemek için
    const handleAttachmentClick = async (url: string) => {
        setIsAttachmentLoading(true);
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const fileName = url.split('/').pop() || 'image.jpg';
            const file = new File([blob], fileName, { type: blob.type });
            
            if (!isReplying) {
                setIsReplying(true);
            }
            
            setData('attachments', [...data.attachments, file]);
            
            setTimeout(() => {
                attachmentsContainerRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
            
            toast.success(t('ticket.attachmentAdded'));
        } catch (error) {
            console.error('Dosya ekleme hatası:', error);
            toast.error(t('common.error'));
        } finally {
            setIsAttachmentLoading(false);
        }
    };

    // PreviewModal'ı güncelleyelim
    const handlePreviewImage = (url: string) => {
        setPreviewImage(url);
        // Eğer bir resim önizleniyorsa
        if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
            // Form kapalıysa aç
            if (!isReplying) {
                setIsReplying(true);
            }
            
            handleAttachmentClick(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const formData = new FormData();
        formData.append('message', data.message);
        formData.append('status', data.status);
        
        if (data.quote) {
            formData.append('quote', data.quote);
        }
        
        if (data.attachments.length > 0) {
            data.attachments.forEach((file, index) => {
                formData.append(`attachments[${index}]`, file);
            });
        }

        try {
            await router.post(route('admin.tickets.reply', ticket.id), formData, {
                forceFormData: true,
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setCurrentStatus(data.status); // Global state'i güncelle
                    setData('message', '');
                    setData('quote', null);
                    setData('attachments', []);
                    setIsReplying(false);
                    toast.success(t('ticket.replyAdded'));
                },
                onError: (errors) => {
                    console.error('Reply errors:', errors);
                    toast.error(t('common.error'));
                }
            });
        } catch (error) {
            console.error('Reply failed:', error);
            toast.error(t('common.error'));
        }
    };

    // Dosya yükleme işleyicisini güncelle
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        
        const validFiles = files.filter(file => {
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

        if (validFiles.length > 0) {
            setData('attachments', [...data.attachments, ...validFiles]);
            
            // Form kapalıysa aç
            if (!isReplying) {
                setIsReplying(true);
                
                // Scroll işlemi
                setTimeout(() => {
                    replyFormRef.current?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }, 100);
            }
        }
    };

    const removeAttachment = (index: number) => {
        const newAttachments = [...data.attachments];
        newAttachments.splice(index, 1);
        setData('attachments', newAttachments);
    };

    // Reset fonksiyonunu güncelle
    const resetForm = () => {
        setIsReplying(false);
        setData({
            message: '',
            status: currentStatus, // Global state ile senkronize et
            attachments: [],
            quote: null
        });
    };

    useEffect(() => {
        let isSubscribed = true;

        // Cleanup function
        return () => {
            isSubscribed = false;
            // Açık kalan modal varsa kapat
            setPreviewImage(null);
            // Form state'ini temizle
            resetForm();
        };
    }, []);

    return (
        <AuthenticatedLayout auth={{user: {...auth.user, roles: [{name: auth.user.name}]}}}>
            <Head title={`${t('ticket.ticket')} #${ticket.id}`} />
            
            <div className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Üst Bilgi Kartı */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8 mb-8">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl">
                                    <FaTicketAlt className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <div className="flex flex-col">
                                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                                        {ticket.subject}
                                    </h1>
                                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                                        <span className="font-medium">#{ticket.id}</span>
                                        <span>•</span>
                                        <span>{formatDate(ticket.created_at)}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <PriorityBadge priority={ticket.priority} />
                                <StatusSelect
                                    currentStatus={data.status}
                                    statuses={statuses}
                                    onChange={(status) => {
                                        setData('status', status);
                                        // Eğer form açık değilse, global state'i de güncelle
                                        if (!isReplying) {
                                            handleStatusChange(status);
                                        }
                                    }}
                                    t={t}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ana İçerik Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Sol Taraf - Mesajlaşma */}
                        <div className="lg:col-span-3 space-y-6">
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                                {/* Mesajlar */}
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <div className="space-y-4 p-6">
                                        <MessageBubble
                                            isAdmin={false}
                                            message={ticket.message}
                                            user={ticket.user}
                                            date={ticket.created_at}
                                            attachments={ticket.attachments}
                                            onPreviewImage={handlePreviewImage}
                                            onQuote={() => handleQuote(ticket.message)}
                                            isReplying={isReplying}
                                            handleAttachmentClick={handleAttachmentClick}
                                            setIsReplying={setIsReplying}
                                            t={t}
                                        />

                                        {ticket.replies.map((reply) => (
                                            <MessageBubble
                                                key={reply.id}
                                                isAdmin={reply.user.id === auth.user.id}
                                                message={reply.message}
                                                user={reply.user}
                                                date={reply.created_at}
                                                attachments={reply.attachments}
                                                quote={reply.quote}
                                                onPreviewImage={handlePreviewImage}
                                                onQuote={() => handleQuote(reply.message)}
                                                isReplying={isReplying}
                                                handleAttachmentClick={handleAttachmentClick}
                                                setIsReplying={setIsReplying}
                                                t={t}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Yanıt Formu */}
                                <div ref={replyFormRef} className="border-t dark:border-gray-700 p-6">
                                    {!isReplying ? (
                                        <button
                                            onClick={() => setIsReplying(true)}
                                            className="w-full py-6 px-8 border-2 border-dashed border-gray-200 
                                                dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 
                                                hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 
                                                dark:hover:border-gray-600 transition-colors"
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <FaReply className="w-4 h-4" />
                                                <span>{t('ticket.clickToReply')}</span>
                                            </div>
                                        </button>
                                    ) : (
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            {data.quote && (
                                                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <FaQuoteRight className="w-4 h-4 text-gray-400" />
                                                        <span className="text-sm text-gray-500">{t('ticket.quote')}</span>
                                                    </div>
                                                    <div className="text-sm text-gray-600 dark:text-gray-300">
                                                        {data.quote}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <label className="text-sm text-gray-600 dark:text-gray-400">
                                                        {t('ticket.updateStatus')}
                                                    </label>
                                                    <StatusSelect
                                                        currentStatus={data.status}
                                                        statuses={statuses}
                                                        onChange={(status) => {
                                                            setData('status', status);
                                                            // Eğer form açık değilse, global state'i de güncelle
                                                            if (!isReplying) {
                                                                handleStatusChange(status);
                                                            }
                                                        }}
                                                        t={t}
                                                    />
                                                </div>

                                                <textarea
                                                    value={data.message}
                                                    onChange={e => setData('message', e.target.value)}
                                                    className="w-full rounded-xl border-gray-300 dark:border-gray-700 
                                                        dark:bg-gray-800 dark:text-gray-100 shadow-sm 
                                                        focus:border-indigo-500 focus:ring-indigo-500"
                                                    rows={6}
                                                    placeholder={t('ticket.writeReply')}
                                                />
                                            </div>

                                            {/* Dosya Yükleme */}
                                            <div className="space-y-4">
                                                <div className="flex items-center gap-4">
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileChange}
                                                        multiple
                                                        className="hidden"
                                                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="flex items-center gap-2 text-sm text-gray-500 
                                                            hover:text-gray-700 dark:text-gray-400 
                                                            dark:hover:text-gray-300"
                                                    >
                                                        <FaPaperclip className="w-4 h-4" />
                                                        {t('ticket.attachFiles')}
                                                    </button>
                                                </div>

                                                {/* Yüklenen Dosyalar */}
                                                {data.attachments.length > 0 && (
                                                    <div ref={attachmentsContainerRef} className="space-y-2">
                                                        {data.attachments.map((file, index) => (
                                                            <div key={index} className="flex items-center justify-between 
                                                                p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                                <span className="text-sm text-gray-600 
                                                                    dark:text-gray-400 truncate">
                                                                    {file.name}
                                                                </span>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeAttachment(index)}
                                                                    className="text-red-500 hover:text-red-700"
                                                                >
                                                                    <FaTimes className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Form Aksiyonları */}
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsReplying(false);
                                                        resetForm();
                                                    }}
                                                    className="px-4 py-2 text-sm text-gray-700 
                                                        dark:text-gray-300 hover:text-gray-900 
                                                        dark:hover:text-gray-100"
                                                >
                                                    {t('common.cancel')}
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={processing || !data.message.trim()}
                                                    className="px-4 py-2 text-sm font-medium text-white 
                                                        bg-indigo-600 hover:bg-indigo-700 rounded-lg 
                                                        disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {processing ? t('common.sending') : t('common.send')}
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
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6 
                                    flex items-center gap-2">
                                    <FaUser className="w-5 h-5 text-gray-400" />
                                    {t('ticket.userInfo')}
                                </h2>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                            <span className="text-lg font-medium text-gray-600 dark:text-gray-300">
                                                {ticket.user.name.charAt(0).toUpperCase()}
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
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <dl className="space-y-3">
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.createdAt')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(ticket.created_at)}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.lastReply')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {formatDate(ticket.last_reply_at)}
                                                </dd>
                                            </div>
                                            <div className="flex justify-between">
                                                <dt className="text-sm text-gray-500 dark:text-gray-400">
                                                    {t('ticket.category')}
                                                </dt>
                                                <dd className="text-sm text-gray-900 dark:text-gray-100">
                                                    {t(`ticket.category.${ticket.category}`)}
                                                </dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </div>

                            {/* Ticket Geçmişi */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-6
                                    flex items-center gap-2">
                                    <FaHistory className="w-5 h-5 text-gray-400" />
                                    {t('ticket.history')}
                                </h2>
                                <TicketHistoryPanel history={ticket.history as any} />
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
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-gray-800/50 
            border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 
            dark:hover:border-indigo-700/50 transition-colors shadow-sm">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {isImage ? 
                    <FaImage className="w-4 h-4 text-indigo-500" /> : 
                    <FaFile className="w-4 h-4 text-gray-400" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
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
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 
                            hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaEye className="w-4 h-4" />
                    </button>
                )}
                <a
                    href={attachment.url}
                    download
                    className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 
                        hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <FaDownload className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
};

const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
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