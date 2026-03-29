import { prisma } from '@/lib/prisma';

export default async function PublishPage({ searchParams }: { searchParams?: { published?: string } }) {
  const snapshots = await prisma.publishSnapshot.findMany({ take: 8, orderBy: { createdAt: 'desc' } });

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Publication</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Quand tout est correct dans la previsualisation, cree une nouvelle publication.
        </p>

        <form action="/api/admin/publish" method="post" className="mt-5 space-y-4">
          <div>
            <label htmlFor="notes">Resume de la mise a jour</label>
            <textarea id="notes" name="notes" placeholder="Exemple: Photo de la banniere changee, bouton principal mis a jour." />
            <p className="mt-2 text-xs text-slate-500">Cette note aide a retrouver rapidement ce qui a ete modifie.</p>
          </div>

          <button type="submit" className="button-primary">Publier maintenant</button>
        </form>

        {searchParams?.published === '1' ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Publication enregistree avec succes.
          </div>
        ) : null}
      </section>

      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Historique des publications</h3>
        <p className="mt-2 text-sm text-slate-600">Retrouve les dernieres versions publiees.</p>

        <div className="mt-5 space-y-3">
          {snapshots.map((snapshot) => (
            <article key={snapshot.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-ink">{snapshot.createdAt.toLocaleString('fr-CA')}</p>
              <p className="mt-2 text-sm text-slate-600">{snapshot.notes || 'Aucune note.'}</p>
            </article>
          ))}

          {snapshots.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
              Aucune publication pour le moment.
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}