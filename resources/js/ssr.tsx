import { createInertiaApp } from '@inertiajs/react';
import createServer from '@inertiajs/react/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';
import { route as ziggyRoute } from '../../vendor/tightenco/ziggy';
import { PageProps } from '@/types';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer((page) =>
    createInertiaApp({
        page: page as PageProps<unknown>,
        render: ReactDOMServer.renderToString,
        title: (title) => `${title} - ${appName}`,
        resolve: (name) =>
            resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob('./Pages/**/*.tsx'),
            ),
        setup: ({ App, props }) => {
            // @ts-ignore
            global.route = (name: string, params?: any, absolute?: boolean) => {
                // @ts-ignore
                return ziggyRoute(name, params, absolute, props.ziggy);
            };

            return <App {...props} />;
        },
    }),
);
