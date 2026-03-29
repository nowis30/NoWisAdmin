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

  const homePage = await prisma.page.create({
    data: {
      slug: 'home',
      title: 'Accueil',
      description: 'Configuration centrale de la page d accueil publique.',
      seoTitle: 'NoWis | Accueil',
      seoDescription: 'Page d accueil configuree depuis NoWisAdmin.',
      status: PageStatus.DRAFT,
    },
  });

  const hero = await prisma.section.create({
    data: {
      pageId: homePage.id,
      key: 'home.hero',
      name: 'Hero',
      title: 'Creer une presence qui chante juste',
      subtitle: 'Administration simple pour tes contenus essentiels.',
      description: 'Modifie titres, visuels, appels a l action et themes sans toucher au code du site public.',
      ctaLabel: 'Voir les services',
      ctaHref: '/services',
      sortOrder: 10,
    },
  });

  const services = await prisma.section.create({
    data: {
      pageId: homePage.id,
      key: 'home.services',
      name: 'Services',
      title: 'Services en avant',
      subtitle: 'Pilote ce qui doit etre visible en premier.',
      description: 'Choisis les messages les plus importants et l ordre de presentation plus tard.',
      ctaLabel: 'Parcourir',
      ctaHref: '/services',
      sortOrder: 20,
    },
  });

  const about = await prisma.section.create({
    data: {
      pageId: homePage.id,
      key: 'home.about',
      name: 'A propos',
      title: 'Une vitrine plus simple a maintenir',
      subtitle: 'Pensée pour evoluer sans dette inutile.',
      description: 'L admin prepare aussi les conventions de donnees a partager ensuite avec site-nowis-web.',
      ctaLabel: 'En savoir plus',
      ctaHref: '/a-propos',
      sortOrder: 30,
    },
  });

  await prisma.contentBlock.createMany({
    data: [
      { sectionId: hero.id, key: 'eyebrow', label: 'Sur-titre', kind: ContentBlockKind.TEXT, value: 'NoWisAdmin', sortOrder: 10 },
      { sectionId: hero.id, key: 'secondary-cta-label', label: 'Bouton secondaire', kind: ContentBlockKind.TEXT, value: 'Prendre rendez-vous', sortOrder: 20 },
      { sectionId: hero.id, key: 'secondary-cta-href', label: 'Lien bouton secondaire', kind: ContentBlockKind.LINK, value: '/booking', sortOrder: 30 },
      { sectionId: services.id, key: 'card-1-title', label: 'Service 1', kind: ContentBlockKind.TEXT, value: 'Chanson sur mesure', sortOrder: 10 },
      { sectionId: services.id, key: 'card-2-title', label: 'Service 2', kind: ContentBlockKind.TEXT, value: 'Accompagnement de marque', sortOrder: 20 },
      { sectionId: about.id, key: 'quote', label: 'Citation', kind: ContentBlockKind.RICH_TEXT, value: 'Une seule source de verite pour les contenus visibles du site.', sortOrder: 10 },
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