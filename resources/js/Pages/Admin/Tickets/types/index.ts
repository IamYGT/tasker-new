export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
}

export interface Message {
    id: number;
    user: User;
    message: string;
    created_at: string;
    attachments: Attachment[];
    quote?: string;
}

export interface TicketHistory {
    id: number;
    action: string;
    type: string;
    params?: Record<string, string | number>;
    user: {
        name: string;
    };
    created_at: string;
}

export interface Attachment {
    id: number;
    name: string;
    size: number;
    type: string;
    url: string;
}

export interface Ticket {
    id: number;
    subject: string;
    message: string;
    status: string;
    priority: string;
    category: string;
    last_reply_at: string;
    user: User;
    replies?: Message[];
    history?: TicketHistory[];
}

export interface TicketFilters {
    search?: string;
    status?: string;
    priority?: string;
    category?: string;
    sort?: string;
    direction?: 'asc' | 'desc';
}

export interface TicketStats {
    total: number;
    open: number;
    answered: number;
    high_priority: number;
}
