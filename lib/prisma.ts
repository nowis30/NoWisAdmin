import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var __nowisAdminPrisma__: PrismaClient | undefined;
}

export const prisma = global.__nowisAdminPrisma__ ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global.__nowisAdminPrisma__ = prisma;
}