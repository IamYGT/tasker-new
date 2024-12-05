import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { ReactNode } from 'react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    children: ReactNode;
    confirmText?: string;
    cancelText?: string;
    processing?: boolean;
}

export default function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    children,
    confirmText = 'Sil',
    cancelText = 'İptal',
    processing = false,
}: Props) {
    return (
        <Modal show={isOpen} onClose={onClose}>
            <div className="p-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                    {title}
                </h2>

                <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                    {children}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                    <SecondaryButton onClick={onClose} disabled={processing}>
                        {cancelText}
                    </SecondaryButton>

                    <DangerButton onClick={onConfirm} disabled={processing}>
                        {confirmText}
                    </DangerButton>
                </div>
            </div>
        </Modal>
    );
}
