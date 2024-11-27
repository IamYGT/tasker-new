import React from 'react';
import { FaTicketAlt } from 'react-icons/fa';
import { PriorityBadge } from './Badges';
import StatusSelect from './StatusSelect';

interface TicketHeaderProps {
    ticket: {
        id: number;
        subject: string;
        priority: string;
        created_at: string;
    };
    currentStatus: string;
    statuses: string[];
    isStatusUpdating: boolean;
    onStatusChange: (status: string) => void;
    t: (key: string) => string;
}

export default function TicketHeader({
    ticket,
    currentStatus,
    statuses,
    isStatusUpdating,
    onStatusChange,
    t
}: TicketHeaderProps) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-8">
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
                            <span>{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusSelect
                        currentStatus={currentStatus}
                        statuses={statuses}
                        onChange={onStatusChange}
                        isLoading={isStatusUpdating}
                        t={t}
                    />
                </div>
            </div>
        </div>
    );
} 