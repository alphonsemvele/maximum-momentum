import type { Bi } from '@/lib/i18n';

/**
 * All site copy lives here in FR/EN pairs so the whole landing page can be
 * translated from a single file. Facts and figures come from the organisation's
 * own campaign material (the Pads & Pages poster and the field roll-up banner).
 * Campaigns themselves are managed from the admin and arrive as page props.
 */

export const org = {
    name: 'Maximum Momentum in Action',
    shortName: 'Maximum Momentum',
    tagline: {
        fr: "Guérir le corps, libérer l'esprit, protéger la vie",
        en: 'Heal the body, free the spirit, protect life',
    } satisfies Bi,
    location: {
        fr: 'Yaoundé, Cameroun',
        en: 'Yaoundé, Cameroon',
    } satisfies Bi,
    phone: '+237653131236',
    phoneDisplay: '+237 6 53 13 12 36',
    email: 'info@maximummomentumintl.org',
    social: '@MaximumMomentumInAction',
    socialUrl: 'https://www.facebook.com/MaximumMomentumInAction',
    whatsapp: (message: string) => `https://wa.me/237653131236?text=${encodeURIComponent(message)}`,
    momo: {
        mtn: '653131236',
        orange: '695473410',
    },
};

export const whatsappIntro = {
    fr: 'Bonjour Maximum Momentum in Action, je souhaite soutenir vos actions.',
    en: 'Hello Maximum Momentum in Action, I would like to support your work.',
} satisfies Bi;

/* ----------------------------- navigation ----------------------------- */

export const navLinks: { id: string; label: Bi }[] = [
    { id: 'mission', label: { fr: 'Qui sommes-nous', en: 'About us' } },
    { id: 'domaines', label: { fr: 'Nos actions', en: 'Our work' } },
    { id: 'campagnes', label: { fr: 'Campagnes', en: 'Campaigns' } },
    { id: 'galerie', label: { fr: 'Galerie', en: 'Gallery' } },
    { id: 'actualites', label: { fr: 'Actualités', en: 'News' } },
    { id: 'contact', label: { fr: 'Contact', en: 'Contact' } },
];

export const ui = {
    sponsorCta: { fr: 'Faire un don', en: 'Donate' },
    discoverCta: { fr: 'Découvrir nos actions', en: 'Explore our work' },
    campaignsCta: { fr: 'Soutenir une campagne', en: 'Support a campaign' },
    admin: { fr: 'Admin', en: 'Admin' },
    menu: { fr: 'Menu', en: 'Menu' },
    close: { fr: 'Fermer', en: 'Close' },
    copied: { fr: 'Copié', en: 'Copied' },
    copy: { fr: 'Copier', en: 'Copy' },
    scroll: { fr: 'Défiler', en: 'Scroll' },
    previous: { fr: 'Précédent', en: 'Previous' },
    next: { fr: 'Suivant', en: 'Next' },
    all: { fr: 'Tout', en: 'All' },
} satisfies Record<string, Bi>;

/* -------------------------------- hero -------------------------------- */

export type HeroSlide = {
    image: string;
    alt: Bi;
    caption: Bi;
};

export const heroSlides: HeroSlide[] = [
    {
        image: '/images/hero/outreach-team.webp',
        alt: {
            fr: "L'équipe de Maximum Momentum devant une assemblée communautaire",
            en: 'The Maximum Momentum team in front of a community gathering',
        },
        caption: {
            fr: 'Campagne de santé communautaire — plus de 300 participants',
            en: 'Community health outreach — over 300 participants',
        },
    },
    {
        image: '/images/hero/dignity-kits-joy.webp',
        alt: {
            fr: "Des élèves brandissent leurs kits de dignité lors d'une distribution en salle de classe",
            en: 'Students hold up their dignity kits during a classroom distribution',
        },
        caption: {
            fr: 'Distribution des kits de dignité — établissement scolaire, Yaoundé',
            en: 'Dignity kit distribution — secondary school, Yaoundé',
        },
    },
    {
        image: '/images/hero/classroom-teaching.webp',
        alt: {
            fr: 'Une animatrice de Maximum Momentum anime un atelier devant une classe',
            en: 'A Maximum Momentum facilitator leads a workshop in front of a class',
        },
        caption: {
            fr: 'Atelier de santé menstruelle et mentale en salle de classe',
            en: 'Menstrual and mental health workshop in the classroom',
        },
    },
    {
        image: '/images/hero/girls-with-kits.webp',
        alt: {
            fr: 'Des adolescentes reçoivent leurs kits scolaires et de dignité',
            en: 'Adolescent girls receive their academic and dignity kits',
        },
        caption: {
            fr: "Chaque kit, c'est une année scolaire qui continue",
            en: 'Every kit means a school year that keeps going',
        },
    },
    {
        image: '/images/hero/workshop-classroom.webp',
        alt: {
            fr: 'Séance de sensibilisation avec des élèves assis à leurs pupitres',
            en: 'Awareness session with pupils seated at their desks',
        },
        caption: {
            fr: 'Sensibilisation en milieu scolaire',
            en: 'School-based awareness sessions',
        },
    },
];

export const hero = {
    eyebrow: {
        fr: 'Association à but non lucratif · Yaoundé, Cameroun',
        en: 'Non-profit association · Yaoundé, Cameroon',
    } satisfies Bi,
    titleLead: { fr: 'Guérir le corps,', en: 'Heal the body,' } satisfies Bi,
    titleAccent: { fr: "libérer l'esprit,", en: 'free the spirit,' } satisfies Bi,
    titleTail: { fr: 'protéger la vie.', en: 'protect life.' } satisfies Bi,
    subtitle: {
        fr: "Santé communautaire, éducation, dignité menstruelle, santé mentale, mobilisation des familles et formation des leaders : nous agissons dans les quartiers, les écoles et les paroisses, partout où la vie a besoin d'élan.",
        en: 'Community health, education, menstrual dignity, mental health, family mobilisation and leadership training: we work in neighbourhoods, schools and parishes, wherever life needs momentum.',
    } satisfies Bi,
};

/* ------------------------------ key figures ---------------------------- */

export type Stat = {
    value: number;
    suffix?: string;
    prefix?: string;
    label: Bi;
    detail: Bi;
};

export const stats: Stat[] = [
    {
        value: 6,
        label: { fr: "domaines d'action", en: 'fields of action' },
        detail: {
            fr: 'Santé, éducation, dignité, santé mentale, mobilisation communautaire et formation des leaders.',
            en: 'Health, education, dignity, mental health, community mobilisation and leadership training.',
        },
    },
    {
        value: 300,
        suffix: '+',
        label: { fr: 'participants en une journée', en: 'people in a single day' },
        detail: {
            fr: 'Lors d’une seule journée de santé communautaire organisée avec nos partenaires.',
            en: 'At a single community health day run with our partners.',
        },
    },
    {
        value: 3,
        label: { fr: 'piliers', en: 'pillars' },
        detail: {
            fr: "Guérir le corps, libérer l'esprit, protéger la vie : chaque campagne sert au moins l'un d'eux.",
            en: 'Heal the body, free the spirit, protect life: every campaign serves at least one of them.',
        },
    },
    {
        value: 100,
        suffix: '%',
        label: { fr: 'porté par des bénévoles', en: 'volunteer-powered' },
        detail: {
            fr: 'Enseignants, soignants et leaders communautaires donnent leur temps sur le terrain.',
            en: 'Teachers, health workers and community leaders give their time in the field.',
        },
    },
];

/* ------------------------------- mission ------------------------------- */

export const mission = {
    eyebrow: { fr: 'Qui nous sommes', en: 'Who we are' } satisfies Bi,
    title: {
        fr: "Une association camerounaise qui agit là où le besoin se fait sentir.",
        en: 'A Cameroonian association that shows up where the need is.',
    } satisfies Bi,
    body: [
        {
            fr: "Maximum Momentum in Action est une association à but non lucratif basée à Yaoundé. Nous travaillons dans les quartiers, les écoles et les paroisses pour lever les obstacles concrets qui empêchent les familles de se soigner, les jeunes d'apprendre et les communautés de s'organiser.",
            en: 'Maximum Momentum in Action is a non-profit association based in Yaoundé. We work in neighbourhoods, schools and parishes to remove the practical barriers that keep families from getting care, young people from learning and communities from organising.',
        },
        {
            fr: 'Santé et dépistage, éducation, dignité menstruelle, santé mentale, mobilisation des familles, formation des leaders : nos campagnes changent de visage selon les besoins, mais gardent la même exigence.',
            en: 'Health and screening, education, menstrual dignity, mental health, family mobilisation, leadership training: our campaigns change shape with the need, but keep the same standard.',
        },
        {
            fr: "Notre approche est simple : arriver avec ce qui manque, expliquer sans juger, et repartir en laissant une communauté mieux outillée qu'à notre arrivée.",
            en: 'Our approach is simple: arrive with what is missing, explain without judgement, and leave a community better equipped than we found it.',
        },
    ] satisfies Bi[],
};

export const pillars: { title: Bi; body: Bi; icon: 'heart' | 'brain' | 'shield' }[] = [
    {
        icon: 'heart',
        title: { fr: 'Guérir le corps', en: 'Heal the body' },
        body: {
            fr: 'Dépistages gratuits, consultations et protections hygiéniques, apportés directement dans les communautés.',
            en: 'Free screenings, consultations and sanitary protection, brought directly into communities.',
        },
    },
    {
        icon: 'brain',
        title: { fr: "Libérer l'esprit", en: 'Free the spirit' },
        body: {
            fr: 'Éducation, écoute et santé mentale : remplacer la honte et le silence par des connaissances et de la confiance.',
            en: 'Education, listening and mental health: replacing shame and silence with knowledge and confidence.',
        },
    },
    {
        icon: 'shield',
        title: { fr: 'Protéger la vie', en: 'Protect life' },
        body: {
            fr: 'Mobiliser les familles, former les leaders locaux et bâtir des relais durables dans chaque communauté.',
            en: 'Mobilising families, training local leaders and building lasting networks in every community.',
        },
    },
];

/* ------------------------------ programmes ----------------------------- */

export const programmes = {
    eyebrow: { fr: 'Nos actions', en: 'Our work' } satisfies Bi,
    title: {
        fr: 'Six domaines, une même exigence',
        en: 'Six fields, one standard',
    } satisfies Bi,
    intro: {
        fr: "Nos campagnes couvrent la santé du corps comme celle de l'esprit, l'école comme la famille. Chacune s'inscrit dans un travail de fond mené toute l'année.",
        en: 'Our campaigns cover the health of the body and of the mind, school and family alike. Each one sits inside year-round work on the ground.',
    } satisfies Bi,
};

/**
 * Fields of action. Keys match `Campaign::DOMAINS` on the server so the
 * admin and the public cards share one vocabulary.
 */
export type Domain = 'sante' | 'education' | 'dignite' | 'mental' | 'communaute' | 'leadership' | 'autre';

export const domainLabels: Record<Domain, Bi> = {
    sante: { fr: 'Santé & dépistage', en: 'Health & screening' },
    education: { fr: 'Éducation', en: 'Education' },
    dignite: { fr: 'Dignité menstruelle', en: 'Menstrual dignity' },
    mental: { fr: 'Santé mentale', en: 'Mental health' },
    communaute: { fr: 'Familles & communauté', en: 'Families & community' },
    leadership: { fr: 'Formation des leaders', en: 'Leadership training' },
    autre: { fr: 'Autre action', en: 'Other action' },
};

export const programmeCards: { domain: Domain; title: Bi; body: Bi; image: string; alt: Bi }[] = [
    {
        domain: 'sante',
        title: { fr: 'Santé communautaire', en: 'Community health' },
        body: {
            fr: 'Dépistages gratuits, prise de tension, orientation médicale et conseils personnalisés, installés au cœur des quartiers.',
            en: 'Free screenings, blood-pressure checks, medical referrals and one-to-one advice, set up in the heart of the neighbourhood.',
        },
        image: '/images/gallery/health-screening.webp',
        alt: {
            fr: 'Une bénévole prend les constantes d’une participante lors d’une consultation',
            en: 'A volunteer takes a participant’s vitals during a consultation',
        },
    },
    {
        domain: 'education',
        title: { fr: 'Éducation & maintien scolaire', en: 'Education & staying in school' },
        body: {
            fr: "Fournitures, sensibilisation en classe et accompagnement : nous levons ce qui fait décrocher les élèves, filles comme garçons.",
            en: 'Supplies, classroom sessions and follow-up: we remove what makes pupils drop out, girls and boys alike.',
        },
        image: '/images/gallery/classroom-teaching.webp',
        alt: {
            fr: 'Une animatrice anime un atelier devant une classe',
            en: 'A facilitator leads a workshop in front of a class',
        },
    },
    {
        domain: 'dignite',
        title: { fr: 'Dignité menstruelle', en: 'Menstrual dignity' },
        body: {
            fr: "Protections hygiéniques et ateliers sans tabou, pour qu'aucune adolescente ne manque l'école pendant ses règles.",
            en: 'Sanitary protection and judgement-free workshops, so no adolescent girl misses school during her period.',
        },
        image: '/images/gallery/pad-demonstration.webp',
        alt: {
            fr: 'Une animatrice présente une serviette hygiénique devant un tableau noir',
            en: 'A facilitator demonstrates a sanitary pad in front of a blackboard',
        },
    },
    {
        domain: 'mental',
        title: { fr: 'Santé mentale & écoute', en: 'Mental health & listening' },
        body: {
            fr: 'Entretiens individuels, groupes de parole et sensibilisation : un espace pour dire ce qui pèse et être orienté.',
            en: 'One-to-one conversations, talking groups and awareness sessions: a space to say what weighs on you and be referred.',
        },
        image: '/images/gallery/consultation.webp',
        alt: {
            fr: 'Entretien individuel avec une bénéficiaire',
            en: 'One-to-one conversation with a beneficiary',
        },
    },
    {
        domain: 'communaute',
        title: { fr: 'Familles & mobilisation', en: 'Families & mobilisation' },
        body: {
            fr: "Nous travaillons avec les paroisses et les associations de quartier pour rassembler des centaines de familles en une seule journée.",
            en: 'We work with parishes and neighbourhood associations to bring hundreds of families together in a single day.',
        },
        image: '/images/gallery/church-mobilization.webp',
        alt: {
            fr: 'Réunion de mobilisation dans une église avec le kakémono de l’association',
            en: 'A mobilisation meeting in a church with the association’s roll-up banner',
        },
    },
    {
        domain: 'leadership',
        title: { fr: 'Formation des leaders', en: 'Leadership training' },
        body: {
            fr: "Former des relais locaux — enseignants, responsables religieux, bénévoles — pour que l'action continue après notre départ.",
            en: 'Training local champions — teachers, faith leaders, volunteers — so the work continues after we leave.',
        },
        image: '/images/gallery/partners-circle.webp',
        alt: {
            fr: 'Groupe de leaders communautaires réunis autour du kakémono',
            en: 'A group of community leaders gathered around the roll-up banner',
        },
    },
];

/* ------------------------------- campaigns ----------------------------- */

/** A published campaign as sent by `Campaign::toPublicArray()`. */
export type Campaign = {
    slug: string;
    title: Bi;
    summary: Bi;
    description: Bi;
    domain: Domain;
    location: string | null;
    /** ISO dates. */
    startsAt: string | null;
    endsAt: string | null;
    goalAmount: number | null;
    raisedAmount: number;
    beneficiaries: number | null;
    image: string | null;
    featured: boolean;
};

/** The campaign page receives `Campaign::toPublicDetailArray()`. */
export type CampaignDetail = Campaign & {
    galleryLayout: 'grid' | 'carousel' | 'mosaic';
    gallery: { id: number; url: string; caption: Bi }[];
    documents: { id: number; title: string; url: string; extension: string; size: number }[];
    donorsCount: number;
    recentDonors: { name: string; date: string }[];
};

export const campaignsCopy = {
    eyebrow: { fr: 'Nos campagnes', en: 'Our campaigns' } satisfies Bi,
    title: { fr: 'Ce que nous menons en ce moment', en: 'What we are running right now' } satisfies Bi,
    intro: {
        fr: 'Chaque campagne répond à un besoin précis, dans un lieu précis. Choisissez celle que vous voulez porter avec nous.',
        en: 'Each campaign answers a specific need, in a specific place. Choose the one you want to carry with us.',
    } satisfies Bi,
    empty: {
        fr: 'Nos prochaines campagnes seront annoncées ici très bientôt.',
        en: 'Our next campaigns will be announced here very soon.',
    } satisfies Bi,
    featured: { fr: 'À la une', en: 'Featured' } satisfies Bi,
    details: { fr: 'Voir la campagne', en: 'View campaign' } satisfies Bi,
    donate: { fr: 'Faire un don', en: 'Donate' } satisfies Bi,
    support: { fr: 'Soutenir cette campagne', en: 'Support this campaign' } satisfies Bi,
    raised: { fr: 'collectés', en: 'raised' } satisfies Bi,
    goal: { fr: 'Objectif', en: 'Goal' } satisfies Bi,
    beneficiaries: { fr: 'bénéficiaires visés', en: 'people reached' } satisfies Bi,
    others: { fr: 'Autres campagnes', en: 'Other campaigns' } satisfies Bi,
    back: { fr: "Retour à l'accueil", en: 'Back to home' } satisfies Bi,
    from: { fr: 'Depuis le', en: 'Since' } satisfies Bi,
    momoTitle: { fr: 'Donner par Mobile Money', en: 'Give by Mobile Money' } satisfies Bi,
    momoNote: {
        fr: 'Tous les dons passent par WhatsApp : écrivez-nous, nous vous guidons, puis envoyez votre transfert à l’un de ces numéros en indiquant le nom de la campagne.',
        en: 'All donations go through WhatsApp: message us and we will guide you, then send your transfer to one of these numbers with the campaign name as reference.',
    } satisfies Bi,
    gallery: { fr: 'En images', en: 'In pictures' } satisfies Bi,
    documents: { fr: 'Documents', en: 'Documents' } satisfies Bi,
    donors: { fr: 'Ils ont soutenu cette campagne', en: 'They supported this campaign' } satisfies Bi,
    donorsCount: { fr: 'donateur(s)', en: 'donor(s)' } satisfies Bi,
    donateCta: { fr: 'Faire un don via WhatsApp', en: 'Donate via WhatsApp' } satisfies Bi,
    declare: {
        title: { fr: 'Vous avez fait un don ?', en: 'Have you made a donation?' } satisfies Bi,
        intro: {
            fr: 'Envoyez-nous la capture de votre transfert sur WhatsApp : nous confirmons la réception et votre don est ajouté au total de la campagne.',
            en: 'Send us the screenshot of your transfer on WhatsApp: we confirm we received it and your gift is added to the campaign total.',
        } satisfies Bi,
        cta: { fr: 'Envoyer la preuve sur WhatsApp', en: 'Send the proof on WhatsApp' } satisfies Bi,
    },
};

/* -------------------------------- gallery ------------------------------ */

export type GalleryCategory = 'ecole' | 'sante' | 'communaute';

export const galleryCategories: { id: GalleryCategory; label: Bi }[] = [
    { id: 'ecole', label: { fr: 'Écoles', en: 'Schools' } },
    { id: 'sante', label: { fr: 'Santé', en: 'Health' } },
    { id: 'communaute', label: { fr: 'Communauté', en: 'Community' } },
];

export type GalleryItem = {
    src: string;
    thumb: string;
    category: GalleryCategory;
    caption: Bi;
    /** Portrait images get a taller cell in the masonry grid. */
    portrait?: boolean;
};

export const gallery: GalleryItem[] = [
    {
        src: '/images/gallery/dignity-kits-joy.webp',
        thumb: '/images/gallery/dignity-kits-joy-sm.webp',
        category: 'ecole',
        caption: {
            fr: 'Des élèves brandissent leurs kits de dignité fraîchement reçus',
            en: 'Pupils hold up the dignity kits they have just received',
        },
    },
    {
        src: '/images/gallery/school-assembly.webp',
        thumb: '/images/gallery/school-assembly-sm.webp',
        category: 'ecole',
        portrait: true,
        caption: {
            fr: 'Assemblée scolaire : une élève prend la parole devant ses camarades',
            en: 'School assembly: a pupil takes the microphone in front of her classmates',
        },
    },
    {
        src: '/images/gallery/classroom-teaching.webp',
        thumb: '/images/gallery/classroom-teaching-sm.webp',
        category: 'ecole',
        caption: {
            fr: 'Atelier en classe devant le kakémono de l’association',
            en: 'Classroom workshop in front of the association’s banner',
        },
    },
    {
        src: '/images/gallery/health-screening.webp',
        thumb: '/images/gallery/health-screening-sm.webp',
        category: 'sante',
        portrait: true,
        caption: {
            fr: 'Consultation et dépistage lors d’une journée de santé communautaire',
            en: 'Consultation and screening during a community health day',
        },
    },
    {
        src: '/images/gallery/girls-with-kits.webp',
        thumb: '/images/gallery/girls-with-kits-sm.webp',
        category: 'ecole',
        caption: {
            fr: 'Distribution des kits scolaires et de dignité en salle de classe',
            en: 'Academic and dignity kits handed out in the classroom',
        },
    },
    {
        src: '/images/gallery/outreach-team.webp',
        thumb: '/images/gallery/outreach-team-sm.webp',
        category: 'communaute',
        caption: {
            fr: 'L’équipe de bénévoles devant une assemblée de plus de 300 personnes',
            en: 'The volunteer team in front of a gathering of over 300 people',
        },
    },
    {
        src: '/images/gallery/registration-desk.webp',
        thumb: '/images/gallery/registration-desk-sm.webp',
        category: 'sante',
        portrait: true,
        caption: {
            fr: 'Accueil et enregistrement des participants avant les consultations',
            en: 'Welcome and registration of participants ahead of consultations',
        },
    },
    {
        src: '/images/gallery/pad-demonstration.webp',
        thumb: '/images/gallery/pad-demonstration-sm.webp',
        category: 'ecole',
        caption: {
            fr: 'Démonstration pratique de l’usage des protections hygiéniques',
            en: 'Hands-on demonstration of how to use sanitary protection',
        },
    },
    {
        src: '/images/gallery/church-mobilization.webp',
        thumb: '/images/gallery/church-mobilization-sm.webp',
        category: 'communaute',
        caption: {
            fr: 'Séance de mobilisation avec une communauté paroissiale',
            en: 'Mobilisation session with a parish community',
        },
    },
    {
        src: '/images/gallery/volunteer-speaker.webp',
        thumb: '/images/gallery/volunteer-speaker-sm.webp',
        category: 'communaute',
        portrait: true,
        caption: {
            fr: 'Une bénévole ouvre la séance devant les participants',
            en: 'A volunteer opens the session in front of participants',
        },
    },
    {
        src: '/images/gallery/consultation.webp',
        thumb: '/images/gallery/consultation-sm.webp',
        category: 'sante',
        portrait: true,
        caption: {
            fr: 'Entretien individuel avec une bénéficiaire',
            en: 'One-to-one conversation with a beneficiary',
        },
    },
    {
        src: '/images/gallery/partners-group.webp',
        thumb: '/images/gallery/partners-group-sm.webp',
        category: 'communaute',
        caption: {
            fr: 'Rencontre avec les responsables et partenaires locaux',
            en: 'Meeting with local leaders and partners',
        },
    },
    {
        src: '/images/gallery/dignity-kits-banner.webp',
        thumb: '/images/gallery/dignity-kits-banner-sm.webp',
        category: 'ecole',
        caption: {
            fr: 'Sourires et kits de dignité à la fin de la séance',
            en: 'Smiles and dignity kits at the end of the session',
        },
    },
    {
        src: '/images/gallery/health-post.webp',
        thumb: '/images/gallery/health-post-sm.webp',
        category: 'sante',
        portrait: true,
        caption: {
            fr: 'Poste de santé improvisé pour la journée de dépistage',
            en: 'A pop-up health post set up for the screening day',
        },
    },
    {
        src: '/images/gallery/school-panel.webp',
        thumb: '/images/gallery/school-panel-sm.webp',
        category: 'ecole',
        portrait: true,
        caption: {
            fr: 'Prise de parole devant les élèves et le corps enseignant',
            en: 'Addressing pupils and teaching staff',
        },
    },
    {
        src: '/images/gallery/leaders-meeting.webp',
        thumb: '/images/gallery/leaders-meeting-sm.webp',
        category: 'communaute',
        caption: {
            fr: 'Photo de groupe avec les leaders communautaires partenaires',
            en: 'Group photo with partner community leaders',
        },
    },
];

export const galleryCopy = {
    eyebrow: { fr: 'Sur le terrain', en: 'In the field' } satisfies Bi,
    title: { fr: 'Le travail, tel qu’il se passe', en: 'The work, as it happens' } satisfies Bi,
    intro: {
        fr: 'Aucune image de banque. Chaque photo vient de nos interventions au Cameroun.',
        en: 'No stock photography. Every picture comes from our own field work in Cameroon.',
    } satisfies Bi,
};

/* --------------------------------- news -------------------------------- */

export const newsCopy = {
    eyebrow: { fr: 'Actualités', en: 'News' } satisfies Bi,
    title: { fr: 'Les dernières nouvelles du terrain', en: 'The latest from the field' } satisfies Bi,
    intro: {
        fr: 'Comptes rendus de nos interventions, annonces de campagne et rencontres avec nos partenaires.',
        en: 'Reports from our interventions, campaign announcements and meetings with our partners.',
    } satisfies Bi,
    readMore: { fr: 'Lire la suite', en: 'Read more' } satisfies Bi,
    featured: { fr: 'À la une', en: 'Featured' } satisfies Bi,
    allNews: { fr: 'Toutes les actualités sur WhatsApp', en: 'All updates on WhatsApp' } satisfies Bi,
};

export type NewsCategory = 'campagne' | 'terrain' | 'partenariat';

export const newsCategoryLabels: Record<NewsCategory, Bi> = {
    campagne: { fr: 'Campagne', en: 'Campaign' },
    terrain: { fr: 'Terrain', en: 'Field work' },
    partenariat: { fr: 'Partenariat', en: 'Partnership' },
};

export type NewsItem = {
    /** ISO date — formatted per language at render time. */
    date: string;
    category: NewsCategory;
    title: Bi;
    excerpt: Bi;
    image: string;
    alt: Bi;
    featured?: boolean;
};

export const news: NewsItem[] = [
    {
        date: '2026-08-14',
        category: 'campagne',
        featured: true,
        title: {
            fr: 'Pads & Pages : une nouvelle vague de kits remise aux élèves',
            en: 'Pads & Pages: a new wave of kits handed to pupils',
        },
        excerpt: {
            fr: "Kits académiques et kits de dignité ont été distribués en salle de classe, accompagnés d'un atelier sur l'hygiène menstruelle. Les élèves sont reparties avec de quoi travailler et de quoi traverser leur cycle sereinement.",
            en: 'Academic kits and dignity kits were handed out in the classroom alongside a menstrual hygiene workshop. Pupils left with what they need to study, and what they need to get through their cycle with confidence.',
        },
        image: '/images/gallery/dignity-kits-joy.webp',
        alt: {
            fr: 'Élèves brandissant leurs kits de dignité en salle de classe',
            en: 'Pupils holding up their dignity kits in the classroom',
        },
    },
    {
        date: '2026-08-10',
        category: 'terrain',
        title: {
            fr: 'Journée de santé communautaire : des centaines de familles reçues',
            en: 'Community health day: hundreds of families welcomed',
        },
        excerpt: {
            fr: 'Dépistages, prise de tension et orientation médicale gratuits, installés au cœur du quartier avec nos équipes de bénévoles.',
            en: 'Free screenings, blood-pressure checks and medical referrals, set up in the heart of the neighbourhood with our volunteer teams.',
        },
        image: '/images/gallery/health-screening.webp',
        alt: {
            fr: 'Bénévole réalisant un dépistage lors de la journée de santé',
            en: 'Volunteer running a screening during the health day',
        },
    },
    {
        date: '2026-08-06',
        category: 'terrain',
        title: {
            fr: "Atelier de santé menstruelle : briser le silence en classe",
            en: 'Menstrual health workshop: breaking the silence in class',
        },
        excerpt: {
            fr: "Démonstration pratique, questions sans tabou et distribution de protections : une heure qui change le rapport des élèves à leur corps.",
            en: 'A hands-on demonstration, judgement-free questions and pad distribution: one hour that changes how pupils relate to their own bodies.',
        },
        image: '/images/gallery/pad-demonstration.webp',
        alt: {
            fr: 'Animatrice présentant une protection hygiénique devant la classe',
            en: 'Facilitator demonstrating a sanitary pad in front of the class',
        },
    },
    {
        date: '2026-07-30',
        category: 'partenariat',
        title: {
            fr: 'Nouvelle alliance avec les leaders communautaires',
            en: 'New alliance with community leaders',
        },
        excerpt: {
            fr: "Responsables paroissiaux et associatifs se sont engagés à ouvrir leurs communautés à nos prochaines interventions scolaires et sanitaires.",
            en: 'Parish and neighbourhood leaders committed to opening their communities to our upcoming school and health interventions.',
        },
        image: '/images/gallery/partners-circle.webp',
        alt: {
            fr: 'Groupe de leaders communautaires réunis autour du kakémono',
            en: 'Community leaders gathered around the roll-up banner',
        },
    },
];

/* ------------------------------- quote --------------------------------- */

export const quote = {
    text: {
        fr: 'Arriver avec ce qui manque, expliquer sans juger, et repartir en laissant une communauté plus forte.',
        en: 'Arrive with what is missing, explain without judgement, and leave a community stronger than we found it.',
    } satisfies Bi,
    attribution: {
        fr: 'Maximum Momentum in Action',
        en: 'Maximum Momentum in Action',
    } satisfies Bi,
};

/* ------------------------------- contact ------------------------------- */

export const contact = {
    eyebrow: { fr: 'Nous joindre', en: 'Get in touch' } satisfies Bi,
    title: { fr: 'Parlons-en', en: 'Let’s talk' } satisfies Bi,
    intro: {
        fr: 'Une question, un partenariat, une campagne à accueillir ? Écrivez-nous — nous répondons vite, en français comme en anglais.',
        en: 'A question, a partnership, a campaign to host? Write to us — we reply quickly, in French or English.',
    } satisfies Bi,
    whatsappLabel: { fr: 'WhatsApp — réponse la plus rapide', en: 'WhatsApp — fastest reply' } satisfies Bi,
    emailLabel: { fr: 'E-mail', en: 'Email' } satisfies Bi,
    socialLabel: { fr: 'Réseaux sociaux', en: 'Social media' } satisfies Bi,
    locationLabel: { fr: 'Localisation', en: 'Location' } satisfies Bi,
};

export const footer = {
    rights: { fr: 'Tous droits réservés.', en: 'All rights reserved.' } satisfies Bi,
    builtLine: {
        fr: 'Association à but non lucratif enregistrée au Cameroun.',
        en: 'Non-profit association registered in Cameroon.',
    } satisfies Bi,
    nav: { fr: 'Navigation', en: 'Navigate' } satisfies Bi,
    admin: { fr: 'Espace administrateur', en: 'Admin area' } satisfies Bi,
};
