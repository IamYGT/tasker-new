import { Menu } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { FaCircle, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface StatusSelectProps {
    currentStatus: string;
    statuses: string[];
    onChange: (status: string) => void;
    isLoading?: boolean;
    t: (key: string) => string;
    ticketId: number;
}

export default function StatusSelect({
    currentStatus,
    statuses,
    onChange,
    isLoading = false,
    t,
    ticketId,
}: StatusSelectProps) {
    const [isStatusUpdating, setIsStatusUpdating] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'text-blue-500';
            case 'answered':
                return 'text-green-500';
            case 'closed':
                return 'text-gray-500';
            default:
                return 'text-gray-500';
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setIsStatusUpdating(true);

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('status', newStatus);

        try {
            await router.post(
                route('admin.tickets.update-status', ticketId),
                {
                    _method: 'PUT',
                    status: newStatus,
                },
                {
                    preserveScroll: true,
                    onSuccess: () => {
                        onChange(newStatus);
                        toast.success(t('ticket.statusUpdated'));
                    },
                    onError: () => {
                        toast.error(t('common.error'));
                    },
                    onFinish: () => {
                        setIsStatusUpdating(false);
                    },
                },
            );
        } catch (error) {
            console.error('Status update error:', error);
            toast.error(t('common.error'));
            setIsStatusUpdating(false);
        }
    };

    return (
        <Menu as="div" className="relative">
            <Menu.Button
                className="flex items-center gap-2 rounded-xl border-2 border-gray-200 bg-white px-4 py-2 text-sm font-medium transition-colors hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-gray-600"
                disabled={isLoading || isStatusUpdating}
            >
                {isLoading || isStatusUpdating ? (
                    <FaSpinner className="h-4 w-4 animate-spin" />
                ) : (
                    <FaCircle
                        className={`h-2 w-2 ${getStatusColor(currentStatus)}`}
                    />
                )}
                <span>{t(`ticket.status.${currentStatus}`)}</span>
                <svg
                    className="ml-1 h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </Menu.Button>

            <AnimatePresence>
                <Menu.Items
                    as={motion.div}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                    <div className="py-1">
                        {statuses.map((status) => (
                            <Menu.Item key={status}>
                                {({ active }) => (
                                    <button
                                        onClick={() =>
                                            handleStatusChange(status)
                                        }
                                        disabled={
                                            isLoading ||
                                            isStatusUpdating ||
                                            status === currentStatus
                                        }
                                        className={`${
                                            active
                                                ? 'bg-gray-100 dark:bg-gray-700'
                                                : ''
                                        } ${
                                            currentStatus === status
                                                ? 'bg-gray-50 dark:bg-gray-700'
                                                : ''
                                        } ${
                                            isLoading || isStatusUpdating
                                                ? 'cursor-not-allowed opacity-50'
                                                : ''
                                        } flex w-full items-center gap-2 px-4 py-2 text-sm`}
                                    >
                                        <FaCircle
                                            className={`h-2 w-2 ${getStatusColor(
                                                status,
                                            )}`}
                                        />
                                        {t(`ticket.status.${status}`)}
                                    </button>
                                )}
                            </Menu.Item>
                        ))}
                    </div>
                </Menu.Items>
            </AnimatePresence>
        </Menu>
    );
}
