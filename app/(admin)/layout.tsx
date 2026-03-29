import { AdminShell } from '@/components/admin-shell';
import { requireAdminSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = requireAdminSession();

  return (
    <AdminShell
      title="Studio de pages"
      description="Ouvre tes pages comme des documents, modifie section par section, verifie en apercu puis publie en gardant un flux brouillon fiable."
      adminName={session.name}
    >
      {children}
    </AdminShell>
  );
}