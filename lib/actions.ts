'use server';

import { revalidatePath } from 'next/cache';

import { buildPublishPayload } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function updateSiteSettingsAction(formData: FormData) {
  const current = await prisma.siteSetting.findFirstOrThrow();

  await prisma.siteSetting.update({
    where: { id: current.id },
    data: {
      siteName: valueOf(formData, 'siteName'),
      siteUrl: valueOf(formData, 'siteUrl'),
      defaultSeoTitle: valueOf(formData, 'defaultSeoTitle'),
      defaultSeoDescription: valueOf(formData, 'defaultSeoDescription'),
      defaultCtaLabel: valueOf(formData, 'defaultCtaLabel'),
      defaultCtaHref: valueOf(formData, 'defaultCtaHref'),
    },
  });

  revalidatePath('/appearance');
  revalidatePath('/preview');
}

export async function updateThemeSettingsAction(formData: FormData) {
  const current = await prisma.themeSetting.findFirstOrThrow();

  await prisma.themeSetting.update({
    where: { id: current.id },
    data: {
      primaryColor: valueOf(formData, 'primaryColor'),
      accentColor: valueOf(formData, 'accentColor'),
      surfaceColor: valueOf(formData, 'surfaceColor'),
      textColor: valueOf(formData, 'textColor'),
      mutedColor: valueOf(formData, 'mutedColor'),
      borderRadius: valueOf(formData, 'borderRadius'),
    },
  });

  revalidatePath('/appearance');
  revalidatePath('/preview');
}

export async function updateSectionContentAction(formData: FormData) {
  const sectionId = valueOf(formData, 'sectionId');

  await prisma.section.update({
    where: { id: sectionId },
    data: {
      title: valueOf(formData, 'title'),
      subtitle: valueOf(formData, 'subtitle') || null,
      description: valueOf(formData, 'description') || null,
      ctaLabel: valueOf(formData, 'ctaLabel') || null,
      ctaHref: valueOf(formData, 'ctaHref') || null,
    },
  });

  const blocks = await prisma.contentBlock.findMany({ where: { sectionId } });
  await Promise.all(
    blocks.map((block) =>
      prisma.contentBlock.update({
        where: { id: block.id },
        data: { value: valueOf(formData, `block:${block.id}`) },
      }),
    ),
  );

  revalidatePath('/content');
  revalidatePath('/preview');
}

export async function updateSectionSettingsAction(formData: FormData) {
  const sectionId = valueOf(formData, 'sectionId');
  const imageId = valueOf(formData, 'imageId');
  const sortOrderValue = Number(valueOf(formData, 'sortOrder'));

  await prisma.section.update({
    where: { id: sectionId },
    data: {
      isActive: formData.get('isActive') === 'on',
      sortOrder: Number.isFinite(sortOrderValue) ? sortOrderValue : 0,
      imageId: imageId || null,
    },
  });

  revalidatePath('/sections');
  revalidatePath('/dashboard');
  revalidatePath('/preview');
}

export async function publishSnapshotAction(formData: FormData) {
  const payload = await buildPublishPayload();

  await prisma.publishSnapshot.create({
    data: {
      notes: valueOf(formData, 'notes') || null,
      payload: JSON.stringify(payload, null, 2),
    },
  });

  revalidatePath('/preview');
  revalidatePath('/dashboard');
}