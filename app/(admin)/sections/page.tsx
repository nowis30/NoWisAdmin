import { updateSectionSettingsAction } from '@/lib/actions';
import { getSectionsManagementData } from '@/lib/admin-data';

export default async function SectionsPage() {
  const { pages, mediaAssets } = await getSectionsManagementData();

  return (
    <div className="space-y-6">
      {pages.map((page) => (
        <section key={page.id} className="panel p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pine/70">Page {page.slug}</p>
          <h3 className="mt-2 text-2xl font-semibold text-ink">{page.title}</h3>

          <div className="mt-6 space-y-4">
            {page.sections.map((section) => (
              <form key={section.id} action={updateSectionSettingsAction} className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <input type="hidden" name="sectionId" value={section.id} />

                <div className="grid gap-4 lg:grid-cols-[1fr_130px_220px_auto] lg:items-end">
                  <div>
                    <p className="text-sm font-semibold text-ink">{section.name}</p>
                    <p className="mt-1 text-xs text-slate-500">{section.key}</p>
                  </div>
                  <div>
                    <label htmlFor={`${section.id}-sortOrder`}>Ordre</label>
                    <input id={`${section.id}-sortOrder`} name="sortOrder" type="number" defaultValue={section.sortOrder} />
                  </div>
                  <div>
                    <label htmlFor={`${section.id}-imageId`}>Image associee</label>
                    <select id={`${section.id}-imageId`} name="imageId" defaultValue={section.imageId ?? ''}>
                      <option value="">Aucune image</option>
                      {mediaAssets.map((asset) => (
                        <option key={asset.id} value={asset.id}>{asset.originalName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex gap-3 lg:justify-end">
                    <label className="mb-0 flex items-center gap-3 rounded-full border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                      <input type="checkbox" name="isActive" defaultChecked={section.isActive} className="h-4 w-4 rounded border-slate-300" />
                      Active
                    </label>
                    <button type="submit" className="button-primary">Enregistrer</button>
                  </div>
                </div>
              </form>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}