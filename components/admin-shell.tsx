import { LogOut, ShieldCheck } from 'lucide-react';

import { SidebarNav } from '@/components/sidebar-nav';

export function AdminShell({ title, description, adminName, children }: { title: string; description: string; adminName: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-admin-grid">
      <div className="mx-auto grid min-h-screen max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[292px_minmax(0,1fr)] lg:px-6">
        <aside className="panel flex flex-col gap-6 p-5 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-pine/70">NoWis Studio</p>
            <h1 className="mt-2 font-display text-3xl text-ink">Page Studio</h1>
            <p className="mt-2 text-sm text-slate-600">Un atelier de pages documentaires, visuel, stable et rassurant.</p>
          </div>

          <SidebarNav />

          <form action="/api/auth/logout" method="post" className="mt-auto">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-ink">{adminName}</p>
                  <p className="mt-1 text-xs text-slate-500">Session securisee</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-emerald-700">
                  <ShieldCheck className="h-3 w-3" />
                  Protegee
                </span>
              </div>
              <button type="submit" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-ember hover:text-[#b2562c]">
                <LogOut className="h-4 w-4" />
                Se deconnecter
              </button>
            </div>
          </form>
        </aside>

        <main className="space-y-5">
          <header className="panel overflow-hidden p-0">
            <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-pine/70">Mode studio</p>
                  <h2 className="mt-2 font-display text-4xl text-ink">{title}</h2>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Brouillon separe</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Apercu direct</span>
                  <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700">Publication controlee</span>
                </div>
              </div>
            </div>
            <div className="px-6 py-4">
              <p className="max-w-4xl text-sm leading-6 text-slate-600">{description}</p>
            </div>
          </header>

          {children}
        </main>
      </div>
    </div>
  );
}