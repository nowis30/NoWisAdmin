import { prisma } from '@/lib/prisma';
import { buildPublishPayload } from '@/lib/admin-data';
import { evaluatePublishQuality } from '@/lib/publish-quality-gate';

export const dynamic = 'force-dynamic';

export default async function PublishPage({ searchParams }: { searchParams?: { published?: string; gate?: string; blocking?: string; warnings?: string; suggestions?: string } }) {
  let snapshots: Array<{ id: string; createdAt: Date; notes: string | null }> = [];
  let dbUnavailable = false;
  let quality = null as ReturnType<typeof evaluatePublishQuality> | null;

  try {
    snapshots = await prisma.publishSnapshot.findMany({ take: 8, orderBy: { createdAt: 'desc' } });
  } catch {
    dbUnavailable = true;
  }

  try {
    const payload = await buildPublishPayload();
    quality = evaluatePublishQuality(payload);
  } catch {
    quality = null;
  }

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

          <button type="submit" disabled={quality?.isBlocked} className="button-primary disabled:cursor-not-allowed disabled:opacity-50">Publier maintenant</button>
        </form>

        {quality ? (
          <div className="mt-4 space-y-3">
            {quality.blocking.length > 0 ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                <p className="font-semibold">Blocage ({quality.blocking.length})</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {quality.blocking.slice(0, 6).map((issue, index) => (
                    <li key={`blocking-${index}`}>- [{issue.pageSlug}] {issue.message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {quality.warnings.length > 0 ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <p className="font-semibold">Avertissement ({quality.warnings.length})</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {quality.warnings.slice(0, 4).map((issue, index) => (
                    <li key={`warning-${index}`}>- [{issue.pageSlug}] {issue.message}</li>
                  ))}
                </ul>
              </div>
            ) : null}

            {quality.suggestions.length > 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                <p className="font-semibold">Suggestion ({quality.suggestions.length})</p>
                <ul className="mt-2 space-y-1 text-xs">
                  {quality.suggestions.slice(0, 3).map((issue, index) => (
                    <li key={`suggestion-${index}`}>- [{issue.pageSlug}] {issue.message}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}

        {searchParams?.published === '1' ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Publication enregistree avec succes.
          </div>
        ) : null}
        {searchParams?.gate === 'blocked' ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Publication stoppee: corrige d abord les points bloquants.
          </div>
        ) : null}
        {dbUnavailable ? (
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Base de donnees indisponible pour le moment. Verifie NOWIS_ADMIN_DATABASE_URL.
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