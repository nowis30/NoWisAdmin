import { ThemeEditor } from '@/components/theme-editor';
import { getAppearanceData } from '@/lib/admin-data';

export default async function AppearancePage() {
  const { siteSettings, themeSettings } = await getAppearanceData();

  if (!siteSettings || !themeSettings) {
    return (
      <section className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Couleurs et style</h3>
        <p className="mt-2 text-sm text-slate-600">Impossible de charger les reglages pour le moment.</p>
      </section>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <form action="/api/admin/site-settings" method="post" className="panel p-6">
        <h3 className="text-xl font-semibold text-ink">Informations du site</h3>
        <p className="mt-2 text-sm text-slate-600">Ces champs definissent les informations globales du site.</p>

        <div className="mt-5 grid gap-4">
          <div>
            <label htmlFor="siteName">Nom du site</label>
            <input id="siteName" name="siteName" defaultValue={siteSettings.siteName} required />
            <p className="mt-1 text-xs text-slate-500">Nom affiche dans les zones principales.</p>
          </div>
          <div>
            <label htmlFor="siteUrl">Adresse du site</label>
            <input id="siteUrl" name="siteUrl" defaultValue={siteSettings.siteUrl} required />
            <p className="mt-1 text-xs text-slate-500">Adresse principale du site public.</p>
          </div>
          <div>
            <label htmlFor="defaultSeoTitle">Titre de reference</label>
            <input id="defaultSeoTitle" name="defaultSeoTitle" defaultValue={siteSettings.defaultSeoTitle} required />
            <p className="mt-1 text-xs text-slate-500">Titre general utilise si une page n en a pas.</p>
          </div>
          <div>
            <label htmlFor="defaultSeoDescription">Description de reference</label>
            <textarea id="defaultSeoDescription" name="defaultSeoDescription" defaultValue={siteSettings.defaultSeoDescription} />
            <p className="mt-1 text-xs text-slate-500">Description generale du site.</p>
          </div>
          <div>
            <label htmlFor="defaultCtaLabel">Bouton principal (texte)</label>
            <input id="defaultCtaLabel" name="defaultCtaLabel" defaultValue={siteSettings.defaultCtaLabel} required />
          </div>
          <div>
            <label htmlFor="defaultCtaHref">Bouton principal (lien)</label>
            <input id="defaultCtaHref" name="defaultCtaHref" defaultValue={siteSettings.defaultCtaHref} required />
          </div>
        </div>

        <button type="submit" className="button-primary mt-5">Enregistrer les informations</button>
      </form>

      <ThemeEditor
        initialTheme={{
          primaryColor: themeSettings.primaryColor,
          accentColor: themeSettings.accentColor,
          surfaceColor: themeSettings.surfaceColor,
          textColor: themeSettings.textColor,
          mutedColor: themeSettings.mutedColor,
          borderRadius: themeSettings.borderRadius,
        }}
      />
    </div>
  );
}
