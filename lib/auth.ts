import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';
import { requireAdminJwtSecret } from '@/lib/admin-config';

export const ADMIN_AUTH_COOKIE = 'nowis_admin_session';

type AdminTokenPayload = {
  sub: string;
  email: string;
  name: string;
};

export function signAuthToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, requireAdminJwtSecret(), { expiresIn: '7d', algorithm: 'HS256' });
}

export function verifyAuthToken(token: string) {
  try {
    const payload = jwt.verify(token, requireAdminJwtSecret(), { algorithms: ['HS256'] });
    if (typeof payload === 'string' || typeof payload.sub !== 'string' || !payload.sub ||
      typeof payload.email !== 'string' || !payload.email || typeof payload.name !== 'string' ||
      typeof payload.exp !== 'number') return null;
    return payload as AdminTokenPayload;
  } catch {
    return null;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const admin = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase() } });
  if (!admin) return null;

  const isValid = await bcrypt.compare(password, admin.passwordHash);
  if (!isValid) return null;

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  return admin;
}

export async function getSessionFromCookieStore() {
  const token = (await cookies()).get(ADMIN_AUTH_COOKIE)?.value;
  return token ? verifyAuthToken(token) : null;
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  return token ? verifyAuthToken(token) : null;
}

export async function requireAdminSession() {
  const session = await getSessionFromCookieStore();
  if (!session) redirect('/login');
  return session;
}
