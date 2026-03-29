import { redirect } from 'next/navigation';

import { getSessionFromCookieStore } from '@/lib/auth';

export default function HomePage() {
  const session = getSessionFromCookieStore();
  redirect(session ? '/dashboard' : '/login');
}