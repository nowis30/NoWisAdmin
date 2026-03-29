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
  return NextResponse.redirect(new URL('/appearance?saved=theme', request.url));
}