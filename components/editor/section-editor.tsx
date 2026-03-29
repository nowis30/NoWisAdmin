import { MediaPicker } from '@/components/editor/media-picker';
import { ToggleSectionVisibility } from '@/components/editor/toggle-section-visibility';
import type { EditorMediaAsset, EditorSection, SectionFormState } from '@/components/editor/types';
import type { SectionModel } from '@/lib/site-section-model';

interface SectionEditorProps {
  section: EditorSection;
  sectionModel: SectionModel;
  form: SectionFormState;
  mediaAssets: EditorMediaAsset[];
  onOpenImageStyle: () => void;
  onChange: (patch: Partial<SectionFormState>) => void;
  onChangeExtraField: (key: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

export function SectionEditor({
  section,
  sectionModel,
  form,
  mediaAssets,
  onOpenImageStyle,
  onChange,
  onChangeExtraField,
  onSave,
  isSaving,
  saveMessage,
}: SectionEditorProps) {
  return (
    <section className="rounded-[30px] border border-white/70 bg-white/92 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.10)] backdrop-blur">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">3. Retoucher cette zone</p>
        <h3 className="mt-2 text-xl font-semibold leading-tight text-ink">{section.name}</h3>
        <p className="mt-2 text-sm text-slate-600">{sectionModel.summary}</p>
      </div>

      <div className="grid gap-4">
        <div>
          <label htmlFor="section-title">Grand titre</label>
          <input id="section-title" value={form.title} onChange={(event) => onChange({ title: event.target.value })} />
          <p className="mt-1 text-xs text-slate-500">Le titre le plus visible dans cette zone.</p>
        </div>

        <div>
          <label htmlFor="section-subtitle">Petit titre</label>
          <input id="section-subtitle" value={form.subtitle} onChange={(event) => onChange({ subtitle: event.target.value })} />
          <p className="mt-1 text-xs text-slate-500">Une courte phrase juste en dessous.</p>
        </div>

        <div>
          <label htmlFor="section-description">Texte</label>
          <textarea id="section-description" value={form.description} onChange={(event) => onChange({ description: event.target.value })} />
          <p className="mt-1 text-xs text-slate-500">Le texte que les visiteurs vont lire.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="section-cta-label">Texte du bouton</label>
            <input id="section-cta-label" value={form.ctaLabel} onChange={(event) => onChange({ ctaLabel: event.target.value })} />
            <p className="mt-1 text-xs text-slate-500">Exemple: Decouvrir, Nous contacter.</p>
          </div>
          <div>
            <label htmlFor="section-cta-href">Lien du bouton</label>
            <input id="section-cta-href" value={form.ctaHref} onChange={(event) => onChange({ ctaHref: event.target.value })} />
            <p className="mt-1 text-xs text-slate-500">Exemple: /contact ou /ateliers.</p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
          <p className="text-sm font-semibold text-ink">Mise en page de cette zone</p>
          <p className="mt-1 text-xs text-slate-500">Des reglages simples pour adapter le rendu, sans casser le mobile.</p>

          <div className="mt-3 grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="section-content-width">Largeur du contenu</label>
              <select
                id="section-content-width"
                value={form.contentWidth}
                onChange={(event) => onChange({ contentWidth: event.target.value as SectionFormState['contentWidth'] })}
              >
                <option value="compact">Compacte</option>
                <option value="normal">Normale</option>
                <option value="wide">Large</option>
              </select>
            </div>

            <div>
              <label htmlFor="section-content-align">Alignement du contenu</label>
              <select
                id="section-content-align"
                value={form.contentAlign}
                onChange={(event) => onChange({ contentAlign: event.target.value as SectionFormState['contentAlign'] })}
              >
                <option value="left">Aligne a gauche</option>
                <option value="center">Centre</option>
              </select>
            </div>

            <div>
              <label htmlFor="section-vertical-spacing">Hauteur de la zone</label>
              <select
                id="section-vertical-spacing"
                value={form.verticalSpacing}
                onChange={(event) => onChange({ verticalSpacing: event.target.value as SectionFormState['verticalSpacing'] })}
              >
                <option value="tight">Compacte</option>
                <option value="normal">Normale</option>
                <option value="airy">Aeree</option>
              </select>
            </div>

            <div>
              <label htmlFor="section-heading-scale">Impact du titre</label>
              <select
                id="section-heading-scale"
                value={form.headingScale}
                onChange={(event) => onChange({ headingScale: event.target.value as SectionFormState['headingScale'] })}
              >
                <option value="sm">Discret</option>
                <option value="md">Equilibre</option>
                <option value="lg">Fort</option>
              </select>
            </div>

            <div>
              <label htmlFor="section-mobile-spacing">Densite mobile</label>
              <select
                id="section-mobile-spacing"
                value={form.mobileSpacing}
                onChange={(event) => onChange({ mobileSpacing: event.target.value as SectionFormState['mobileSpacing'] })}
              >
                <option value="inherit">Suivre le reglage principal</option>
                <option value="compact">Plus compact</option>
                <option value="comfortable">Confortable</option>
                <option value="airy">Plus aere</option>
              </select>
            </div>

            <div>
              <label htmlFor="section-mobile-align">Alignement mobile</label>
              <select
                id="section-mobile-align"
                value={form.mobileAlign}
                onChange={(event) => onChange({ mobileAlign: event.target.value as SectionFormState['mobileAlign'] })}
              >
                <option value="inherit">Suivre le reglage principal</option>
                <option value="left">Force a gauche</option>
                <option value="center">Force au centre</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="section-background-color">Couleur du fond</label>
            <input
              id="section-background-color"
              type="color"
              value={form.backgroundColor}
              onChange={(event) => onChange({ backgroundColor: event.target.value })}
              className="h-12 cursor-pointer"
            />
            <p className="mt-1 text-xs text-slate-500">La couleur derriere cette zone.</p>
          </div>
          <div>
            <label htmlFor="section-text-color">Couleur du texte</label>
            <input
              id="section-text-color"
              type="color"
              value={form.textColor}
              onChange={(event) => onChange({ textColor: event.target.value })}
              className="h-12 cursor-pointer"
            />
            <p className="mt-1 text-xs text-slate-500">La couleur des mots dans cette zone.</p>
          </div>
        </div>

        <ToggleSectionVisibility checked={form.isActive} onChange={(checked) => onChange({ isActive: checked })} />

        <MediaPicker assets={mediaAssets} selectedImageId={form.imageId} onSelect={(imageId) => onChange({ imageId })} />

        <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-ink">Studio photo de cette image</p>
              <p className="mt-1 text-xs text-slate-500">Ouvre le studio: deplace a la souris, cadre, zoome, et vois le resultat direct dans la page.</p>
            </div>
            <button
              type="button"
              onClick={onOpenImageStyle}
              disabled={!form.imageId}
              className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50"
            >
              Ouvrir le studio
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-600">
            Reglages actuels: zoom {form.imageZoom.toFixed(2)}x, position {Math.round(form.imageFocalX)}% / {Math.round(form.imageFocalY)}%, mode {form.imageFit}, format {form.imageAspectRatio}.
          </p>
        </div>

        {sectionModel.fields.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50/85 p-4">
            <p className="text-sm font-semibold text-ink">Champs utiles pour cette zone</p>
            <p className="mt-1 text-xs text-slate-500">Ces champs correspondent a la vraie structure du site public.</p>

            <div className="mt-4 grid gap-4">
              {sectionModel.fields.map((field) => (
                <div key={field.key}>
                  <label htmlFor={`field-${field.key}`}>{field.label}</label>
                  {field.input === 'textarea' ? (
                    <textarea
                      id={`field-${field.key}`}
                      value={form.extraFields[field.key] ?? ''}
                      onChange={(event) => onChangeExtraField(field.key, event.target.value)}
                    />
                  ) : (
                    <input
                      id={`field-${field.key}`}
                      type={field.input === 'url' ? 'url' : 'text'}
                      value={form.extraFields[field.key] ?? ''}
                      onChange={(event) => onChangeExtraField(field.key, event.target.value)}
                    />
                  )}
                  <p className="mt-1 text-xs text-slate-500">{field.help}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-4">
        <p className={`rounded-lg px-2.5 py-1 text-xs font-medium ${saveMessage ? 'bg-slate-100 text-slate-700' : 'text-slate-500'}`}>
          {saveMessage || '4. Quand c est bon, enregistre cette zone.'}
        </p>
        <button type="button" onClick={onSave} disabled={isSaving} className="button-primary">
          {isSaving ? 'Enregistrement...' : 'Enregistrer la zone'}
        </button>
      </div>
    </section>
  );
}
