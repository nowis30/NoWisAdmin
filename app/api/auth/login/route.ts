import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_AUTH_COOKIE, authenticateAdmin, signAuthToken } from '@/lib/auth';
import { requireAdminJwtSecret } from '@/lib/admin-config';
import { safeAdminRedirectPath } from '@/lib/admin-redirect';

/**
 * Validates database URL is configured and accessible.
 * Returns null if invalid, otherwise returns error object.
 */
function validateAdminDatabaseConfig(): null | { error: string } {
  const dbUrl = process.env.NOWIS_ADMIN_DATABASE_URL ?? '';

  if (!dbUrl) {
    return { error: 'NOWIS_ADMIN_DATABASE_URL not configured' };
  }

  if (!dbUrl.startsWith('postgresql://') && !dbUrl.startsWith('postgres://')) {
    return { error: 'Invalid NOWIS_ADMIN_DATABASE_URL format' };
  }

  return null;
}

export async function POST(request: Request) {
  try {
    requireAdminJwtSecret();
    // Validate config early
    const configError = validateAdminDatabaseConfig();
    if (configError) {
      console.error('[AUTH_CONFIG_ERROR]', configError.error);
      return NextResponse.redirect(new URL('/login?error=service', request.url), 303);
    }

    const formData = await request.formData();
    const email = String(formData.get('email') ?? '').trim().toLowerCase();
    const password = String(formData.get('password') ?? '');
    const nextUrl = safeAdminRedirectPath(String(formData.get('next') ?? '/dashboard'));

    // Parse form data safely
    if (!email || !password) {
      return NextResponse.redirect(new URL('/login?error=1', request.url), 303);
    }

    let admin: Awaited<ReturnType<typeof authenticateAdmin>> | null = null;
    try {
      admin = await authenticateAdmin(email, password);
    } catch (authError) {
      console.error('[AUTH_DB_ERROR]', authError instanceof Error ? authError.message : String(authError));
      return NextResponse.redirect(new URL('/login?error=service', request.url), 303);
    }

    if (!admin) {
      return NextResponse.redirect(new URL('/login?error=1', request.url), 303);
    }

    const token = signAuthToken({ sub: admin.id, email: admin.email, name: admin.name });
    (await cookies()).set(ADMIN_AUTH_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return NextResponse.redirect(new URL(nextUrl, request.url), 303);
  } catch (err) {
    console.error('[AUTH_FATAL_ERROR]', err instanceof Error ? err.message : String(err));
    return NextResponse.redirect(new URL('/login?error=service', request.url), 303);
  }
}
