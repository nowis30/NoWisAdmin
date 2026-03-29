import { getContentSections } from '@/lib/admin-data';

export default async function ContentPage() {
  const pages = await getContentSections();

  return (
    <div className="space-y-6">
      {pages.map((page) => (
        <section key={page.id} className="panel p-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-pine/70">Page {page.slug}</p>
              <h3 className="mt-2 text-2xl font-semibold text-ink">{page.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{page.description}</p>
            </div>
          </div>

          <div className="space-y-5">
            {page.sections.map((section) => (
              <form key={section.id} action="/api/admin/section-content" method="post" className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <input type="hidden" name="sectionId" value={section.id} />
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{section.key}</p>
                    <h4 className="mt-1 text-lg font-semibold text-ink">{section.name}</h4>
                  </div>
                  <button type="submit" className="button-primary">Enregistrer</button>
                </div>

                <div className="mt-5 grid gap-4 lg:grid-cols-2">
                  <div>
                    <label htmlFor={`${section.id}-title`}>Titre</label>
                    <input id={`${section.id}-title`} name="title" defaultValue={section.title} required />
                  </div>
                  <div>
                    <label htmlFor={`${section.id}-subtitle`}>Sous-titre</label>
                    <input id={`${section.id}-subtitle`} name="subtitle" defaultValue={section.subtitle ?? ''} />
                  </div>
                  <div className="lg:col-span-2">
                    <label htmlFor={`${section.id}-description`}>Description</label>
                    <textarea id={`${section.id}-description`} name="description" defaultValue={section.description ?? ''} />
                  </div>
                  <div>
                    <label htmlFor={`${section.id}-ctaLabel`}>Bouton</label>
                    <input id={`${section.id}-ctaLabel`} name="ctaLabel" defaultValue={section.ctaLabel ?? ''} />
                  </div>
                  <div>
                    <label htmlFor={`${section.id}-ctaHref`}>Lien du bouton</label>
                    <input id={`${section.id}-ctaHref`} name="ctaHref" defaultValue={section.ctaHref ?? ''} />
                  </div>
                </div>

                {section.blocks.length > 0 ? (
                  <div className="mt-5 grid gap-4 lg:grid-cols-2">
                    {section.blocks.map((block) => (
                      <div key={block.id}>
                        <label htmlFor={block.id}>{block.label}</label>
                        {block.kind === 'RICH_TEXT' ? (
                          <textarea id={block.id} name={`block:${block.id}`} defaultValue={block.value} />
                        ) : (
                          <input id={block.id} name={`block:${block.id}`} defaultValue={block.value} />
                        )}
                      </div>
                    ))}
                  </div>
                ) : null}
              </form>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}