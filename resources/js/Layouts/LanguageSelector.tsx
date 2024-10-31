import React, { useState, useCallback, useRef, memo } from 'react';
import { MdExpandMore, MdCheck } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import useOnClickOutside from './useOnClickOutside';

interface Language {
    dil_id: number;
    dil_baslik: string;
    dil_kod: string;
}

interface LanguageSelectorProps {
    darkMode: boolean;
    languages: Language[];
    secili_dil: Language;
    isMobile: boolean;
    embedded?: boolean;
    onLanguageChange: (langCode: string) => void; // Zorunlu hale getirildi
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    darkMode,
    languages,
    secili_dil,
    isMobile,
    embedded = false,
    onLanguageChange, // Prop eklendi
}) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useOnClickOutside(ref, () => setDropdownOpen(false));

    const getFlagUrl = useCallback((langCode: string) => {
        const langToCountryCode: { [key: string]: string } = { en: 'gb', tr: 'tr' };
        const countryCode = langToCountryCode[langCode.toLowerCase()] || langCode.toLowerCase();
        return `https://flagcdn.com/w160/${countryCode}.png`;
    }, []);

    const handleLanguageChange = useCallback((langCode: string) => {
        onLanguageChange(langCode); // Üst bileşene çağrı yapılıyor
    }, [onLanguageChange]);

    const dropdownItemClasses = useCallback((isSelected = false) => `
        flex items-center justify-between w-full text-left px-3 py-2 text-sm transition-all duration-200 ease-in-out
        ${darkMode
            ? `${isSelected ? 'bg-gray-700' : ''} hover:bg-gray-700 text-gray-200`
            : `${isSelected ? 'bg-gray-200' : ''} hover:bg-gray-200 text-gray-900`
        }
        rounded-lg
    `, [darkMode]);

    const FlagImage = memo(({ langCode, alt, className }: { langCode: string, alt: string, className: string }) => {
        return (
            <div className={`relative overflow-hidden ${className}`}>
                <img
                    src={getFlagUrl(langCode)}
                    alt={alt}
                    className="absolute inset-0 w-full h-full object-contain"
                    style={{ 
                        imageRendering: 'crisp-edges',
                        transform: 'scale(0.80)',
                    }}
                />
            </div>
        );
    });

    if (embedded) {
        return (
            <div className="space-y-1 p-1">
                {languages.map((lang) => (
                    <button
                        key={lang.dil_id}
                        onClick={() => handleLanguageChange(lang.dil_kod)}
                        className={`
                            flex items-center justify-between w-full text-left px-3 py-2 text-sm
                            ${darkMode
                                ? 'hover:bg-gray-700 text-gray-200'
                                : 'hover:bg-gray-200 text-gray-900'
                            }
                            rounded-lg
                        `}
                    >
                        <div className="flex items-center">
                            <FlagImage
                                langCode={lang.dil_kod}
                                alt={`${lang.dil_baslik} bayrağı`}
                                className="w-7 h-7 mr-2 rounded-full shadow-sm flex-shrink-0"
                            />
                            <span className={`font-medium ${lang.dil_kod === secili_dil.dil_kod ? (darkMode ? 'text-white' : 'text-gray-900') : ''}`}>
                                {lang.dil_baslik}
                            </span>
                        </div>
                        {lang.dil_kod === secili_dil.dil_kod && (
                            <MdCheck className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                        )}
                    </button>
                ))}
            </div>
        );
    }

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className={`
                    flex items-center justify-center px-3 py-2 rounded-full
                    focus:outline-none focus:ring-2 focus:ring-opacity-50
                    shadow-md hover:shadow-lg backdrop-filter backdrop-blur-sm
                    ${darkMode
                        ? 'bg-gray-800 text-gray-200 hover:bg-gray-700 focus:ring-gray-600'
                        : 'bg-white text-gray-900 hover:bg-gray-100 focus:ring-gray-300'
                    }
                `}
                aria-label="Dil seç"
            >
                <FlagImage
                    langCode={secili_dil.dil_kod}
                    alt={`${secili_dil.dil_baslik} bayrağı`}
                    className="w-7 h-7 rounded-full shadow-sm flex-shrink-0 overflow-hidden"
                />
                {!isMobile && <span className="hidden sm:inline font-medium text-sm ml-2 mr-1">{secili_dil.dil_baslik}</span>}
                <MdExpandMore className={`w-5 h-5 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
            </button>

            <AnimatePresence>
                {dropdownOpen && !embedded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`
                            absolute right-0 mt-2 w-52 rounded-lg shadow-lg backdrop-blur-sm p-1.5 z-30
                            ${darkMode
                                ? 'bg-gray-800 border border-gray-700 text-gray-200'
                                : 'bg-white border border-gray-200 text-gray-900'
                            }
                        `}
                    >
                        <div className="space-y-0.5">
                            {languages.map((lang) => (
                                <button
                                    key={lang.dil_id}
                                    onClick={() => handleLanguageChange(lang.dil_kod)}
                                    className={dropdownItemClasses(lang.dil_kod === secili_dil.dil_kod)}
                                >
                                    <div className="flex items-center">
                                        <FlagImage
                                            langCode={lang.dil_kod}
                                            alt={`${lang.dil_baslik} bayrağı`}
                                            className="w-6 h-6 mr-2 rounded-full shadow-sm flex-shrink-0 overflow-hidden"
                                        />
                                        <span className="font-medium text-sm">{lang.dil_baslik}</span>
                                    </div>
                                    {lang.dil_kod === secili_dil.dil_kod && (
                                        <MdCheck className={`w-4 h-4 ${darkMode ? 'text-green-500' : 'text-green-600'}`} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default memo(LanguageSelector);