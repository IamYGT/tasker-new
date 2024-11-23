import React from 'react';
import { Link } from '@inertiajs/react';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Props {
    links: PaginationLink[];
}

export default function Pagination({ links }: Props) {
    return (
        <div className="flex flex-wrap justify-center gap-1">
            {links.map((link, key) => {
                if (!link.url && link.label === '...') {
                    return (
                        <span
                            key={key}
                            className="px-4 py-2 text-gray-500 dark:text-gray-400"
                        >
                            ...
                        </span>
                    );
                }

                return link.url ? (
                    <Link
                        key={key}
                        href={link.url}
                        className={`px-4 py-2 text-sm rounded-md ${
                            link.active
                                ? 'bg-primary-500 text-white'
                                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'
                        }`}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ) : (
                    <span
                        key={key}
                        className="px-4 py-2 text-sm text-gray-400 dark:text-gray-500"
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                );
            })}
        </div>
    );
} 