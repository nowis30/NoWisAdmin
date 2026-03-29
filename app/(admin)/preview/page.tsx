import { publishSnapshotAction } from '@/lib/actions';
import { buildPublishPayload } from '@/lib/admin-data';
import { prisma } from '@/lib/prisma';

export default async function PreviewPage() {
  const [payload, snapshots] = await Promise.all([
    buildPublishPayload(),
    prisma.publishSnapshot.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
  ]);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
      <section className="space-y-6">
        <form action={publishSnapshotAction} className="panel p-6">
          <h3 className="text-xl font-semibold text-ink">Publier un snapshot</h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">Pour l instant, la publication enregistre un snapshot JSON versionne. C est la base la plus propre pour brancher ensuite `site-nowis-web` sur une source partagee.</p>
          <div className="mt-5">
            <label htmlFor="notes">Notes de publication</label>
            <textarea id="notes" name="notes" placeholder="Ex: Hero mis a jour, palette simplifiee, services reordonnes." />
          </div>
          <button type="submit" className="button-primary mt-5">Creer un snapshot</button>
        </form>

        <section className="panel p-6">
          <h3 className="text-xl font-semibold text-ink">Historique recent</h3>
          <div className="mt-5 space-y-3">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-ink">{snapshot.createdAt.toLocaleString('fr-CA')}</p>
                <p className="mt-2 text-sm text-slate-600">{snapshot.notes || 'Aucune note de publication.'}</p>
              </div>
            ))}
            {snapshots.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">Aucun snapshot publie pour le moment.</div>
            ) : null}
          </div>
        </section>
      </section>

      <section className="panel overflow-hidden p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-ink">Payload d integration</h3>
            <p className="mt-2 text-sm text-slate-600">Contrat cible pour une future lecture par `site-nowis-web`.</p>
          </div>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-[28px] bg-slate-950 p-5 text-xs leading-6 text-slate-100">{JSON.stringify(payload, null, 2)}</pre>
      </section>
    </div>
  );
}