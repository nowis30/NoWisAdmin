import { NextResponse } from 'next/server';

import { buildPublishPayload } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!process.env.NOWIS_ADMIN_DATABASE_URL) {
    return NextResponse.json(
      {
        source: 'unavailable',
        payload: null,
        error: 'NOWIS_ADMIN_DATABASE_URL is not configured',
      },
      { status: 503 },
    );
  }

  let latest = null;
  try {
    latest = await prisma.publishSnapshot.findFirst({
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    latest = null;
  }

  if (latest?.payload) {
    try {
      const parsed = JSON.parse(latest.payload);
      return NextResponse.json({ source: 'published-snapshot', payload: parsed });
    } catch {
      // If snapshot payload is invalid JSON, fallback to current live admin payload.
    }
  }

  try {
    const payload = await buildPublishPayload();
    return NextResponse.json({ source: 'live-admin', payload });
  } catch {
    return NextResponse.json(
      {
        source: 'unavailable',
        payload: null,
        error: 'Database is not reachable',
      },
      { status: 503 },
    );
  }
}
