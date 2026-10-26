/** Return a same-origin path; URL normalization must never turn a login target into another host. */
export function safeAdminRedirectPath(value: string): string {
  const fallback = '/dashboard';
  if (!value.startsWith('/') || value.length > 2048) return fallback;
  try {
    const decoded = decodeURIComponent(value);
    if (decoded.startsWith('//') || /[\\\u0000-\u001f\u007f]/.test(decoded)) return fallback;
    const base = new URL('https://admin.invalid');
    const target = new URL(value, base);
    return target.origin === base.origin ? `${target.pathname}${target.search}${target.hash}` : fallback;
  } catch {
    return fallback;
  }
}
