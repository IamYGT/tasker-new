import React, { useState, useRef } from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useTranslation } from '@/Contexts/TranslationContext';
import { toast } from 'react-hot-toast';
import UserInfoPanel from './Components/UserInfoPanel';
import TicketHistoryPanel from './Components/TicketHistoryPanel';
import PreviewModal from './Components/PreviewModal';
import StatusSelect from './Components/StatusSelect';
import MessageBubble from './Components/MessageBubble';
import { TicketShowPageProps, TicketFormData } from '@/types/tickets';
import TicketHeader from './Components/TicketHeader';

export default function Show({ auth, ticket, statuses }: TicketShowPageProps) {
    const { t } = useTranslation();
    const [isReplying, setIsReplying] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [isAttachmentLoading, setIsAttachmentLoading] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(ticket.status);
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replyFormRef = useRef<HTMLDivElement>(null);
    const attachmentsContainerRef = useRef<HTMLDivElement>(null);

    const { data, setData, post, processing, reset } = useForm<TicketFormData>({
        message: '',
        status: currentStatus,
        attachments: [],
        quote: null,
    });

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
                setData('status', newStatus);
            },
            onError: () => {
                toast.error(t('common.error'));
            },
            onFinish: () => {
                setIsStatusUpdating(false);
            }
        });
    };

    const handleQuote = (message: string) => {
        setData('quote', message);
        setIsReplying(true);
        
        setTimeout(() => {
            replyFormRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    };

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

    const handlePreviewImage = (url: string) => {
        setPreviewImage(url);
        if (url.match(/\.(jpg|jpeg|png|gif)$/i)) {
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
                    setCurrentStatus(data.status);
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

    return (
        <AuthenticatedLayout 
            auth={{
                user: {
                    ...auth.user,
                    roles: auth.user.roles || [{ name: 'user' }]
                }
            }}
        >
            <Head title={`${t('ticket.ticket')} #${ticket.id}`} />
            
            <div className="max-w-7xl mx-auto py-6 space-y-6">
                <TicketHeader
                    ticket={ticket}
                    currentStatus={currentStatus}
                    statuses={statuses}
                    isStatusUpdating={isStatusUpdating}
                    onStatusChange={handleStatusChange}
                    t={t}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <MessageBubble
                            isAdmin={false}
                            message={ticket.message}
                            user={ticket.user}
                            date={ticket.created_at}
                            attachments={ticket.attachments}
                            onPreviewImage={handlePreviewImage}
                            onQuote={handleQuote}
                            isReplying={isReplying}
                            handleAttachmentClick={handleAttachmentClick}
                            setIsReplying={setIsReplying}
                            t={t}
                        />

                        {ticket.replies.map((reply) => (
                            <MessageBubble
                                key={reply.id}
                                isAdmin={reply.is_admin}
                                message={reply.message}
                                user={reply.user}
                                date={reply.created_at}
                                attachments={reply.attachments}
                                quote={reply.quote}
                                onPreviewImage={handlePreviewImage}
                                onQuote={handleQuote}
                                isReplying={isReplying}
                                handleAttachmentClick={handleAttachmentClick}
                                setIsReplying={setIsReplying}
                                t={t}
                            />
                        ))}
                    </div>

                    <div className="space-y-6">
                        <UserInfoPanel user={ticket.user} />
                        <TicketHistoryPanel history={ticket.history} />
                    </div>
                </div>
            </div>

            <PreviewModal
                isOpen={!!previewImage}
                imageUrl={previewImage}
                onClose={() => setPreviewImage(null)}
            />
        </AuthenticatedLayout>
    );
} 