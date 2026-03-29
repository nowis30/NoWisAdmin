import Link from 'next/link';

import { StatCard } from '@/components/stat-card';
import { getDashboardData } from '@/lib/admin-data';

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Pages" value={data.pagesCount} helper="Socle de pages prêtes a alimenter le site public." />
        <StatCard label="Sections" value={data.sectionsCount} helper="Sections activables ou desactivables individuellement." />
        <StatCard label="Media" value={data.mediaCount} helper="Bibliotheque locale simple pour les visuels du site." />
        <StatCard label="Blocs" value={data.contentBlocksCount} helper="Textes, liens et contenus fins par section." />
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="panel p-6">
          <h3 className="text-xl font-semibold text-ink">Sections gerables</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {[
              ['/content', 'Gestion du contenu', 'Mettre a jour les titres, descriptions, CTA et blocs de texte.'],
              ['/media', 'Bibliotheque media', 'Televerser des images puis les associer aux sections.'],
              ['/appearance', 'Theme et reglages site', 'Centraliser les couleurs et les textes globaux.'],
              ['/preview', 'Apercu et publication', 'Creer un snapshot publiable du contenu courant.'],
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
            Cette application prepare les donnees qui pourront ensuite etre lues par `site-nowis-web` via API, package partage ou lecture directe de la meme base.
          </p>
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-ink">Dernier snapshot publie</p>
            <p className="mt-2 text-sm text-slate-600">
              {data.lastPublish ? data.lastPublish.createdAt.toLocaleString('fr-CA') : 'Aucune publication enregistree pour le moment.'}
            </p>
          </div>
          <Link href="/preview" className="button-primary mt-5">Ouvrir la publication</Link>
        </div>
      </section>
    </div>
  );
}