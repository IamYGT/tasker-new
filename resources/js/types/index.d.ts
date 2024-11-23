import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null;
    avatar?: string | null;
    google_id?: string | null;
    facebook_id?: string | null;
    github_id?: string | null;
    last_login_at?: string | null;
    social_login: boolean;
    created_at?: string;
    updated_at?: string;
    roles: Role[];
}

export interface Auth {
    user: User;
}

export interface CustomPageProps {
    auth: Auth;
    ziggy: Config & { location: string };
    translations: Record<string, string>;
    locale: string;
}

export type PageProps<T = {}> = InertiaPageProps<CustomPageProps & T>;

export interface Role {
    id: number;
    name: string;
}

export interface Transaction {
    id: number;
    reference_id: string;
    amount: number;
    type: TransactionType;
    status: TransactionStatus;
    description: string;
    bank_account: string;
    created_at: string;
    updated_at: string;
    notes?: string;
    user: User;
}

export type TransactionType = 'withdrawal' | 'deposit' | 'transfer';

export type TransactionStatus = 'pending' | 'completed' | 'cancelled';

export interface TransactionFilters {
    search?: string;
    status?: TransactionStatus;
    type?: TransactionType;
}

export interface PaginatedData<T> {
    data: T[];
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
}

export interface TransactionIndexPageProps extends PageProps {
    transactions: PaginatedData<Transaction>;
    filters: TransactionFilters;
    statuses: TransactionStatus[];
    types: TransactionType[];
}

export interface TransactionEditPageProps extends PageProps {
    transaction: Transaction;
    statuses: TransactionStatus[];
}