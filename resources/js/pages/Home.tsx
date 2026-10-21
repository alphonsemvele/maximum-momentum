import { Head } from '@inertiajs/react';
import { motion, useScroll, useSpring } from 'motion/react';
import Header from '@/components/Header';
import Hero from '@/sections/Hero';
import Marquee from '@/sections/Marquee';
import Stats from '@/sections/Stats';
import Mission from '@/sections/Mission';
import Programmes from '@/sections/Programmes';
import Campaigns from '@/sections/Campaigns';
import Quote from '@/sections/Quote';
import Gallery from '@/sections/Gallery';
import News from '@/sections/News';
import Contact from '@/sections/Contact';
import { org, type Campaign } from '@/lib/content';
import { useLanguage } from '@/lib/i18n';

export default function Home({ campaigns }: { campaigns: Campaign[] }) {
    const { lang, t } = useLanguage();
    const { scrollYProgress } = useScroll();
    const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

    const meta = {
        title: t({
            fr: `${org.name} — Guérir le corps, libérer l'esprit, protéger la vie`,
            en: `${org.name} — Heal the body, free the spirit, protect life`,
        }),
        description: t({
            fr: 'Association camerounaise basée à Yaoundé : santé communautaire et dépistage, éducation, dignité menstruelle, santé mentale, mobilisation des familles et formation des leaders.',
            en: 'Cameroonian non-profit based in Yaoundé: community health and screening, education, menstrual dignity, mental health, family mobilisation and leadership training.',
        }),
    };

    return (
        <>
            <Head title={meta.title}>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content="/images/hero/outreach-team.webp" />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content={lang === 'fr' ? 'fr_CM' : 'en_CM'} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>

            {/* reading-progress bar */}
            <motion.div
                style={{ scaleX: progress }}
                className="fixed inset-x-0 top-0 z-[80] h-0.5 origin-left bg-gradient-to-r from-gold-400 via-gold-300 to-gold-400"
            />

            <Header />

            <main>
                <Hero />
                <Marquee />
                <Stats />
                <Mission />
                <Programmes />
                <Campaigns campaigns={campaigns} />
                <Quote />
                <Gallery />
                <News />
                <Contact />
            </main>
        </>
    );
}
