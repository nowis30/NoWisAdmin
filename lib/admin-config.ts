type AdminEnvironment = Record<string, string | undefined>;

const placeholderSecrets = new Set([
  'change-this-secret-before-production',
  'replace-with-a-long-random-secret',
]);
const placeholderPasswords = new Set([
  'ChangeMeNowis123!',
  'ChangeMeNowisAdmin123!',
  'ChangeMe_StrongPassword_123!',
]);

/** Configuration errors must never silently grant an administrator session. */
export function requireAdminJwtSecret(env: AdminEnvironment = process.env): string {
  const secret = env.ADMIN_JWT_SECRET?.trim();
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32 || placeholderSecrets.has(secret)) {
    throw new Error('ADMIN_JWT_SECRET must contain a unique random secret of at least 32 bytes.');
  }
  return secret;
}

export function requireAdminSeedCredentials(env: AdminEnvironment = process.env) {
  const email = env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = env.ADMIN_PASSWORD;
  if (!email || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('Set a valid ADMIN_EMAIL before initializing the administrator.');
  }
  if (!password || password.length < 16 || Buffer.byteLength(password, 'utf8') > 72 || placeholderPasswords.has(password)) {
    throw new Error('Set a unique ADMIN_PASSWORD of at least 16 characters and at most 72 UTF-8 bytes.');
  }
  return { email, password, name: env.ADMIN_NAME?.trim() || 'NoWis Admin' };
}

/** The CLI seed replaces demo content; it must never run on a production deployment. */
export function assertDemoSeedAllowed(env: AdminEnvironment = process.env): void {
  if (env.NODE_ENV === 'production' || ['1', 'true'].includes(env.VERCEL ?? '')) {
    throw new Error('The destructive demo seed is disabled in production.');
  }
  if (env.ALLOW_DESTRUCTIVE_DEMO_SEED !== 'true') {
    throw new Error('Use a disposable local database and set ALLOW_DESTRUCTIVE_DEMO_SEED=true to replace demo content.');
  }
}
