import React from 'react';

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    maxHeight?: string;
}

export const ScrollArea: React.FC<ScrollAreaProps> = ({ children, maxHeight = '300px', ...props }) => {
    return (
        <div 
            {...props} 
            style={{ maxHeight, overflowY: 'auto', ...props.style }}
            className={`scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 ${props.className || ''}`}
        >
            {children}
        </div>
    );
};