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
  return NextResponse.redirect(new URL('/appearance?saved=site', request.url));
}