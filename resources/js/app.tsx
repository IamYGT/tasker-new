import './bootstrap';
import '../css/app.css';

import { createRoot } from 'react-dom/client';
import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { getTheme, setTheme } from '@/Utils/themeManager';
import { TranslationProvider } from './Contexts/TranslationContext';
import { Page } from '@inertiajs/core';
import { ErrorBag, Errors } from '@inertiajs/core';
import { PageProps } from '@/types';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const appName = window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => resolvePageComponent(`./Pages/${name}.tsx`, import.meta.glob('./Pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        setTheme(getTheme());
        root.render(
            <App {...props}>
                {({ Component, props, key }: { 
                    Component: React.ComponentType; 
                    props: PageProps<any> & { errors: Errors & ErrorBag }; 
                    key: React.Key; 
                }) => (
                    <TranslationProvider translations={props.translations} locale={props.locale}>
                        <>
                            <Component {...props} key={key} />
                            <ToastContainer />
                        </>
                    </TranslationProvider>
                )}
            </App>
        );
    },
    progress: {
        color: '#4B5563',
    },
});