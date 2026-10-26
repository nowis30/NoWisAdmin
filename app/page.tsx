import { redirect } from 'next/navigation';

import { getSessionFromCookieStore } from '@/lib/auth';

export default async function HomePage() {
  const session = await getSessionFromCookieStore();
  redirect(session ? '/dashboard' : '/login');
}
