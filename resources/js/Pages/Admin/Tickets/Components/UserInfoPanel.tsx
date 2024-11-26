import React from 'react';
import { FaUser, FaEnvelope } from 'react-icons/fa';
import { useTranslation } from '@/Contexts/TranslationContext';

interface UserInfoPanelProps {
    user: {
        name: string;
        email: string;
    };
}

export default function UserInfoPanel({ user }: UserInfoPanelProps) {
    const { t } = useTranslation();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
                {t('ticket.userInformation')}
            </h2>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <FaUser className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user.name}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <FaEnvelope className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                        {user.email}
                    </span>
                </div>
            </div>
        </div>
    );
} 