import React from 'react';
import { FaQuoteRight } from 'react-icons/fa';

interface QuoteButtonProps {
    onClick: () => void;
    t: (key: string) => string;
}

export default function QuoteButton({ onClick, t }: QuoteButtonProps) {
    return (
        <button
            onClick={onClick}
            className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-gray-50 
                dark:hover:bg-gray-800 rounded-lg transition-colors"
            title={t('ticket.quote')}
        >
            <FaQuoteRight className="w-4 h-4" />
        </button>
    );
} 