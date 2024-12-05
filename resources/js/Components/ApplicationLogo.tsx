import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    mode?: 'dark' | 'light';
    size?: 'small' | 'medium' | 'large';
}

export default function ApplicationLogo({
    mode = 'light',
    size = 'medium',
    className,
    ...props
}: ApplicationLogoProps) {
    const logoSrc = mode === 'dark' ? '/assets/beyaz.png' : '/assets/siyah.png';

    const sizeClasses = {
        small: 'h-8 w-auto sm:h-10',
        medium: 'h-12 w-auto sm:h-14',
        large: 'h-16 w-auto sm:h-20',
    };

    const combinedClassName = `${sizeClasses[size]} ${className || ''}`.trim();

    return (
        <img
            src={logoSrc}
            alt="Logo"
            className={combinedClassName}
            {...props}
        />
    );
}
