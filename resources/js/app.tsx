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

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        setTheme(getTheme());

        // Global scroll yönetimi
        window.scrollManager = scrollManager;

        root.render(
            <App {...props}>
                {({
                    Component,
                    props,
                    key,
                }: {
                    Component: React.ComponentType;
                    props: PageProps<Record<string, unknown>> & {
                        errors: Errors & ErrorBag;
                    };
                    key: React.Key;
                }) => (
                    <TranslationProvider
                        translations={props.translations}
                        locale={props.locale}
                    >
                        <>
                            <Component {...props} key={key} />
                            <ToastContainer />
                        </>
                    </TranslationProvider>
                )}
            </App>,
        );
    },
    progress: {
        color: '#4B5563',
    },
});
