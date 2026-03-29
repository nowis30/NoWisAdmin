import { prisma } from '@/lib/prisma';
import type { PublishPayload } from '@/types/site';

export async function getDashboardData() {
  const [pagesCount, sectionsCount, mediaCount, contentBlocksCount, lastPublish] = await Promise.all([
    prisma.page.count(),
    prisma.section.count(),
    prisma.mediaAsset.count(),
    prisma.contentBlock.count(),
    prisma.publishSnapshot.findFirst({ orderBy: { createdAt: 'desc' } }),
  ]);

  return { pagesCount, sectionsCount, mediaCount, contentBlocksCount, lastPublish };
}

export async function getContentSections() {
  return prisma.page.findMany({
    include: {
      sections: {
        include: {
          image: true,
          blocks: { orderBy: { sortOrder: 'asc' } },
        },
        orderBy: { sortOrder: 'asc' },
      },
    },
    orderBy: { slug: 'asc' },
  });
}

export async function getAppearanceData() {
  const [siteSettings, themeSettings] = await Promise.all([
    prisma.siteSetting.findFirst(),
    prisma.themeSetting.findFirst(),
  ]);

  return { siteSettings, themeSettings };
}

export async function getSectionsManagementData() {
  const [pages, mediaAssets] = await Promise.all([
    prisma.page.findMany({
      include: {
        sections: {
          include: { image: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { slug: 'asc' },
    }),
    prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } }),
  ]);

  return { pages, mediaAssets };
}

export async function getMediaLibrary() {
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: 'desc' } });
}

export async function buildPublishPayload(): Promise<PublishPayload> {
  const [siteSettings, themeSettings, pages] = await Promise.all([
    prisma.siteSetting.findFirstOrThrow(),
    prisma.themeSetting.findFirstOrThrow(),
    prisma.page.findMany({
      include: {
        sections: {
          where: { isActive: true },
          include: { image: true },
          orderBy: { sortOrder: 'asc' },
        },
      },
      orderBy: { slug: 'asc' },
    }),
  ]);

  return {
    siteSettings,
    themeSettings,
    pages: pages.map((page) => ({
      slug: page.slug,
      title: page.title,
      description: page.description,
      sections: page.sections.map((section) => ({
        key: section.key,
        title: section.title,
        subtitle: section.subtitle,
        description: section.description,
        ctaLabel: section.ctaLabel,
        ctaHref: section.ctaHref,
        isActive: section.isActive,
        sortOrder: section.sortOrder,
        imageUrl: section.image?.url ?? null,
      })),
    })),
  };
}