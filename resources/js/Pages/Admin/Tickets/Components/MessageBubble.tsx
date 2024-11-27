import React from 'react';
import { FaUser, FaHeadset, FaQuoteRight } from 'react-icons/fa';
import type { MessageBubbleProps } from '@/types/tickets';
import AttachmentItem from './AttachmentItem';
import { formatDate } from '@/utils/format';

export default function MessageBubble({
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
}: MessageBubbleProps) {
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
                        onClick={() => onQuote(message)}
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
} 