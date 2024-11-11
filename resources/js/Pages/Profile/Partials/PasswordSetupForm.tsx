import { FormEventHandler } from 'react';
import { useTranslation } from '@/Contexts/TranslationContext';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

interface PasswordSetupFormProps {
    passwordData: {
        password: string;
        password_confirmation: string;
    };
    onSubmit: FormEventHandler;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function PasswordSetupForm({
    passwordData,
    onSubmit,
    onChange
}: PasswordSetupFormProps) {
    const { t } = useTranslation();

    return (
        <form onSubmit={onSubmit} className="mt-6">
            <div>
                <InputLabel htmlFor="password" value={t('password')} />
                <TextInput
                    id="password"
                    type="password"
                    className="mt-1 block w-full"
                    value={passwordData.password}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="mt-4">
                <InputLabel
                    htmlFor="password_confirmation"
                    value={t('confirm_password')}
                />
                <TextInput
                    id="password_confirmation"
                    type="password"
                    className="mt-1 block w-full"
                    value={passwordData.password_confirmation}
                    onChange={onChange}
                    required
                />
            </div>

            <div className="mt-4">
                <PrimaryButton type="submit">
                    {t('set_password')}
                </PrimaryButton>
            </div>
        </form>
    );
} 