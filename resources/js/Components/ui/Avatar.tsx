import React from 'react';

interface AvatarProps {
    src?: string;
    alt?: string;
    fallback?: string;
    children?: React.ReactNode;
    className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, alt, fallback, children, className = '' }) => {
    return (
        <div className={`relative w-10 h-10 rounded-full overflow-hidden ${className}`}>
            {src ? (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
                    {children || fallback || alt?.charAt(0) || '?'}
                </div>
            )}
        </div>
    );
};

export const AvatarFallback: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, ...props }) => {
    return (
        <div {...props} className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-600">
            {children}
        </div>
    );
};