import React from 'react';
import { FaImage, FaFile, FaEye, FaDownload } from 'react-icons/fa';
import { AttachmentItemProps } from '@/types/tickets';
import { formatFileSize } from '@/utils/format';

export default function AttachmentItem({ attachment, onPreview }: AttachmentItemProps) {
    const isImage = attachment.type.startsWith('image/');
    const fileSize = formatFileSize(attachment.size);

    return (
        <div className="flex items-center gap-3 p-2.5 rounded-lg bg-white dark:bg-gray-800/50 
            border border-gray-100 dark:border-gray-700/50 hover:border-indigo-200 
            dark:hover:border-indigo-700/50 transition-colors shadow-sm">
            <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                {isImage ? 
                    <FaImage className="w-4 h-4 text-indigo-500" /> : 
                    <FaFile className="w-4 h-4 text-gray-400" />
                }
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {attachment.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {fileSize}
                </p>
            </div>
            <div className="flex items-center gap-2">
                {isImage && (
                    <button
                        onClick={onPreview}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 
                            hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                        <FaEye className="w-4 h-4" />
                    </button>
                )}
                <a
                    href={attachment.url}
                    download
                    className="p-1.5 rounded-lg text-gray-500 hover:text-indigo-600 
                        hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                    <FaDownload className="w-4 h-4" />
                </a>
            </div>
        </div>
    );
} 