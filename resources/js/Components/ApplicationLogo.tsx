import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    mode?: 'dark' | 'light';
    size?: 'small' | 'medium' | 'large';
    collapsed?: boolean;
}

export default function ApplicationLogo({
    mode = 'light',
    size = 'medium',
    collapsed = false,
    className,
    ...props
}: ApplicationLogoProps) {
    if (collapsed) {
        return (
            <img
                src="/assets/mavi_kucuk.png"
                alt="Logo"
                className={className}
                {...props}
            />
        );
    }

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
