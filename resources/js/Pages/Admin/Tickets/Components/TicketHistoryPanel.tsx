import React from 'react';
import { FaHistory, FaUser, FaExchangeAlt, FaReply, FaTag, FaCheckCircle } from 'react-icons/fa';
import { useTranslation } from '@/Contexts/TranslationContext';

interface TicketHistory {
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
    history: TicketHistory[];
}

export default function TicketHistoryPanel({ history }: TicketHistoryPanelProps) {
    const { t } = useTranslation();

    if (!history || history.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-400">
                    {t('ticket.noHistory')}
                </p>
            </div>
        );
    }

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
        const date = new Date(dateString);
        return date.toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('tr-TR', {
            day: 'numeric',
            month: 'short'
        });
    };

    // Tarihe göre grupla
    const groupedHistory = history.reduce((groups: { [key: string]: TicketHistory[] }, item) => {
        const date = new Date(item.created_at).toLocaleDateString('tr-TR');
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(item);
        return groups;
    }, {});

    return (
        <div className="space-y-4">
            {Object.entries(groupedHistory).map(([date, items]) => (
                <div key={date} className="space-y-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        {formatDate(items[0].created_at)}
                    </div>
                    {items.map((item) => (
                        <div key={item.id} className="flex items-start gap-3 py-2">
                            <div className="mt-1">
                                {getIcon(item.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                    <span className="font-medium text-gray-900 dark:text-gray-100">
                                        {item.user.name}
                                    </span>
                                    {' '}
                                    {t(`ticket.actions.${item.action.replace('ticket.', '')}`, item.params)}
                                </p>
                                <span className="text-xs text-gray-500">
                                    {formatTime(item.created_at)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
}
