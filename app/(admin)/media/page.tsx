import Image from 'next/image';
import Link from 'next/link';

import { getMediaLibrary } from '@/lib/admin-data';

export default async function MediaPage({
  searchParams,
}: {
  searchParams?: { uploaded?: string; replaced?: string; error?: string };
}) {
  const media = await getMediaLibrary();
  const isProd = process.env.NODE_ENV === 'production';
  const storageMode = process.env.BLOB_READ_WRITE_TOKEN ? 'Vercel Blob' : 'Local';

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Medias</h3>
        <p className="mt-2 text-sm text-slate-600">Ajoute, remplace et choisis des images pour les sections du site.</p>
        <p className="mt-2 text-xs text-slate-500">Stockage actif: {storageMode}{isProd && !process.env.BLOB_READ_WRITE_TOKEN ? ' (invalide en production sans token)' : ''}</p>

        <form action="/api/media/upload" method="post" encType="multipart/form-data" className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_1fr_auto] lg:items-end">
          <div>
            <label htmlFor="file">Nouvelle image</label>
            <input id="file" name="file" type="file" accept="image/*" required />
            <p className="mt-1 text-xs text-slate-500">Televerse une image depuis ton ordinateur.</p>
          </div>
          <div>
            <label htmlFor="altText">Description de l image</label>
            <input id="altText" name="altText" placeholder="Exemple: artiste sur scene" />
            <p className="mt-1 text-xs text-slate-500">Description utile pour l accessibilite.</p>
          </div>
          <button type="submit" className="button-primary">Ajouter l image</button>
        </form>

        {searchParams?.uploaded === '1' ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Image ajoutee.</div>
        ) : null}
        {searchParams?.replaced === '1' ? (
          <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">Image remplacee.</div>
        ) : null}
        {searchParams?.error === 'storage' ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Upload indisponible: configure BLOB_READ_WRITE_TOKEN sur Vercel, puis redeploie NoWisAdmin.
          </div>
        ) : null}
        {searchParams?.error && searchParams?.error !== 'storage' ? (
          <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            Action impossible. Verifie le fichier puis reessaie. En production, configure aussi BLOB_READ_WRITE_TOKEN sur Vercel.
          </div>
        ) : null}
      </section>

      <section className="panel p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-ink">Bibliotheque d images</h3>
            <p className="mt-2 text-sm text-slate-600">Chaque carte indique ou l image est utilisee.</p>
          </div>
          <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">{media.length} image(s)</div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {media.map((asset) => (
            <article key={asset.id} className="overflow-hidden rounded-[28px] border border-slate-200 bg-slate-50">
              <div className="relative aspect-[4/3] bg-white">
                <Image src={asset.url} alt={asset.altText ?? asset.originalName} fill className="object-cover" unoptimized />
              </div>

              <div className="space-y-3 p-4">
                <p className="truncate text-sm font-semibold text-ink">{asset.originalName}</p>
                <p className="text-xs text-slate-500">{asset.altText || 'Pas de description'}</p>
                <p className="truncate text-[11px] text-slate-500">URL: {asset.url}</p>
                {isProd && asset.url.startsWith('/uploads/') ? (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Cette image pointe vers un ancien chemin local (/uploads) et peut retourner 404 en production. Remplace-la pour la migrer vers Blob.
                  </div>
                ) : null}

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-600">Utilisee dans</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {asset.sections.length > 0
                      ? asset.sections.map((section) => `${section.page.title} -> ${section.name}`).join(', ')
                      : 'Aucune section pour le moment'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link href={`/content?mediaId=${asset.id}`} className="button-secondary px-4 py-2 text-xs">
                    Choisir pour une section
                  </Link>
                  <a href={asset.url} target="_blank" rel="noreferrer" className="button-secondary px-4 py-2 text-xs">
                    Ouvrir le fichier
                  </a>
                </div>

                <form action="/api/media/replace" method="post" encType="multipart/form-data" className="space-y-2 rounded-2xl border border-slate-200 bg-white p-3">
                  <input type="hidden" name="assetId" value={asset.id} />
                  <label htmlFor={`replace-${asset.id}`} className="mb-1 text-xs">Remplacer cette image</label>
                  <input id={`replace-${asset.id}`} name="file" type="file" accept="image/*" required className="px-3 py-2 text-xs" />
                  <input name="altText" defaultValue={asset.altText ?? ''} placeholder="Description" className="px-3 py-2 text-xs" />
                  <button type="submit" className="button-primary w-full px-4 py-2 text-xs">Remplacer</button>
                </form>
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
