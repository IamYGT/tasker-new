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