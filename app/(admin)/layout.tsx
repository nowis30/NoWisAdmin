import { AdminShell } from '@/components/admin-shell';
import { requireAdminSession } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = requireAdminSession();

  return (
    <AdminShell
      title="Espace d administration"
      description="Base claire pour administrer les contenus, medias et reglages qui devront ensuite alimenter site-nowis-web."
      adminName={session.name}
    >
      {children}
    </AdminShell>
  );
}