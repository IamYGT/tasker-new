import React from 'react';
import { FaHistory, FaUser, FaExchangeAlt, FaReply, FaTag, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from '@/Contexts/TranslationContext';

interface HistoryItem {
    id: number;
    action: string;
    type: 'status' | 'reply' | 'create' | 'priority' | 'category';
    params?: {
        from?: string;
        to?: string;
        [key: string]: any;
    };
    user: {
        name: string;
    };
    created_at: string;
}

interface TicketHistoryPanelProps {
    history: HistoryItem[];
}

export default function TicketHistoryPanel({ history }: TicketHistoryPanelProps) {
    const { t } = useTranslation();

    const getIcon = (type: string) => {
        switch (type) {
            case 'status':
                return <FaExchangeAlt className="w-4 h-4 text-blue-500" />;
            case 'reply':
                return <FaReply className="w-4 h-4 text-green-500" />;
            case 'create':
                return <FaCheckCircle className="w-4 h-4 text-purple-500" />;
            case 'priority':
                return <FaTag className="w-4 h-4 text-orange-500" />;
            default:
                return <FaHistory className="w-4 h-4 text-gray-400" />;
        }
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Tarihe göre grupla
    const groupedHistory = history.reduce((groups: { [key: string]: HistoryItem[] }, item) => {
        const date = new Date(item.created_at).toLocaleDateString('tr-TR');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('ticket.history')}
                </h2>
            </div>

            <div className="p-6">
                {Object.entries(groupedHistory).length > 0 ? (
                    Object.entries(groupedHistory).map(([date, items]) => (
                        <div key={date} className="space-y-2">
                            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 
                                uppercase tracking-wider mb-3">
                                {formatDate(items[0].created_at)}
                            </div>
                            
                            <div className="relative">
                                <div className="absolute top-0 bottom-0 left-[19px] w-px 
                                    bg-gray-200 dark:bg-gray-700" />
                                
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-start gap-3">
                                            <div className="relative z-10 mt-1">
                                                <div className="w-10 h-10 rounded-lg bg-gray-50 
                                                    dark:bg-gray-800 flex items-center justify-center">
                                                    {getIcon(item.type)}
                                                </div>
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    <span className="font-medium text-gray-900 
                                                        dark:text-gray-100">
                                                        {item.user.name}
                                                    </span>
                                                    {' '}
                                                    {t(`ticket.actions.${item.action}`, item.params)}
                                                </p>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(item.created_at)}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('ticket.noHistory')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 