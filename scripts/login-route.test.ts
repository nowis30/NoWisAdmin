import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import ts from 'typescript';
import { NextResponse } from 'next/server';
import { safeAdminRedirectPath } from '../lib/admin-redirect';

function loginRoute(authenticated = true) {
  const cookies: string[] = [];
  const compiled = ts.transpileModule(readFileSync(new URL('../app/api/auth/login/route.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2023 },
  }).outputText;
  const dependencies: Record<string, unknown> = {
    'next/headers': { cookies: async () => ({ set: (name: string) => cookies.push(name) }) },
    'next/server': { NextResponse },
    '@/lib/admin-redirect': { safeAdminRedirectPath },
    '@/lib/admin-config': { requireAdminJwtSecret: () => 'unit-test-only' },
    '@/lib/auth': {
      ADMIN_AUTH_COOKIE: 'test-session', signAuthToken: () => 'test-token',
      authenticateAdmin: async () => authenticated ? { id: 'admin', email: 'admin@example.test', name: 'Admin' } : null,
    },
  };
  const exports: { POST?: (request: Request) => Promise<Response> } = {};
  new Function('require', 'exports', 'process', compiled)((name: string) => {
    assert.ok(name in dependencies); return dependencies[name];
  }, exports, { env: { NOWIS_ADMIN_DATABASE_URL: 'postgresql://unused', NODE_ENV: 'test' } });
  return { post: exports.POST!, cookies };
}
function request(next: string) {
  return new Request('https://admin.example.test/api/auth/login', {
    method: 'POST', body: new URLSearchParams({ email: 'admin@example.test', password: 'test-only', next }),
  });
}
test('login uses 303 and never forwards credentials to a normalized external destination', async () => {
  for (const target of ['/\\external.example', '//external.example', '/%5cexternal.example', '/\n/external.example']) {
    const route = loginRoute(); const response = await route.post(request(target));
    assert.equal(response.status, 303); assert.equal(response.headers.get('location'), 'https://admin.example.test/dashboard');
    assert.deepEqual(route.cookies, ['test-session']);
  }
});
test('valid and failed logins both redirect with GET semantics', async () => {
  assert.equal((await loginRoute().post(request('/content?doc=home'))).headers.get('location'), 'https://admin.example.test/content?doc=home');
  const route = loginRoute(false); const response = await route.post(request('/dashboard'));
  assert.equal(response.status, 303); assert.equal(response.headers.get('location'), 'https://admin.example.test/login?error=1');
  assert.deepEqual(route.cookies, []);
});
