import Link from 'next/link';
import { LayoutDashboard, FileText, ImageIcon, Palette, PanelsTopLeft, Rocket } from 'lucide-react';

const links = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/content', label: 'Contenu', icon: FileText },
  { href: '/media', label: 'Media', icon: ImageIcon },
  { href: '/appearance', label: 'Apparence', icon: Palette },
  { href: '/sections', label: 'Sections', icon: PanelsTopLeft },
  { href: '/preview', label: 'Apercu & publication', icon: Rocket },
];

export function SidebarNav() {
  return (
    <nav className="space-y-2">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-pine"
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  );
}