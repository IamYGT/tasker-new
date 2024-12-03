import React, { createContext, ReactNode, useContext, useMemo } from 'react';

interface TranslationContextType {
    t: (key: string, params?: Record<string, string | number>) => string;
    locale: string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(
    undefined,
);

interface TranslationProviderProps {
    children: ReactNode;
    translations: Record<string, string>;
    locale: string;
}

export const TranslationProvider: React.FC<TranslationProviderProps> = ({
    children,
    translations,
    locale,
}) => {
    const t = useMemo(
        () =>
            (key: string, params?: Record<string, string | number>): string => {
                let translation = translations[key] || key;
                if (params) {
                    Object.entries(params).forEach(([paramKey, paramValue]) => {
                        translation = translation.replace(
                            `{${paramKey}}`,
                            String(paramValue),
                        );
                    });
                }
                return translation;
            },
        [translations],
    );

    const value = useMemo(() => ({ t, locale }), [t, locale]);

    return (
        <TranslationContext.Provider value={value}>
            {children}
        </TranslationContext.Provider>
    );
};

export const useTranslation = (): TranslationContextType => {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error(
            'useTranslation must be used within a TranslationProvider',
        );
    }
    return context;
};
