import { org } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

/**
 * Brand tagline ribbon between the hero and the body of the page.
 * The track is duplicated so the CSS translate loop is seamless.
 */
export default function Marquee() {
    const { t } = useLanguage();
    const words = t(org.tagline).split(', ');
    const track = [...words, ...words, ...words, ...words];

    return (
        <div className="relative overflow-hidden border-y border-forest-800/40 bg-forest-900 py-4">
            <div className="mask-fade-x flex">
                <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
                    {[...track, ...track].map((word, index) => (
                        <span key={index} className="flex shrink-0 items-center gap-10">
                            <span className="font-display text-sm font-medium uppercase tracking-[0.3em] text-cream-100/80 sm:text-base">
                                {word}
                            </span>
                            <span className="h-1.5 w-1.5 shrink-0 rotate-45 bg-gold-400" aria-hidden="true" />
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
}
