import Link from 'next/link';

import { StatCard } from '@/components/stat-card';
import { getDashboardData } from '@/lib/admin-data';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pages" value={data.pagesCount} helper="Les pieces que tu peux decorer." />
        <StatCard label="Zones" value={data.sectionsCount} helper="Les parties de page a retoucher." />
        <StatCard label="Photos" value={data.mediaCount} helper="Images disponibles dans ta bibliotheque." />
        <StatCard label="Textes" value={data.contentBlocksCount} helper="Textes que tu peux ajuster facilement." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <h3 className="text-xl font-semibold text-ink">Par ou commencer</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['/content', 'Choisir une piece', 'Ouvre une page puis clique sur la zone que tu veux modifier.'],
              ['/media', 'Poser une photo', 'Ajoute une image et place-la dans une zone de la page.'],
              ['/appearance', 'Changer les couleurs', 'Teste des couleurs et vois le rendu tout de suite.'],
              ['/preview', 'Voir le resultat', 'Regarde le rendu complet avant la publication.'],
            ].map(([href, title, copy]) => (
              <Link key={href} href={href} className="rounded-3xl border border-slate-200 bg-slate-50 p-5 hover:border-pine/40 hover:bg-white">
                <p className="font-semibold text-ink">{title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel p-6">
          <h3 className="text-xl font-semibold text-ink">Publication</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Quand le rendu te plait, publie cette version.
          </p>
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-ink">Dernier snapshot publie</p>
            <p className="mt-2 text-sm text-slate-600">
              {data.lastPublish ? data.lastPublish.createdAt.toLocaleString('fr-CA') : 'Aucune publication enregistree pour le moment.'}
            </p>
          </div>
          <Link href="/publish" className="button-primary mt-5">Ouvrir la publication</Link>
        </div>
      </section>
    </div>
  );
}