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
  return NextResponse.redirect(new URL('/sections?saved=1', request.url));
}