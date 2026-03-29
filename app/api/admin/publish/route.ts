import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getSessionFromRequest } from '@/lib/auth';
import { buildPublishPayload } from '@/lib/admin-data';
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
  const payload = await buildPublishPayload();

  await prisma.publishSnapshot.create({
    data: {
      notes: valueOf(formData, 'notes') || null,
      payload: JSON.stringify(payload, null, 2),
    },
  });

  revalidatePath('/preview');
  revalidatePath('/dashboard');
  return NextResponse.redirect(new URL('/preview?published=1', request.url));
}