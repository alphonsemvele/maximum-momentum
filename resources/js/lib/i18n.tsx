import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Lang = 'fr' | 'en';

/** A piece of copy that exists in both languages. */
export type Bi<T = string> = Record<Lang, T>;

const STORAGE_KEY = 'mmia.lang';

type LanguageContextValue = {
    lang: Lang;
    setLang: (lang: Lang) => void;
    toggle: () => void;
    /** Resolve a bilingual value to the active language. */
    t: <T>(value: Bi<T>) => T;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function detectInitialLang(): Lang {
    if (typeof window === 'undefined') return 'fr';

    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;

    // Cameroon is bilingual — respect the browser, default to French.
    return window.navigator.language?.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Lang>(detectInitialLang);

    useEffect(() => {
        window.localStorage.setItem(STORAGE_KEY, lang);
        document.documentElement.lang = lang;
    }, [lang]);

    const setLang = useCallback((next: Lang) => setLangState(next), []);
    const toggle = useCallback(() => setLangState((current) => (current === 'fr' ? 'en' : 'fr')), []);

    const value = useMemo<LanguageContextValue>(
        () => ({
            lang,
            setLang,
            toggle,
            t: <T,>(entry: Bi<T>) => entry[lang],
        }),
        [lang, setLang, toggle],
    );

    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
    const context = useContext(LanguageContext);

    if (!context) {
        throw new Error('useLanguage must be used inside a <LanguageProvider>.');
    }

    return context;
}

/** Shorthand for components that only need the resolver. */
export function useT() {
    return useLanguage().t;
}
