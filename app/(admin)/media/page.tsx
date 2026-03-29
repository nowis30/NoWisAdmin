import Image from 'next/image';

import { getMediaLibrary } from '@/lib/admin-data';

export default async function MediaPage({ searchParams }: { searchParams?: { uploaded?: string; error?: string } }) {
  const media = await getMediaLibrary();

  return (
    <div className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Televerser une image</h3>
        <p className="mt-2 text-sm text-slate-600">Stockage local minimal pour demarrer. Tu pourras remplacer ensuite cette couche par S3, Cloudinary ou un stockage partage.</p>

        <form action="/api/media/upload" method="post" encType="multipart/form-data" className="mt-5 space-y-4">
          <div>
            <label htmlFor="file">Fichier</label>
            <input id="file" name="file" type="file" accept="image/*" required />
          </div>
          <div>
            <label htmlFor="altText">Texte alternatif</label>
            <input id="altText" name="altText" placeholder="Description courte de l image" />
          </div>
          <button type="submit" className="button-primary w-full">Televerser</button>
        </form>

        {searchParams?.uploaded === '1' ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Image ajoutee a la bibliotheque.</div>
        ) : null}
        {searchParams?.error === 'upload' ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">Le televersement a echoue.</div>
        ) : null}
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-ink">Bibliotheque media</h3>
            <p className="mt-2 text-sm text-slate-600">Les images ici pourront etre associees aux sections depuis l onglet Sections.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">{media.length} element(s)</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/3] bg-white">
                <Image src={asset.url} alt={asset.altText ?? asset.originalName} fill className="object-cover" />
              </div>
              <div className="p-4">
                <p className="truncate text-sm font-semibold text-ink">{asset.originalName}</p>
                <p className="mt-1 text-xs text-slate-500">{asset.mimeType} • {Math.round(asset.fileSize / 1024)} KB</p>
                <p className="mt-3 text-xs leading-5 text-slate-600">{asset.altText || 'Aucun texte alternatif renseigne.'}</p>
                <p className="mt-3 break-all text-xs text-slate-500">{asset.url}</p>
              </div>
            </article>
          ))}
          {media.length === 0 ? (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-white p-8 text-sm text-slate-500">Aucune image pour le moment.</div>
          ) : null}
        </div>
      </section>
    </div>
  );
}