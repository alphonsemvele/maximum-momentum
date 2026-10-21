import { usePage } from '@inertiajs/react';

/**
 * Section anchors only resolve on the home page; elsewhere (a campaign page)
 * they must route back to `/` first.
 */
export function useSectionHref() {
    const path = usePage().url.split(/[?#]/)[0];
    const prefix = path === '/' ? '' : '/';

    return (id: string) => `${prefix}#${id}`;
}
