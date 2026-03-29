import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const STYLE_BG_KEY = 'style.backgroundColor';
const STYLE_TEXT_KEY = 'style.textColor';

function valueOf(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: NextRequest) {
  if (!getSessionFromRequest(request)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  const formData = await request.formData();
  const sectionId = valueOf(formData, 'sectionId');
  const imageId = valueOf(formData, 'imageId');
  const sortOrderValue = Number(valueOf(formData, 'sortOrder'));

  if (!sectionId) {
    return NextResponse.json({ error: 'sectionId is required' }, { status: 400 });
  }

  await prisma.section.update({
    where: { id: sectionId },
    data: {
      title: valueOf(formData, 'title'),
      subtitle: valueOf(formData, 'subtitle') || null,
      description: valueOf(formData, 'description') || null,
      ctaLabel: valueOf(formData, 'ctaLabel') || null,
      ctaHref: valueOf(formData, 'ctaHref') || null,
      imageId: imageId || null,
      isActive: valueOf(formData, 'isActive') === 'on',
      sortOrder: Number.isFinite(sortOrderValue) ? sortOrderValue : 0,
    },
  });

  const bgColor = valueOf(formData, 'styleBackgroundColor') || '#f8fafc';
  const textColor = valueOf(formData, 'styleTextColor') || '#141826';

  await prisma.contentBlock.upsert({
    where: {
      sectionId_key: {
        sectionId,
        key: STYLE_BG_KEY,
      },
    },
    create: {
      sectionId,
      key: STYLE_BG_KEY,
      label: 'Couleur de fond de section',
      kind: 'TEXT',
      value: bgColor,
      sortOrder: 900,
    },
    update: {
      value: bgColor,
      label: 'Couleur de fond de section',
    },
  });

  await prisma.contentBlock.upsert({
    where: {
      sectionId_key: {
        sectionId,
        key: STYLE_TEXT_KEY,
      },
    },
    create: {
      sectionId,
      key: STYLE_TEXT_KEY,
      label: 'Couleur de texte de section',
      kind: 'TEXT',
      value: textColor,
      sortOrder: 901,
    },
    update: {
      value: textColor,
      label: 'Couleur de texte de section',
    },
  });

  const dynamicEntries = Array.from(formData.entries()).filter(([key]) => key.startsWith('blockKey:'));

  await Promise.all(
    dynamicEntries.map(async ([entryKey, entryValue], index) => {
      const blockKey = entryKey.replace('blockKey:', '').trim();
      if (!blockKey || blockKey === STYLE_BG_KEY || blockKey === STYLE_TEXT_KEY) {
        return;
      }

      const label = valueOf(formData, `blockLabel:${blockKey}`) || blockKey;
      const kindValue = valueOf(formData, `blockKind:${blockKey}`);
      const kind = kindValue === 'LINK' || kindValue === 'RICH_TEXT' ? kindValue : 'TEXT';
      const value = typeof entryValue === 'string' ? entryValue.trim() : '';

      await prisma.contentBlock.upsert({
        where: {
          sectionId_key: {
            sectionId,
            key: blockKey,
          },
        },
        create: {
          sectionId,
          key: blockKey,
          label,
          kind,
          value,
          sortOrder: 950 + index,
        },
        update: {
          label,
          kind,
          value,
        },
      });
    }),
  );

  revalidatePath('/content');
  revalidatePath('/sections');
  revalidatePath('/dashboard');
  revalidatePath('/preview');

  return NextResponse.json({ ok: true });
}
