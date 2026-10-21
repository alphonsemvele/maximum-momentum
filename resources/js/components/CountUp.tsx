import { animate, useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

type CountUpProps = {
    to: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    className?: string;
    /** Locale used to group thousands — matches the active site language. */
    locale?: string;
};

/**
 * Counts from 0 to `to` the first time it scrolls into view.
 * Renders the final value immediately under reduced-motion.
 */
export default function CountUp({ to, duration = 1.8, prefix = '', suffix = '', className, locale = 'fr-FR' }: CountUpProps) {
    const ref = useRef<HTMLSpanElement>(null);
    const inView = useInView(ref, { once: true, amount: 0.6 });
    const reduceMotion = useReducedMotion();
    const [value, setValue] = useState(reduceMotion ? to : 0);

    useEffect(() => {
        if (!inView) return;

        if (reduceMotion) {
            setValue(to);
            return;
        }

        const controls = animate(0, to, {
            duration,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (latest) => setValue(Math.round(latest)),
        });

        return () => controls.stop();
    }, [inView, to, duration, reduceMotion]);

    return (
        <span ref={ref} className={className}>
            {prefix}
            {value.toLocaleString(locale).replace(/ | /g, ' ')}
            {suffix}
        </span>
    );
}
