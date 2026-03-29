import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { NextRequest } from 'next/server';

import { prisma } from '@/lib/prisma';

export const ADMIN_AUTH_COOKIE = 'nowis_admin_session';

type AdminTokenPayload = {
  sub: string;
  email: string;
  name: string;
};

function getJwtSecret() {
  return process.env.ADMIN_JWT_SECRET ?? 'change-this-secret-before-production';
}

export function signAuthToken(payload: AdminTokenPayload) {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: '7d' });
}

export function verifyAuthToken(token: string) {
  try {
    return jwt.verify(token, getJwtSecret()) as AdminTokenPayload;
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

export function getSessionFromCookieStore() {
  const token = cookies().get(ADMIN_AUTH_COOKIE)?.value;
  return token ? verifyAuthToken(token) : null;
}

export function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;
  return token ? verifyAuthToken(token) : null;
}

export function requireAdminSession() {
  const session = getSessionFromCookieStore();
  if (!session) redirect('/login');
  return session;
}