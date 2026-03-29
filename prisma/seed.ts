import bcrypt from 'bcryptjs';
import { PrismaClient, ContentBlockKind, PageStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@nowis.local';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMeNowisAdmin123!';
  const adminName = process.env.ADMIN_NAME ?? 'NoWis Admin';
  const passwordHash = await bcrypt.hash(adminPassword, 10);

  await prisma.contentBlock.deleteMany();
  await prisma.section.deleteMany();
  await prisma.page.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.publishSnapshot.deleteMany();
  await prisma.siteSetting.deleteMany();
  await prisma.themeSetting.deleteMany();

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: adminName, passwordHash },
    create: { email: adminEmail, name: adminName, passwordHash },
  });

  await prisma.siteSetting.create({
    data: {
      siteName: 'NoWis',
      siteUrl: 'https://nowis.store',
      defaultSeoTitle: 'NoWis - Creation musicale et experiences de marque',
      defaultSeoDescription: 'Contenus, sections et apparence geres depuis NoWisAdmin.',
      defaultCtaLabel: 'Demarrer un projet',
      defaultCtaHref: '/contact',
    },
  });

  await prisma.themeSetting.create({
    data: {
      primaryColor: '#1f4d4b',
      accentColor: '#d0683d',
      surfaceColor: '#f6f1e8',
      textColor: '#141826',
      mutedColor: '#6b7280',
      borderRadius: '18px',
    },
  });

  type SeedBlock = { key: string; label: string; kind: ContentBlockKind; value: string; sortOrder: number };
  type SeedSection = {
    key: string;
    name: string;
    title: string;
    subtitle?: string;
    description?: string;
    ctaLabel?: string;
    ctaHref?: string;
    sortOrder: number;
    blocks?: SeedBlock[];
  };

  async function createPageWithSections(page: {
    slug: string;
    title: string;
    description: string;
    seoTitle: string;
    seoDescription: string;
    sections: SeedSection[];
  }) {
    const createdPage = await prisma.page.create({
      data: {
        slug: page.slug,
        title: page.title,
        description: page.description,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        status: PageStatus.DRAFT,
      },
    });

    for (const section of page.sections) {
      const createdSection = await prisma.section.create({
        data: {
          pageId: createdPage.id,
          key: section.key,
          name: section.name,
          title: section.title,
          subtitle: section.subtitle || null,
          description: section.description || null,
          ctaLabel: section.ctaLabel || null,
          ctaHref: section.ctaHref || null,
          sortOrder: section.sortOrder,
        },
      });

      if (section.blocks?.length) {
        await prisma.contentBlock.createMany({
          data: section.blocks.map((block) => ({
            sectionId: createdSection.id,
            key: block.key,
            label: block.label,
            kind: block.kind,
            value: block.value,
            sortOrder: block.sortOrder,
          })),
        });
      }
    }
  }

  await createPageWithSections({
    slug: 'home',
    title: 'Accueil',
    description: 'Page d accueil principale avec hero, preuves et appels a l action.',
    seoTitle: 'Accueil | Creation Nowis',
    seoDescription: 'Accueil du site public Creation Nowis.',
    sections: [
      {
        key: 'home.hero',
        name: 'Banniere principale',
        title: 'Creation musicale sur mesure et ateliers creatifs pour enfants',
        subtitle: 'Nowis reunit chansons personnalisees et ateliers creatifs.',
        description: 'Un espace clair pour les projets musique et ateliers.',
        ctaLabel: 'Demander une chanson',
        ctaHref: '/commander-une-chanson',
        sortOrder: 10,
        blocks: [
          { key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Chansons personnalisees', sortOrder: 10 },
          { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Demander un atelier', sortOrder: 20 },
          { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/connexion?next=%2Fclient%2Fworkshops%2Fnouveau', sortOrder: 30 },
        ],
      },
      {
        key: 'home.trust-strip',
        name: 'Bande de confiance',
        title: 'Pourquoi Creation Nowis',
        description: 'Arguments rapides de reassurance.',
        sortOrder: 20,
        blocks: [
          { key: 'trust1.title', label: 'Argument 1 titre', kind: ContentBlockKind.TEXT, value: 'Creation humaine + IA', sortOrder: 10 },
          { key: 'trust1.text', label: 'Argument 1 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Une approche guidee par l emotion.', sortOrder: 20 },
          { key: 'trust2.title', label: 'Argument 2 titre', kind: ContentBlockKind.TEXT, value: 'Contact simple', sortOrder: 30 },
          { key: 'trust2.text', label: 'Argument 2 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Un premier echange clair et humain.', sortOrder: 40 },
        ],
      },
      {
        key: 'home.process',
        name: 'Etapes de creation',
        title: 'Simple a expliquer. Fort a offrir.',
        description: 'Etapes du parcours client.',
        sortOrder: 30,
        blocks: [
          { key: 'step1.title', label: 'Etape 1 titre', kind: ContentBlockKind.TEXT, value: 'Tu racontes ton idee', sortOrder: 10 },
          { key: 'step1.text', label: 'Etape 1 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Quelques lignes suffisent pour commencer.', sortOrder: 20 },
          { key: 'step2.title', label: 'Etape 2 titre', kind: ContentBlockKind.TEXT, value: 'Je transforme en chanson', sortOrder: 30 },
          { key: 'step2.text', label: 'Etape 2 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Direction musicale et emotion.', sortOrder: 40 },
          { key: 'step3.title', label: 'Etape 3 titre', kind: ContentBlockKind.TEXT, value: 'Tu offres quelque chose d unique', sortOrder: 50 },
          { key: 'step3.text', label: 'Etape 3 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Une creation qui reste dans le temps.', sortOrder: 60 },
        ],
      },
    ],
  });

  await createPageWithSections({
    slug: 'musique',
    title: 'Musique',
    description: 'Page d exemples musicaux.',
    seoTitle: 'Musique | Creation Nowis',
    seoDescription: 'Exemples de chansons.',
    sections: [
      {
        key: 'musique.hero',
        name: 'Hero musique',
        title: 'Des exemples pour entendre le style',
        description: 'Ecoute des exemples concrets avant de commander.',
        ctaLabel: 'Commander une chanson',
        ctaHref: '/commander-une-chanson',
        sortOrder: 10,
        blocks: [
          { key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Musique', sortOrder: 10 },
          { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Voir les videos', sortOrder: 20 },
          { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/videos', sortOrder: 30 },
        ],
      },
      {
        key: 'musique.songs-grid',
        name: 'Grille des chansons',
        title: 'Les creations musicales de Nowis Morin',
        description: 'Cartes chansons affichees en grille.',
        sortOrder: 20,
      },
    ],
  });

  await createPageWithSections({
    slug: 'videos',
    title: 'Videos',
    description: 'Page d options visuelles et videos IA.',
    seoTitle: 'Videos | Creation Nowis',
    seoDescription: 'Videos en complement des chansons.',
    sections: [
      {
        key: 'videos.hero',
        name: 'Hero videos',
        title: 'Des options visuelles pour accompagner une chanson',
        description: 'Les videos sont un complement creatif.',
        ctaLabel: 'Commander une chanson',
        ctaHref: '/commander-une-chanson',
        sortOrder: 10,
        blocks: [
          { key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Videos', sortOrder: 10 },
          { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Parler de mon projet', sortOrder: 20 },
          { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/contact?projectType=video', sortOrder: 30 },
        ],
      },
      {
        key: 'videos.grid',
        name: 'Grille des videos',
        title: 'Complements visuels',
        description: 'Cartes videos affichees en grille.',
        sortOrder: 20,
      },
    ],
  });

  await createPageWithSections({
    slug: 'services',
    title: 'Services',
    description: 'Services et collaborations.',
    seoTitle: 'Services | Creation Nowis',
    seoDescription: 'Services proposes par Nowis Morin.',
    sections: [
      {
        key: 'services.hero',
        name: 'Hero services',
        title: 'Des creations personnalisees pour tes projets',
        description: 'Chansons, videos, visuels et concepts.',
        ctaLabel: 'Parler de mon projet',
        ctaHref: '/contact?projectType=autre',
        sortOrder: 10,
        blocks: [
          { key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Services / Collaborations', sortOrder: 10 },
          { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Ecouter mes chansons', sortOrder: 20 },
          { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/musique', sortOrder: 30 },
        ],
      },
      {
        key: 'services.offers-cards',
        name: 'Cartes des services',
        title: 'Les offres principales',
        description: 'Liste des services en cartes.',
        sortOrder: 20,
        blocks: [
          { key: 'item1.title', label: 'Carte 1 titre', kind: ContentBlockKind.TEXT, value: 'Chansons personnalisees', sortOrder: 10 },
          { key: 'item1.text', label: 'Carte 1 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Pour marquer un moment et raconter une histoire.', sortOrder: 20 },
          { key: 'item2.title', label: 'Carte 2 titre', kind: ContentBlockKind.TEXT, value: 'Videos personnalisees', sortOrder: 30 },
          { key: 'item2.text', label: 'Carte 2 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Formats visuels pour reseaux sociaux.', sortOrder: 40 },
        ],
      },
      {
        key: 'services.final-cta',
        name: 'Bloc final service',
        title: 'Une idee speciale ? Ecris-moi.',
        description: 'Zone de conclusion avec appel a l action.',
        ctaLabel: 'Parler de mon projet',
        ctaHref: '/contact',
        sortOrder: 30,
      },
    ],
  });

  await createPageWithSections({
    slug: 'contact',
    title: 'Contact',
    description: 'Contact direct, vie privee et reseaux sociaux.',
    seoTitle: 'Contact | Creation Nowis',
    seoDescription: 'Page contact.',
    sections: [
      {
        key: 'contact.hero',
        name: 'Hero contact',
        title: 'Parle-moi de ton projet',
        description: 'Prise de contact simple et humaine.',
        sortOrder: 10,
        blocks: [{ key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Contact', sortOrder: 10 }],
      },
      {
        key: 'contact.direct-info',
        name: 'Contact direct',
        title: 'Contact direct',
        description: 'Email, telephone et boutons de connexion.',
        sortOrder: 20,
        blocks: [
          { key: 'email', label: 'Adresse email', kind: ContentBlockKind.TEXT, value: 'contact@creationnowis.com', sortOrder: 10 },
          { key: 'phone', label: 'Numero de telephone', kind: ContentBlockKind.TEXT, value: '+1 514 555 0101', sortOrder: 20 },
          { key: 'button1.label', label: 'Bouton 1 texte', kind: ContentBlockKind.TEXT, value: 'Se connecter pour une demande chanson', sortOrder: 30 },
          { key: 'button1.href', label: 'Bouton 1 lien', kind: ContentBlockKind.LINK, value: '/connexion?next=%2Fclient%2Fsong-requests%2Fnouveau', sortOrder: 40 },
        ],
      },
      {
        key: 'contact.social-links',
        name: 'Reseaux sociaux',
        title: 'Ou suivre Nowis Morin',
        description: 'Liens vers les plateformes.',
        sortOrder: 30,
        blocks: [
          { key: 'spotify', label: 'Lien Spotify', kind: ContentBlockKind.LINK, value: 'https://open.spotify.com/', sortOrder: 10 },
          { key: 'youtube', label: 'Lien YouTube', kind: ContentBlockKind.LINK, value: 'https://youtube.com/', sortOrder: 20 },
          { key: 'instagram', label: 'Lien Instagram', kind: ContentBlockKind.LINK, value: 'https://instagram.com/', sortOrder: 30 },
          { key: 'facebook', label: 'Lien Facebook', kind: ContentBlockKind.LINK, value: 'https://facebook.com/', sortOrder: 40 },
        ],
      },
    ],
  });

  await createPageWithSections({
    slug: 'commander-une-chanson',
    title: 'Commander une chanson',
    description: 'Page commerciale principale des demandes chanson.',
    seoTitle: 'Commander une chanson | Creation Nowis',
    seoDescription: 'Commande de chanson personnalisee.',
    sections: [
      {
        key: 'song.hero',
        name: 'Hero chanson',
        title: 'Une chanson sur mesure a partir de ton histoire',
        description: 'Demande claire, simple et guidee.',
        ctaLabel: 'Commander une chanson',
        ctaHref: '#acces-portail',
        sortOrder: 10,
        blocks: [
          { key: 'eyebrow', label: 'Petit texte au-dessus', kind: ContentBlockKind.TEXT, value: 'Chanson personnalisee', sortOrder: 10 },
          { key: 'secondaryCta.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Ecouter des exemples', sortOrder: 20 },
          { key: 'secondaryCta.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/musique', sortOrder: 30 },
        ],
      },
      {
        key: 'song.how-it-works',
        name: 'Etapes chanson',
        title: 'Une commande simple, claire et guidee',
        description: 'Etapes de prise de contact jusqu a la finalisation.',
        sortOrder: 20,
        blocks: [
          { key: 'step1.title', label: 'Etape 1 titre', kind: ContentBlockKind.TEXT, value: 'Prise de contact', sortOrder: 10 },
          { key: 'step1.text', label: 'Etape 1 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Tu partages ton histoire.', sortOrder: 20 },
          { key: 'step2.title', label: 'Etape 2 titre', kind: ContentBlockKind.TEXT, value: 'Creation musicale', sortOrder: 30 },
          { key: 'step2.text', label: 'Etape 2 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Je compose selon l emotion.', sortOrder: 40 },
          { key: 'step3.title', label: 'Etape 3 titre', kind: ContentBlockKind.TEXT, value: 'Finalisation', sortOrder: 50 },
          { key: 'step3.text', label: 'Etape 3 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Version finale et ajustements.', sortOrder: 60 },
        ],
      },
      {
        key: 'song.packages',
        name: 'Offres chanson',
        title: 'Trois facons d aborder ta chanson',
        description: 'Niveaux d accompagnement.',
        sortOrder: 30,
        blocks: [
          { key: 'item1.title', label: 'Offre 1 titre', kind: ContentBlockKind.TEXT, value: 'Mise en chanson', sortOrder: 10 },
          { key: 'item1.text', label: 'Offre 1 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Pour un texte deja ecrit.', sortOrder: 20 },
          { key: 'item2.title', label: 'Offre 2 titre', kind: ContentBlockKind.TEXT, value: 'Chanson personnalisee', sortOrder: 30 },
          { key: 'item2.text', label: 'Offre 2 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Pour une histoire a transformer.', sortOrder: 40 },
          { key: 'item3.title', label: 'Offre 3 titre', kind: ContentBlockKind.TEXT, value: 'Chanson emotion', sortOrder: 50 },
          { key: 'item3.text', label: 'Offre 3 texte', kind: ContentBlockKind.RICH_TEXT, value: 'Pour une demande intime ou delicate.', sortOrder: 60 },
        ],
      },
      {
        key: 'song.final-cta',
        name: 'Bloc final chanson',
        title: 'Pret a lancer la demande',
        description: 'Zone finale pour passer a l action.',
        ctaLabel: 'Commander une chanson',
        ctaHref: '#commande',
        sortOrder: 40,
        blocks: [
          { key: 'cta2.label', label: 'Bouton secondaire texte', kind: ContentBlockKind.TEXT, value: 'Parler de mon projet', sortOrder: 10 },
          { key: 'cta2.href', label: 'Bouton secondaire lien', kind: ContentBlockKind.LINK, value: '/contact?projectType=chanson', sortOrder: 20 },
        ],
      },
    ],
  });

  console.log('NoWisAdmin database seeded successfully');
  console.log(`Admin login: ${adminEmail}`);
  console.log(`Admin password: ${adminPassword}`);
}

main()
  .catch((error) => {
    console.error('NoWisAdmin seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });