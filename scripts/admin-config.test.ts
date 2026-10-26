import assert from 'node:assert/strict';
import { test } from 'node:test';
import { requireAdminJwtSecret, requireAdminSeedCredentials, assertDemoSeedAllowed } from '../lib/admin-config.ts';
import { safeAdminRedirectPath } from '../lib/admin-redirect.ts';

test('administrator authentication refuses missing, short and documented placeholder secrets', () => {
  for (const value of [undefined, '', 'short', 'change-this-secret-before-production', 'replace-with-a-long-random-secret']) {
    assert.throws(() => requireAdminJwtSecret({ ADMIN_JWT_SECRET: value }));
  }
  assert.equal(requireAdminJwtSecret({ ADMIN_JWT_SECRET: 'a'.repeat(48) }), 'a'.repeat(48));
});

test('seed requires explicit credentials and never accepts the previous defaults', () => {
  assert.throws(() => requireAdminSeedCredentials({}));
  for (const password of ['ChangeMeNowis123!', 'ChangeMeNowisAdmin123!', 'ChangeMe_StrongPassword_123!', 'é'.repeat(37)]) {
    assert.throws(() => requireAdminSeedCredentials({ ADMIN_EMAIL: 'admin@example.com', ADMIN_PASSWORD: password }));
  }
  assert.deepEqual(requireAdminSeedCredentials({ ADMIN_EMAIL: ' ADMIN@EXAMPLE.COM ', ADMIN_PASSWORD: 'a-unique-test-password-2026' }), {
    email: 'admin@example.com', password: 'a-unique-test-password-2026', name: 'NoWis Admin',
  });
});

test('destructive demo seeding needs explicit local opt-in and stays forbidden in production', () => {
  assert.throws(() => assertDemoSeedAllowed({}));
  for (const env of [{ NODE_ENV: 'production' }, { VERCEL: '1' }, { VERCEL: 'true' }]) {
    assert.throws(() => assertDemoSeedAllowed({ ...env, ALLOW_DESTRUCTIVE_DEMO_SEED: 'true' }));
  }
  assert.doesNotThrow(() => assertDemoSeedAllowed({ NODE_ENV: 'development', ALLOW_DESTRUCTIVE_DEMO_SEED: 'true' }));
});

test('login redirects reject URL normalization tricks and only preserve local paths', () => {
  for (const value of ['', 'https://external.example', '//external.example', '/\\external.example', '/\n/external.example', '/%5cexternal.example', '/%2fexternal.example', '/%00example', '/%']) {
    assert.equal(safeAdminRedirectPath(value), '/dashboard', value);
  }
  assert.equal(safeAdminRedirectPath('/content?doc=home#title'), '/content?doc=home#title');
});
