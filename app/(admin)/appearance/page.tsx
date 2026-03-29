import { getAppearanceData } from '@/lib/admin-data';

export default async function AppearancePage() {
  const { siteSettings, themeSettings } = await getAppearanceData();

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <form action="/api/admin/site-settings" method="post" className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Reglages du site</h3>
        <p className="mt-2 text-sm text-slate-600">Base commune pour le site public: nom, SEO, CTA principal, URL source.</p>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="siteName">Nom du site</label>
            <input id="siteName" name="siteName" defaultValue={siteSettings?.siteName ?? ''} required />
          </div>
          <div>
            <label htmlFor="siteUrl">URL du site</label>
            <input id="siteUrl" name="siteUrl" defaultValue={siteSettings?.siteUrl ?? ''} required />
          </div>
          <div>
            <label htmlFor="defaultSeoTitle">Titre SEO par defaut</label>
            <input id="defaultSeoTitle" name="defaultSeoTitle" defaultValue={siteSettings?.defaultSeoTitle ?? ''} required />
          </div>
          <div>
            <label htmlFor="defaultSeoDescription">Description SEO par defaut</label>
            <textarea id="defaultSeoDescription" name="defaultSeoDescription" defaultValue={siteSettings?.defaultSeoDescription ?? ''} />
          </div>
          <div>
            <label htmlFor="defaultCtaLabel">Libelle CTA principal</label>
            <input id="defaultCtaLabel" name="defaultCtaLabel" defaultValue={siteSettings?.defaultCtaLabel ?? ''} required />
          </div>
          <div>
            <label htmlFor="defaultCtaHref">Lien CTA principal</label>
            <input id="defaultCtaHref" name="defaultCtaHref" defaultValue={siteSettings?.defaultCtaHref ?? ''} required />
          </div>
        </div>

        <button type="submit" className="button-primary mt-5">Enregistrer les reglages</button>
      </form>

      <form action="/api/admin/theme-settings" method="post" className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Theme centralise</h3>
        <p className="mt-2 text-sm text-slate-600">Palette minimale et reutilisable pour raccorder ensuite `site-nowis-web` a une source unique.</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="primaryColor">Couleur principale</label>
            <input id="primaryColor" name="primaryColor" defaultValue={themeSettings?.primaryColor ?? '#1f4d4b'} required />
          </div>
          <div>
            <label htmlFor="accentColor">Couleur accent</label>
            <input id="accentColor" name="accentColor" defaultValue={themeSettings?.accentColor ?? '#d0683d'} required />
          </div>
          <div>
            <label htmlFor="surfaceColor">Couleur surface</label>
            <input id="surfaceColor" name="surfaceColor" defaultValue={themeSettings?.surfaceColor ?? '#f6f1e8'} required />
          </div>
          <div>
            <label htmlFor="textColor">Couleur texte</label>
            <input id="textColor" name="textColor" defaultValue={themeSettings?.textColor ?? '#141826'} required />
          </div>
          <div>
            <label htmlFor="mutedColor">Couleur secondaire</label>
            <input id="mutedColor" name="mutedColor" defaultValue={themeSettings?.mutedColor ?? '#6b7280'} required />
          </div>
          <div>
            <label htmlFor="borderRadius">Rayon principal</label>
            <input id="borderRadius" name="borderRadius" defaultValue={themeSettings?.borderRadius ?? '18px'} required />
          </div>
        </div>

        <div className="mt-5 rounded-[28px] border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm font-semibold text-ink">Apercu rapide</p>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              ['Primaire', themeSettings?.primaryColor ?? '#1f4d4b'],
              ['Accent', themeSettings?.accentColor ?? '#d0683d'],
              ['Surface', themeSettings?.surfaceColor ?? '#f6f1e8'],
            ].map(([label, color]) => (
              <div key={label} className="rounded-2xl border border-white bg-white p-3">
                <div className="h-10 rounded-xl border border-slate-200" style={{ backgroundColor: color as string }} />
                <p className="mt-2 text-xs font-medium text-slate-600">{label}</p>
                <p className="text-xs text-slate-500">{color}</p>
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="button-primary mt-5">Enregistrer le theme</button>
      </form>
    </div>
  );
}