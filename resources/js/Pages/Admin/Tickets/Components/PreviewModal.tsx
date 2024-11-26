import React, { useEffect, useState } from 'react';
import { FaTimes, FaDownload, FaExpand, FaCompress } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PreviewModalProps {
    isOpen: boolean;
    imageUrl: string | null;
    onClose: () => void;
}

export default function PreviewModal({ isOpen, imageUrl, onClose }: PreviewModalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (isFullscreen) {
                    document.exitFullscreen();
                } else {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.body.style.overflow = 'hidden';
            window.addEventListener('keydown', handleEsc);
        }

        return () => {
            document.body.style.overflow = 'unset';
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, isFullscreen]);

    const toggleFullscreen = () => {
        if (!isFullscreen) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
        setIsFullscreen(!isFullscreen);
    };

    const isPDF = imageUrl?.toLowerCase().endsWith('.pdf');

    if (!isOpen || !imageUrl) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-black">
            {/* Kontrol Butonları */}
            <div className="fixed top-4 right-4 z-[101] flex items-center gap-2">
                <a
                    href={imageUrl}
                    download
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full 
                        backdrop-blur-sm transition-colors"
                    onClick={e => e.stopPropagation()}
                >
                    <FaDownload className="w-5 h-5 text-white" />
                </a>
                <button
                    onClick={toggleFullscreen}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full 
                        backdrop-blur-sm transition-colors"
                >
                    {isFullscreen ? (
                        <FaCompress className="w-5 h-5 text-white" />
                    ) : (
                        <FaExpand className="w-5 h-5 text-white" />
                    )}
                </button>
                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full 
                        backdrop-blur-sm transition-colors"
                >
                    <FaTimes className="w-5 h-5 text-white" />
                </button>
            </div>

            {/* Loading Spinner */}
            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
                </div>
            )}

            {/* Görsel veya PDF */}
            <div className="w-full h-full flex items-center justify-center">
                {isPDF ? (
                    <iframe
                        src={`${imageUrl}#view=FitH`}
                        className="w-full h-full"
                        style={{ 
                            opacity: isLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                        onLoad={() => setIsLoading(false)}
                    />
                ) : (
                    <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain select-none"
                        onLoad={() => setIsLoading(false)}
                        style={{ 
                            opacity: isLoading ? 0 : 1,
                            transition: 'opacity 0.3s ease-in-out'
                        }}
                        onClick={e => e.stopPropagation()}
                    />
                )}
            </div>
        </div>
    );
} 