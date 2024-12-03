import { FaDownload, FaEye, FaQuoteRight } from 'react-icons/fa';
import { Attachment } from '../types';
import { formatDate, formatFileSize } from '../utils';

interface MessageBubbleProps {
    isAdmin: boolean;
    message: string;
    user: {
        name: string;
        avatar?: string;
    };
    date: string;
    attachments?: Attachment[];
    quote?: string;
    onPreviewImage: (url: string) => void;
    onQuote: () => void;
    t: (key: string, params?: Record<string, string | number>) => string;
}

interface AttachmentItemProps {
    attachment: Attachment;
    onPreview: () => void;
}

const AttachmentItem = ({ attachment, onPreview }: AttachmentItemProps) => {
    const isImage = attachment.type.startsWith('image/');

    return (
        <div className="flex items-center gap-2 rounded bg-gray-50 p-2">
            <div className="flex-1 truncate">
                {attachment.name}
                <span className="ml-2 text-sm text-gray-500">
                    ({formatFileSize(attachment.size)})
                </span>
            </div>
            <div className="flex gap-2">
                {isImage && (
                    <button
                        onClick={onPreview}
                        className="text-blue-600 hover:text-blue-800"
                    >
                        <FaEye />
                    </button>
                )}
                <a
                    href={attachment.url}
                    download
                    className="text-blue-600 hover:text-blue-800"
                >
                    <FaDownload />
                </a>
            </div>
        </div>
    );
};

export const MessageBubble = ({
    isAdmin,
    message,
    user,
    date,
    attachments = [],
    quote,
    onPreviewImage,
    onQuote,
    t,
}: MessageBubbleProps) => {
    const bubbleClass = isAdmin ? 'bg-blue-50 ml-auto' : 'bg-gray-50';

    return (
        <div className={`mb-4 max-w-3xl rounded-lg p-4 ${bubbleClass}`}>
            <div className="mb-2 flex items-start justify-between">
                <div className="flex items-center gap-2">
                    {user.avatar ? (
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="h-8 w-8 rounded-full"
                        />
                    ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                    )}
                    <span className="font-medium">{user.name}</span>
                </div>
                <button
                    onClick={onQuote}
                    className="text-gray-500 hover:text-gray-700"
                    title={t('ticket.quote')}
                >
                    <FaQuoteRight />
                </button>
            </div>

            {quote && (
                <div className="mb-2 border-l-4 border-gray-300 bg-gray-100 p-2 text-sm">
                    {quote}
                </div>
            )}

            <div className="mb-2 whitespace-pre-wrap">{message}</div>

            {attachments.length > 0 && (
                <div className="mt-4 space-y-2">
                    {attachments.map((attachment) => (
                        <AttachmentItem
                            key={attachment.id}
                            attachment={attachment}
                            onPreview={() => onPreviewImage(attachment.url)}
                        />
                    ))}
                </div>
            )}

            <div className="mt-2 text-sm text-gray-500">{formatDate(date)}</div>
        </div>
    );
};
