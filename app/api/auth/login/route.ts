import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_AUTH_COOKIE, authenticateAdmin, signAuthToken } from '@/lib/auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');
  const nextUrl = String(formData.get('next') ?? '/dashboard');

  const admin = await authenticateAdmin(email, password);
  if (!admin) {
    return NextResponse.redirect(new URL('/login?error=1', request.url));
  }

  const token = signAuthToken({ sub: admin.id, email: admin.email, name: admin.name });
  cookies().set(ADMIN_AUTH_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return NextResponse.redirect(new URL(nextUrl || '/dashboard', request.url));
}