import Link from 'next/link';

export function PublishBar() {
  return (
    <div className="rounded-3xl border border-pine/25 bg-pine/5 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-ink">Pret a publier ?</p>
          <p className="text-xs text-slate-600">Verifie la previsualisation puis publie une nouvelle version.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/preview" className="button-secondary px-4 py-2 text-xs">Voir la previsualisation</Link>
          <Link href="/publish" className="button-primary px-4 py-2 text-xs">Aller a la publication</Link>
        </div>
      </div>
    </div>
  );
}
