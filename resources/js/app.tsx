import 'react-toastify/dist/ReactToastify.css';
import '../css/app.css';
import './bootstrap';

import { PageProps } from '@/types';
import { getTheme, setTheme } from '@/Utils/themeManager';
import { ErrorBag, Errors } from '@inertiajs/core';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { ToastContainer } from 'react-toastify';
import { TranslationProvider } from './Contexts/TranslationContext';

// ScrollManager tipini import et
import type { ScrollManager } from '@/types/global';

const appName =
    window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

// Scroll yönetimi için util fonksiyonları
const scrollManager: ScrollManager = {
    position: 0,
    enable() {
        const scrollY = this.position;
        document.body.classList.remove('modal-open');
        window.scrollTo(0, scrollY);
    },
    disable() {
        this.position = window.scrollY;
        document.body.classList.add('modal-open');
    },
};

// PageProps tipini genişletelim
interface ExtendedPageProps extends PageProps {
    translations: Record<string, string>;
    locale: string;
}

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup: ({ el, App, props }) => {
        const root = createRoot(el);

        setTheme(getTheme());

        // Global scroll yönetimi
        window.scrollManager = scrollManager;

        // Tip güvenliği için kontrol
        const translations = props.initialPage.props.translations as Record<string, string>;
        const locale = props.initialPage.props.locale as string;

        if (!translations || !locale) {
            throw new Error('Translation props are required');
        }

        root.render(
            <TranslationProvider
                translations={translations}
                locale={locale}
            >
                <App {...props}>
                    {({ Component, props: pageProps, key }) => {
                        // Runtime tip kontrolü ve dönüşümü
                        const extendedProps = {
                            ...pageProps,
                            translations,
                            locale,
                        } as ExtendedPageProps & {
                            errors: Errors & ErrorBag;
                        };

                        return (
                            <>
                                <Component {...extendedProps} key={key} />
                                <ToastContainer />
                            </>
                        );
                    }}
                </App>
            </TranslationProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});
