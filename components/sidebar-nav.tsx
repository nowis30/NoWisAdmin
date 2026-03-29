"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brush, ImageIcon, LayoutDashboard, NotebookPen, Rocket, Send } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Atelier', icon: LayoutDashboard },
  { href: '/content', label: 'Pages', icon: NotebookPen },
  { href: '/media', label: 'Photos', icon: ImageIcon },
  { href: '/appearance', label: 'Couleurs et style', icon: Brush },
  { href: '/preview', label: 'Voir le resultat', icon: Rocket },
  { href: '/publish', label: 'Publication', icon: Send },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="space-y-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
            pathname === href ? 'bg-pine text-white shadow-sm' : 'text-slate-700 hover:bg-slate-100 hover:text-pine'
          }`}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}