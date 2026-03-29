import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import type { ContentBlockKind, PageStatus } from '@prisma/client';

/**
 * POST /api/admin/seed
 * Initializes the database with admin user, default settings, and sample content.
 * 
 * SECURITY: Requires ADMIN_SEED_TOKEN header (must match ADMIN_SEED_TOKEN env var).
 * Use this endpoint carefully in production. Remove after initial seed.
 * 
 * @param request - HTTP request with ADMIN_SEED_TOKEN header
 * @returns JSON confirmation or error
 */
export async function POST(request: Request) {
  try {
    // Validate seed token
    const seedToken = request.headers.get('x-admin-seed-token');
    const expectedToken = process.env.ADMIN_SEED_TOKEN;

    if (!expectedToken) {
      return NextResponse.json(
        { error: 'Seed endpoint not enabled. Set ADMIN_SEED_TOKEN environment variable.' },
        { status: 403 },
      );
    }

    if (seedToken !== expectedToken) {
      return NextResponse.json(
        { error: 'Invalid or missing seed token' },
        { status: 401 },
      );
    }

    // Prepare admin credentials from env
    const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@nowis.local';
    const adminPassword = process.env.ADMIN_PASSWORD ?? 'ChangeMeNowis123!';
    const adminName = process.env.ADMIN_NAME ?? 'NoWis Admin';
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Upsert admin user
    const admin = await prisma.adminUser.upsert({
      where: { email: adminEmail },
      update: { name: adminName, passwordHash },
      create: { email: adminEmail, name: adminName, passwordHash },
    });

    // Upsert site settings
    await prisma.siteSetting.upsert({
      where: { id: 'default' },
      update: {
        siteName: 'NoWis',
        siteUrl: 'https://nowis.store',
        defaultSeoTitle: 'NoWis - Creation musicale et experiences de marque',
        defaultSeoDescription: 'Contenus, sections et apparence geres depuis NoWisAdmin.',
      },
      create: {
        id: 'default',
        siteName: 'NoWis',
        siteUrl: 'https://nowis.store',
        defaultSeoTitle: 'NoWis - Creation musicale et experiences de marque',
        defaultSeoDescription: 'Contenus, sections et apparence geres depuis NoWisAdmin.',
        defaultCtaLabel: 'Demarrer un projet',
        defaultCtaHref: '/contact',
      },
    });

    // Upsert theme settings
    await prisma.themeSetting.upsert({
      where: { id: 'default' },
      update: {
        primaryColor: '#1f4d4b',
        accentColor: '#d0683d',
        surfaceColor: '#f6f1e8',
        textColor: '#141826',
      },
      create: {
        id: 'default',
        primaryColor: '#1f4d4b',
        accentColor: '#d0683d',
        surfaceColor: '#f6f1e8',
        textColor: '#141826',
        mutedColor: '#6b7280',
        borderRadius: '18px',
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
        admin: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
        },
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('[SEED_ERROR]', err instanceof Error ? err.message : String(err));
    return NextResponse.json(
      {
        error: 'Seed failed',
        message: err instanceof Error ? err.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}
