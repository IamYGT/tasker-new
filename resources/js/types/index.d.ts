import { PageProps as InertiaPageProps } from '@inertiajs/core';
import { Config } from 'ziggy-js';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export interface CustomPageProps {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
    translations: Record<string, string>;
    locale: string;
}

export type PageProps<T = {}> = InertiaPageProps<CustomPageProps & T>;