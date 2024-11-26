import { User } from '@/@types';
import { ReactNode } from 'react';

export interface Attachment {
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
}

export interface Message {
    id: number;
    user: User;
    message: string;
    created_at: string;
    attachments: Attachment[];
    quote?: string;
    is_admin: boolean;
}

export interface TicketHistory {
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

export interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    category: string;
    user: User;
    replies: Message[];
    created_at: string;
    last_reply_at: string;
    history: TicketHistory[];
    attachments: Attachment[];
}

export interface TicketFormData {
    message: string;
    status: string;
    attachments: File[];
    quote: string | null;
}

export interface TicketShowPageProps {
    ticket: Ticket;
    statuses: string[];
    priorities: string[];
    categories: string[];
}

export interface AttachmentItemProps {
    attachment: {
        id: number;
        name: string;
        url: string;
        type: string;
        size: number;
    };
    onPreview: () => void;
}

export interface AuthenticatedLayoutProps {
    user: User;
    header?: ReactNode;
    children: ReactNode;
}

export type SetTicketData = {
    (key: keyof TicketFormData, value: TicketFormData[keyof TicketFormData]): void;
    (data: { [K in keyof TicketFormData]: TicketFormData[K] }): void;
}

export interface MessageUser {
    name: string;
    avatar?: string;
    social_login: boolean;
    roles: any[];
}

export interface MessageBubbleProps {
    isAdmin: boolean;
    message: string;
    user: MessageUser;
    date: string;
    attachments?: Array<{
        id: number;
        name: string;
        url: string;
        type: string;
        size: number;
    }>;
    quote?: string;
    onPreviewImage: (url: string) => void;
    onQuote: (text: string) => void;
    t: (key: string, params?: Record<string, any>) => string;
} 