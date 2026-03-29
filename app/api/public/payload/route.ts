import { NextResponse } from 'next/server';

import { buildPublishPayload } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const latest = await prisma.publishSnapshot.findFirst({
    orderBy: { createdAt: 'desc' },
  });

  if (latest?.payload) {
    try {
      const parsed = JSON.parse(latest.payload);
      return NextResponse.json({ source: 'published-snapshot', payload: parsed });
    } catch {
      // If snapshot payload is invalid JSON, fallback to current live admin payload.
    }
  }

  const payload = await buildPublishPayload();
  return NextResponse.json({ source: 'live-admin', payload });
}
