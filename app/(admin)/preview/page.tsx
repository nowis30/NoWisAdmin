import { PublishBar } from '@/components/publish-bar';
import { buildPublishPayload } from '@/lib/admin-data';

export default async function PreviewPage() {
  const payload = await buildPublishPayload();

  return (
    <div className="space-y-6">
      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Previsualisation</h3>
        <p className="mt-2 text-sm text-slate-600">Ce rendu montre ce que les visiteurs verront avec les contenus actuellement enregistres.</p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="panel p-6">
          <h4 className="text-lg font-semibold text-ink">Rendu des sections</h4>
          <div className="mt-5 space-y-5">
            {payload.pages.map((page) => (
              <article key={page.slug} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{page.title}</p>
                <div className="mt-3 space-y-3">
                  {page.sections.map((section) => (
                    <div key={section.key} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-ink">{section.title || section.key}</p>
                        <span className={`rounded-full px-3 py-1 text-xs ${section.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                          {section.isActive ? 'Visible' : 'Masquee'}
                        </span>
                      </div>
                      {section.subtitle ? <p className="mt-2 text-sm text-slate-600">{section.subtitle}</p> : null}
                      {section.description ? <p className="mt-1 text-xs text-slate-500">{section.description}</p> : null}
                      {section.ctaLabel ? <p className="mt-2 text-xs font-medium text-pine">Bouton: {section.ctaLabel}</p> : null}
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <section className="panel p-6">
            <h4 className="text-lg font-semibold text-ink">Theme applique</h4>
            <p className="mt-2 text-sm text-slate-600">Voici les couleurs actuellement visibles sur le site.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                ['Couleur principale', payload.themeSettings.primaryColor],
                ['Couleur accent', payload.themeSettings.accentColor],
                ['Fond principal', payload.themeSettings.surfaceColor],
                ['Texte principal', payload.themeSettings.textColor],
                ['Texte secondaire', payload.themeSettings.mutedColor],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                  <div className="h-10 rounded-xl border border-slate-200" style={{ backgroundColor: value as string }} />
                  <p className="mt-2 text-xs font-semibold text-ink">{label}</p>
                  <p className="text-xs text-slate-500">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="panel p-6">
            <h4 className="text-lg font-semibold text-ink">Etape suivante</h4>
            <p className="mt-2 text-sm text-slate-600">
              Si ce rendu te convient, passe a l ecran Publication pour enregistrer cette version.
            </p>
          </section>
        </div>
      </section>

      <PublishBar />
    </div>
  );
}
