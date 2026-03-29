import { LogOut } from 'lucide-react';

import { SidebarNav } from '@/components/sidebar-nav';

export function AdminShell({ title, description, adminName, children }: { title: string; description: string; adminName: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-admin-grid">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-6">
        <aside className="panel flex flex-col gap-6 p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pine/70">NoWisAdmin</p>
            <h1 className="mt-2 font-display text-3xl text-ink">Gestion privee</h1>
            <p className="mt-2 text-sm text-slate-600">Pilote le contenu, les visuels et l apparence du site public depuis une interface separee.</p>
          </div>

          <SidebarNav />

          <form action="/api/auth/logout" method="post" className="mt-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">{adminName}</p>
              <p className="mt-1 text-xs text-slate-500">Session admin privee</p>
              <button type="submit" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-[#b2562c]">
                <LogOut className="h-4 w-4" />
                Se deconnecter
              </button>
            </div>
          </form>
        </aside>

        <main className="space-y-6">
          <header className="panel p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine/70">Administration</p>
            <h2 className="mt-2 font-display text-4xl text-ink">{title}</h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}