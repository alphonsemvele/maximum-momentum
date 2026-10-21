import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { LanguageProvider } from '@/lib/i18n';

const appName = import.meta.env.VITE_APP_NAME || 'Maximum Momentum in Action';

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.tsx', { eager: true });
        return pages[`./pages/${name}.tsx`] as never;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <LanguageProvider>
                <App {...props} />
            </LanguageProvider>,
        );
    },
    progress: {
        color: '#f5b920',
        showSpinner: false,
    },
});
