import { ProductionPreview } from '@/components/preview/production-preview';
import { buildPublishPayload } from '@/lib/admin-data';

export default async function PreviewPage() {
  const payload = await buildPublishPayload();

  return (
    <div className="space-y-6">
      <section className="panel p-6">
      <h3 className="text-xl font-semibold text-ink">Apercu proche production</h3>
      <p className="mt-2 text-sm text-slate-600">Utilise cet ecran pour valider le rendu final des pages sans bruit d editeur avant publication.</p>
      </section>

      <ProductionPreview payload={payload} />
    </div>
  );
}
