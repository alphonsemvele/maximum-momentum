<?php

namespace Database\Seeders;

use App\Models\Campaign;
use Illuminate\Database\Seeder;

/**
 * Starter campaigns drawn from the association's existing material. They are
 * meant to be edited from the admin, not treated as the final record.
 */
class CampaignSeeder extends Seeder
{
    public function run(): void
    {
        $campaigns = [
            [
                'slug' => 'pads-and-pages',
                'title_fr' => 'Initiative Pads & Pages',
                'title_en' => 'The Pads & Pages Initiative',
                'summary_fr' => "Kits scolaires, protections hygiéniques et ateliers de santé pour que les adolescentes ne manquent plus l'école pendant leurs règles.",
                'summary_en' => 'School kits, sanitary protection and health workshops so adolescent girls no longer miss school during their periods.',
                'description_fr' => "La précarité menstruelle fait manquer aux adolescentes camerounaises 54 à 81 jours de cours chaque année.\n\nChaque fille reçoit un kit académique (cahiers, stylos, crayons, gomme, calculatrice), un kit de dignité (serviettes hygiéniques et guide d'hygiène illustré) et participe à un atelier de santé menstruelle et mentale.\n\n5 000 FCFA (environ 10 $) suffisent à équiper une élève.",
                'description_en' => "Period poverty causes adolescent girls in Cameroon to miss 54 to 81 days of school every year.\n\nEach girl receives an academic kit (exercise books, pens, pencils, eraser, calculator), a dignity kit (sanitary pads and an illustrated hygiene guide) and joins a menstrual and mental health workshop.\n\n5,000 FCFA (about $10) is enough to equip one pupil.",
                'domain' => 'dignite',
                'location' => 'Yaoundé',
                'image_path' => '/images/gallery/dignity-kits-joy.webp',
                'status' => 'published',
                'is_featured' => true,
            ],
            [
                'slug' => 'journees-sante-communautaire',
                'title_fr' => 'Journées de santé communautaire',
                'title_en' => 'Community health days',
                'summary_fr' => 'Dépistages gratuits, prise de tension, orientation médicale et conseils personnalisés, installés au cœur des quartiers.',
                'summary_en' => 'Free screenings, blood-pressure checks, medical referrals and one-to-one advice, set up in the heart of the neighbourhood.',
                'description_fr' => "Avec nos bénévoles soignants, nous installons un poste de santé pour une journée : accueil et enregistrement, prise des constantes, dépistages, entretiens individuels et orientation vers les structures de soins.\n\nUne seule journée peut rassembler plus de 300 participants.",
                'description_en' => "With our volunteer health workers we set up a pop-up health post for the day: welcome and registration, vital signs, screenings, one-to-one conversations and referrals to care facilities.\n\nA single day can bring together more than 300 participants.",
                'domain' => 'sante',
                'location' => 'Yaoundé',
                'beneficiaries' => 300,
                'image_path' => '/images/gallery/health-screening.webp',
                'status' => 'published',
            ],
            [
                'slug' => 'formation-leaders-communautaires',
                'title_fr' => 'Formation des leaders communautaires',
                'title_en' => 'Community leadership training',
                'summary_fr' => "Former enseignants, responsables religieux et bénévoles pour que l'action continue dans chaque communauté après notre passage.",
                'summary_en' => 'Training teachers, faith leaders and volunteers so the work continues in every community after we leave.',
                'description_fr' => "Nous travaillons avec les paroisses et les associations de quartier pour former des relais locaux capables de sensibiliser, d'orienter et de mobiliser les familles toute l'année.",
                'description_en' => 'We work with parishes and neighbourhood associations to train local champions who can raise awareness, refer and mobilise families all year round.',
                'domain' => 'leadership',
                'location' => 'Yaoundé',
                'image_path' => '/images/gallery/partners-circle.webp',
                'status' => 'published',
            ],
            [
                'slug' => 'tournee-rentree-2026',
                'title_fr' => 'Tournée de rentrée — septembre 2026',
                'title_en' => 'Back-to-school tour — September 2026',
                'summary_fr' => 'Remise de kits aux élèves et rencontres avec les familles lors de notre tournée de rentrée.',
                'summary_en' => 'Kits handed to pupils and meetings with families during our back-to-school tour.',
                'domain' => 'education',
                'starts_at' => '2026-09-04',
                'image_path' => '/images/campaigns/rentree-2026-remise.jpg',
                'status' => 'draft',
            ],
        ];

        foreach ($campaigns as $campaign) {
            // Never overwrite a campaign that already exists: it may have been edited in the admin.
            Campaign::firstOrCreate(['slug' => $campaign['slug']], $campaign);
        }

        // Starter galleries from the field photos already on the site.
        $galleries = [
            'pads-and-pages' => [
                ['/images/gallery/dignity-kits-joy.webp', 'Des élèves brandissent leurs kits de dignité'],
                ['/images/gallery/pad-demonstration.webp', 'Démonstration de l’usage des protections hygiéniques'],
                ['/images/gallery/girls-with-kits.webp', 'Distribution des kits scolaires et de dignité'],
                ['/images/gallery/classroom-teaching.webp', 'Atelier de santé menstruelle en classe'],
                ['/images/gallery/dignity-kits-banner.webp', 'Sourires à la fin de la séance'],
            ],
            'journees-sante-communautaire' => [
                ['/images/gallery/health-screening.webp', 'Consultation et dépistage'],
                ['/images/gallery/registration-desk.webp', 'Accueil et enregistrement des participants'],
                ['/images/gallery/health-post.webp', 'Poste de santé de la journée'],
                ['/images/gallery/outreach-team.webp', 'L’équipe devant plus de 300 participants'],
            ],
            'formation-leaders-communautaires' => [
                ['/images/gallery/partners-circle.webp', 'Leaders communautaires réunis'],
                ['/images/gallery/leaders-meeting.webp', 'Photo de groupe avec les partenaires'],
                ['/images/gallery/church-mobilization.webp', 'Séance de mobilisation en paroisse'],
            ],
            'tournee-rentree-2026' => [
                ['/images/campaigns/rentree-2026-remise.jpg', 'Remise de kits à une élève'],
                ['/images/campaigns/rentree-2026-tournee.jpg', 'L’équipe à la rencontre des familles'],
            ],
        ];

        foreach ($galleries as $slug => $images) {
            $campaign = Campaign::where('slug', $slug)->first();

            if (! $campaign || $campaign->images()->exists()) {
                continue;
            }

            foreach ($images as $position => [$path, $caption]) {
                $campaign->images()->create(['path' => $path, 'caption_fr' => $caption, 'position' => $position + 1]);
            }
        }
    }
}
