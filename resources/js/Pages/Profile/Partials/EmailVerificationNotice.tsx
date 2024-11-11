import { Link } from '@inertiajs/react';
import { useTranslation } from '@/Contexts/TranslationContext';

interface EmailVerificationNoticeProps {
    status?: string;
}

export default function EmailVerificationNotice({ status }: EmailVerificationNoticeProps) {
    const { t } = useTranslation();

    return (
        <div>
            <p className="mt-2 text-sm text-gray-800 dark:text-gray-200">
                {t('email_unverified')}
                <Link
                    href={route('verification.send')}
                    method="post"
                    as="button"
                    className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                >
                    {t('resend_verification')}
                </Link>
            </p>

            {status === 'verification-link-sent' && (
                <div className="mt-2 text-sm font-medium text-green-600 dark:text-green-400">
                    {t('verification_link_sent')}
                </div>
            )}
        </div>
    );
} 