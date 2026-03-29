import { AdminShell } from '@/components/admin-shell';
import { requireAdminSession } from '@/lib/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = requireAdminSession();

  return (
    <AdminShell
      title="Atelier visuel du site"
      description="Choisis une piece, pose une photo, change les couleurs et vois le resultat tout de suite."
      adminName={session.name}
    >
      {children}
    </AdminShell>
  );
}