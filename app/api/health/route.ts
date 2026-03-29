import { NextResponse } from 'next/server';

/**
 * Health check endpoint for diagnostics.
 * Returns configuration status without exposing sensitive values.
 */
export async function GET() {
  const checks = {
    env_vars: {
      NOWIS_ADMIN_DATABASE_URL: process.env.NOWIS_ADMIN_DATABASE_URL ? 'configured' : 'MISSING',
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? 'configured' : 'MISSING',
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? 'configured' : 'MISSING',
      ADMIN_NAME: process.env.ADMIN_NAME ? 'configured' : 'MISSING',
      ADMIN_JWT_SECRET: process.env.ADMIN_JWT_SECRET ? 'configured' : 'MISSING',
    },
    database_url_valid:
      process.env.NOWIS_ADMIN_DATABASE_URL?.startsWith('postgresql://') ||
      process.env.NOWIS_ADMIN_DATABASE_URL?.startsWith('postgres://')
        ? 'valid'
        : 'invalid_or_missing',
    node_env: process.env.NODE_ENV,
  };

  return NextResponse.json(checks, { status: 200 });
}
