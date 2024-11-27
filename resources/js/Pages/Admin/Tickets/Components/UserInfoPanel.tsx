import React from 'react';
import { FaUser, FaEnvelope, FaCalendar, FaMapMarkerAlt, FaPhone, FaGlobe } from 'react-icons/fa';
import { useTranslation } from '@/Contexts/TranslationContext';
import { User } from '@/types/tickets';

interface UserInfoPanelProps {
    user: User;
}

export default function UserInfoPanel({ user }: UserInfoPanelProps) {
    const { t } = useTranslation();

    const formatDate = (dateString: string | ((created_at: any) => React.ReactNode)) => {
        if (typeof dateString === 'function') return '';
        
        return new Date(dateString).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
            <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {t('ticket.userInformation')}
                </h2>
            </div>

            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    {user.avatar ? (
                        <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-16 h-16 rounded-full object-cover ring-2 ring-white dark:ring-gray-700"
                        />
                    ) : (
                        <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30 
                            flex items-center justify-center ring-2 ring-white dark:ring-gray-700">
                            <FaUser className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                        </div>
                    )}
                    <div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            ID: #{user.id}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 
                            flex items-center justify-center">
                            <FaEnvelope className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('common.email')}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 
                            flex items-center justify-center">
                            <FaCalendar className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {t('common.memberSince')}
                            </p>
                            <p className="text-sm text-gray-900 dark:text-gray-100">
                                {typeof user.created_at === 'string' ? formatDate(user.created_at) : ''}
                            </p>
                        </div>
                    </div>

                    {user.last_login_at && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 
                                flex items-center justify-center">
                                <FaUser className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('common.lastLogin')}
                                </p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {typeof user.last_login_at === 'string' ? formatDate(user.last_login_at) : ''}
                                </p>
                            </div>
                        </div>
                    )}

                    {user.social_login && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 
                                flex items-center justify-center">
                                <FaGlobe className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {t('common.socialLogin')}
                                </p>
                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                    {user.social_login || t('common.unknown')}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 