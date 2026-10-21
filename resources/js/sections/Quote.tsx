import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import Reveal from '@/components/Reveal';
import { quote } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function Quote() {
    const { t } = useLanguage();
    const ref = useRef<HTMLElement>(null);

    const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
    const imageY = useTransform(scrollYProgress, [0, 1], ['-12%', '12%']);

    return (
        <section ref={ref} className="relative flex min-h-[80svh] items-center overflow-hidden bg-forest-950">
            <motion.div style={{ y: imageY }} className="absolute inset-x-0 -top-[12%] h-[124%]">
                <img
                    src="/images/hero/outreach-team-wide.webp"
                    alt={t({
                        fr: "L'équipe de bénévoles devant une assemblée communautaire",
                        en: 'The volunteer team in front of a community gathering',
                    })}
                    loading="lazy"
                    className="h-full w-full object-cover"
                />
            </motion.div>

            <div className="absolute inset-0 bg-forest-950/78" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgb(6_27_21_/_0.7)_85%)]" />

            <div className="relative mx-auto w-full max-w-4xl px-5 py-28 text-center sm:px-8">
                <Reveal from="none">
                    <span
                        aria-hidden="true"
                        className="block font-display text-[5rem] leading-none text-gold-400/35 sm:text-[7rem]"
                    >
                        &ldquo;
                    </span>
                </Reveal>

                <Reveal delay={0.1}>
                    <blockquote className="-mt-6 font-display text-[clamp(1.65rem,4.2vw,3.1rem)] font-medium italic leading-[1.22] tracking-[-0.015em] text-white text-balance sm:-mt-10">
                        {t(quote.text)}
                    </blockquote>
                </Reveal>

                <Reveal delay={0.2}>
                    <div className="mt-10 flex flex-col items-center gap-4">
                        <span className="h-px w-16 rule-gold" />
                        <cite className="not-italic text-xs font-semibold uppercase tracking-[0.24em] text-gold-300/90">
                            {t(quote.attribution)}
                        </cite>
                    </div>
                </Reveal>
            </div>
        </section>
    );
}
