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
    id: number;
    name: string;
    email: string;
    avatar?: string | null;
    social_login?: boolean;
    roles?: Array<{ name: string }>;
}

export interface MessageBubbleProps {
    isAdmin: boolean;
    message: string;
    user: MessageUser;
    date: string;
    attachments?: Attachment[];
    quote?: string;
    onPreviewImage: (url: string) => void;
    onQuote: (text: string) => void;
    isReplying: boolean;
    handleAttachmentClick: (url: string) => Promise<void>;
    setIsReplying: (value: boolean) => void;
    t: (key: string, params?: Record<string, any>) => string;
}

export interface StatCardProps {
    title: string;
    value: number;
    icon: IconType;
    color: string;
    textColor: string;
    onClick?: () => void;
}

export interface StatusSelectProps {
    currentStatus: string;
    statuses: string[];
    onChange: (status: string) => void;
    isLoading?: boolean;
    t: (key: string) => string;
}

export interface PreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export interface QuoteButtonProps {
    onClick: () => void;
    t: (key: string) => string;
}

export interface TicketHistoryPanelProps {
    history: TicketHistory[];
}

export interface UserInfoPanelProps {
    user: User;
}

export interface TicketHeaderProps {
    ticket: {
        id: number;
        subject: string;
        priority: string;
        created_at: string;
    };
    currentStatus: string;
    statuses: string[];
    onStatusChange: (status: string) => void;
    isReplying: boolean;
    handleStatusChange: (status: string) => void;
    t: (key: string) => string;
    formatDate: (date: string) => string;
}

export interface TicketIndexPageProps {
    auth: {
        user: User;
    };
    tickets: {
        data: Ticket[];
        total: number;
        links: any[];
    };
    filters: {
        search?: string;
        status?: string;
        priority?: string;
        category?: string;
        sort?: string;
        direction?: 'asc' | 'desc';
    };
    statuses: string[];
    priorities: string[];
    categories: string[];
    stats: {
        total: number;
        open: number;
        answered: number;
        high_priority: number;
    };
}

export interface TicketShowPageProps {
    auth: {
        user: User;
    };
    ticket: {
        id: number;
        subject: string;
        message: string;
        status: string;
        priority: string;
        created_at: string;
        user: User;
        attachments: Attachment[];
        replies: Reply[];
        history: TicketHistory[];
    };
    statuses: string[];
}

export interface TicketFormData {
    message: string;
    status: string;
    attachments: File[];
    quote: string | null;
}

export interface SortState {
    column: string;
    direction: 'asc' | 'desc';
}

export type SortDirection = 'asc' | 'desc';

export interface TicketFilters {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sort?: string;
    direction?: SortDirection;
    page?: string;
} 

export { User };

export interface Reply {
    id: number;
    message: string;
    created_at: string;
    is_admin: boolean;
    user: User;
    attachments: Attachment[];
    quote?: string;
}

export interface MessageListProps {
    ticket: {
        id: number;
        subject: string;
        message: string;
        status: string;
        priority: string;
        created_at: string;
        user: User;
        attachments: Attachment[];
    };
    replies: Reply[];
    isReplying: boolean;
    handlePreviewImage: (url: string) => void;
    handleQuote: (message: string) => void;
    handleAttachmentClick: (url: string) => Promise<void>;
    setIsReplying: (value: boolean) => void;
    t: (key: string) => string;
}
