import { useTranslation } from '@/Contexts/TranslationContext';
import { FaGoogle, FaGithub, FaFacebook } from 'react-icons/fa';

interface SocialAccountsListProps {
    connectedAccounts: {
        github: boolean;
        google: boolean;
        facebook: boolean;
    };
    className?: string;
}

const socialIcons = {
    github: FaGithub,
    google: FaGoogle,
    facebook: FaFacebook,
};

const socialColors = {
    github: 'text-gray-800 dark:text-gray-200',
    google: 'text-red-500',
    facebook: 'text-blue-600',
};

const socialNames = {
    github: 'GitHub',
    google: 'Google',
    facebook: 'Facebook',
};

export default function SocialAccountsList({ connectedAccounts, className = '' }: SocialAccountsListProps) {
    const { t } = useTranslation();
    
    // Sadece bağlı hesapları filtrele
    const connectedProviders = Object.entries(connectedAccounts)
        .filter(([_, isConnected]) => isConnected);

    if (connectedProviders.length === 0) {
        return (
            <div className={className}>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                    {t('no_connected_accounts')}
                </p>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="space-y-4">
                {connectedProviders.map(([provider]) => {
                    const Icon = socialIcons[provider as keyof typeof socialIcons];
                    const colorClass = socialColors[provider as keyof typeof socialColors];
                    const providerName = socialNames[provider as keyof typeof socialNames];

                    return (
                        <div key={provider} 
                             className="flex items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div className="flex items-center flex-1">
                                <Icon className={`h-6 w-6 ${colorClass}`} />
                                <span className="ml-3 font-medium text-gray-900 dark:text-gray-100">
                                    {providerName}
                                </span>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400">
                                {t('connected')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
} 