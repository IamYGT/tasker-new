import { ImgHTMLAttributes } from 'react';

interface ApplicationLogoProps extends ImgHTMLAttributes<HTMLImageElement> {
    mode?: 'dark' | 'light';
}

export default function ApplicationLogo({ mode = 'light', className, ...props }: ApplicationLogoProps) {
    const logoSrc = mode === 'dark' 
        ? '/assets/beyaz.png'
        : '/assets/siyah.png';

    return (
        <img
            src={logoSrc}
            alt="Logo"
            className={className}
            {...props}
        />
    );
}