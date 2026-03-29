import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { ADMIN_AUTH_COOKIE } from '@/lib/auth';

export async function POST(request: Request) {
  cookies().delete(ADMIN_AUTH_COOKIE);
  return NextResponse.redirect(new URL('/login', request.url));
}