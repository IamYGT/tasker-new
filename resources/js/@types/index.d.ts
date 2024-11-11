export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    avatar?: string | null;
    google_id?: string | null;
    facebook_id?: string | null;
    github_id?: string | null;
    last_login_at?: string | null;
}

export interface Auth {
    user: User;
}

export interface PageProps {
    auth: Auth;
    showWelcomeToast?: boolean;
    languages?: Record<string, string>;
    secili_dil?: string;
}

export interface LayoutProps {
    auth: Auth;
    header: ReactNode;
    children: ReactNode;
} 