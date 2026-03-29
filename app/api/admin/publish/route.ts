import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

import { getSessionFromRequest } from '@/lib/auth';
import { buildPublishPayload } from '@/lib/admin-data';
import { evaluatePublishQuality } from '@/lib/publish-quality-gate';
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
  const gate = evaluatePublishQuality(payload);

  if (gate.isBlocked) {
    const url = new URL('/publish', request.url);
    url.searchParams.set('gate', 'blocked');
    url.searchParams.set('blocking', String(gate.blocking.length));
    url.searchParams.set('warnings', String(gate.warnings.length));
    url.searchParams.set('suggestions', String(gate.suggestions.length));
    return NextResponse.redirect(url);
  }

  await prisma.publishSnapshot.create({
    data: {
      notes: valueOf(formData, 'notes') || null,
      payload: JSON.stringify(payload, null, 2),
    },
  });

  revalidatePath('/publish');
  revalidatePath('/preview');
  revalidatePath('/dashboard');
  return NextResponse.redirect(new URL('/publish?published=1', request.url));
}