import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

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
  return NextResponse.redirect(new URL('/content?saved=1', request.url));
}