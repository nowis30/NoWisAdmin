"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brush, FolderGit2, FolderOpen, ImageIcon, LayoutDashboard, NotebookPen, Rocket, Send } from 'lucide-react';

const workspaceLinks = [
  { href: '/dashboard', label: 'Accueil studio', icon: LayoutDashboard },
  { href: '/content', label: 'Pages', icon: NotebookPen },
  { href: '/media', label: 'Medias', icon: ImageIcon },
  { href: '/appearance', label: 'Parametres visuels', icon: Brush },
  { href: '/preview', label: 'Apercu global', icon: Rocket },
  { href: '/publish', label: 'Versions publiees', icon: Send },
];

const pageDocuments = [
  { href: '/content?doc=accueil', label: 'Accueil' },
  { href: '/content?doc=musique', label: 'Musique' },
  { href: '/content?doc=videos', label: 'Videos' },
  { href: '/content?doc=contact', label: 'Contact' },
  { href: '/content?doc=commander', label: 'Commander une chanson' },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-5">
      <section>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Workspace</p>
        <div className="space-y-1.5">
          {workspaceLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition ${
                pathname === href
                  ? 'bg-gradient-to-r from-pine to-[#173c3a] text-white shadow-[0_10px_18px_rgba(31,77,75,0.24)]'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-pine'
              }`}
            >
              <Icon className={`h-4 w-4 transition ${pathname === href ? '' : 'text-slate-500 group-hover:text-pine'}`} />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50/85 p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Pages</p>
          <FolderOpen className="h-3.5 w-3.5 text-slate-400" />
        </div>
        <div className="mt-2 space-y-1.5">
          {pageDocuments.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-slate-700 transition hover:bg-white hover:text-pine"
            >
              <FolderGit2 className="h-3.5 w-3.5 text-slate-400" />
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-3">
        <p className="text-xs font-semibold text-emerald-800">Mode securise actif</p>
        <p className="mt-1 text-[11px] leading-5 text-emerald-700">
          Les actions sensibles demandent une confirmation et la publication reste separee du brouillon.
        </p>
      </section>
    </nav>
  );
}