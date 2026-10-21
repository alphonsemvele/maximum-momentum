import { motion } from 'motion/react';
import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { ui } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function MomoCard({
    provider,
    number,
    className,
    dot,
}: {
    provider: string;
    number: string;
    className: string;
    dot: string;
}) {
    const { t } = useLanguage();
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(number);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard is unavailable (insecure context) — the number stays selectable.
        }
    };

    return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br to-transparent p-5 ring-1 ${className}`}>
            <div className="flex items-center gap-2.5">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                <p className="text-[0.7rem] font-bold uppercase tracking-[0.14em] text-cream-100/80">{provider}</p>
            </div>

            <p className="mt-4 font-display text-xl font-semibold tracking-wide text-white">{number}</p>

            <button
                type="button"
                onClick={copy}
                className="mt-4 inline-flex items-center gap-1.5 text-[0.75rem] font-medium text-cream-100/60 transition-colors hover:text-gold-300"
            >
                <motion.span key={String(copied)} initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    {copied ? <Check className="h-3.5 w-3.5 text-gold-300" /> : <Copy className="h-3.5 w-3.5" />}
                </motion.span>
                {copied ? t(ui.copied) : t(ui.copy)}
            </button>
        </div>
    );
}
