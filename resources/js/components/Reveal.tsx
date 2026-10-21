import { motion, useReducedMotion, type Variants } from 'motion/react';
import type { ElementType, ReactNode } from 'react';

type Direction = 'up' | 'down' | 'left' | 'right' | 'none';

const offsets: Record<Direction, { x: number; y: number }> = {
    up: { x: 0, y: 34 },
    down: { x: 0, y: -34 },
    left: { x: 34, y: 0 },
    right: { x: -34, y: 0 },
    none: { x: 0, y: 0 },
};

type RevealProps = {
    children: ReactNode;
    className?: string;
    /** Direction the element travels *from*. */
    from?: Direction;
    delay?: number;
    duration?: number;
    as?: ElementType;
    /** Fraction of the element that must be visible before it animates. */
    amount?: number;
};

/**
 * Scroll-triggered entrance. Animates once, and collapses to a plain fade-free
 * render when the visitor has asked for reduced motion.
 */
export default function Reveal({
    children,
    className,
    from = 'up',
    delay = 0,
    duration = 0.75,
    as = 'div',
    amount = 0.25,
}: RevealProps) {
    const reduceMotion = useReducedMotion();
    const offset = reduceMotion ? offsets.none : offsets[from];

    const variants: Variants = {
        hidden: { opacity: 0, ...offset },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: reduceMotion ? 0.01 : duration,
                delay: reduceMotion ? 0 : delay,
                ease: [0.16, 1, 0.3, 1],
            },
        },
    };

    const Component = motion.create(as as ElementType);

    return (
        <Component
            className={className}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
        >
            {children}
        </Component>
    );
}

/**
 * Wraps a list so children stagger in. Pair with <RevealItem>.
 */
export function RevealGroup({
    children,
    className,
    stagger = 0.09,
    delay = 0,
    amount = 0.15,
}: {
    children: ReactNode;
    className?: string;
    stagger?: number;
    delay?: number;
    amount?: number;
}) {
    const reduceMotion = useReducedMotion();

    return (
        <motion.div
            className={className}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount }}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: reduceMotion ? 0 : stagger,
                        delayChildren: reduceMotion ? 0 : delay,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    );
}

export function RevealItem({
    children,
    className,
    from = 'up',
}: {
    children: ReactNode;
    className?: string;
    from?: Direction;
}) {
    const reduceMotion = useReducedMotion();
    const offset = reduceMotion ? offsets.none : offsets[from];

    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, ...offset },
                visible: {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    transition: { duration: reduceMotion ? 0.01 : 0.7, ease: [0.16, 1, 0.3, 1] },
                },
            }}
        >
            {children}
        </motion.div>
    );
}
