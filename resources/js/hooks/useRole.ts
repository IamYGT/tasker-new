import { PageProps } from '@/types';
import { usePage } from '@inertiajs/react';

export function useRole() {
    const { auth } = usePage<PageProps>().props;

    const hasRole = (role: string): boolean => {
        return (
            auth.user?.roles.some((r: { name: string }) => r.name === role) ??
            false
        );
    };

    const isAdmin = (): boolean => {
        return hasRole('admin');
    };

    const isUser = (): boolean => {
        return hasRole('user');
    };

    return {
        hasRole,
        isAdmin,
        isUser,
    };
}
