import { MediaPicker } from '@/components/editor/media-picker';
import { ToggleSectionVisibility } from '@/components/editor/toggle-section-visibility';
import type { EditorMediaAsset, EditorSection, SectionFormState } from '@/components/editor/types';
import type { SectionModel } from '@/lib/site-section-model';

interface SectionEditorProps {
  section: EditorSection;
  sectionModel: SectionModel;
  form: SectionFormState;
  mediaAssets: EditorMediaAsset[];
  onChange: (patch: Partial<SectionFormState>) => void;
  onChangeExtraField: (key: string, value: string) => void;
  onSave: () => void;
  isSaving: boolean;
  saveMessage: string;
}

export function SectionEditor({ section, sectionModel, form, mediaAssets, onChange, onChangeExtraField, onSave, isSaving, saveMessage }: SectionEditorProps) {
  return (
    <section className="rounded-[30px] border border-slate-200 bg-white p-5">
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">3. Retoucher cette zone</p>
        <h3 className="mt-2 text-xl font-semibold text-ink">{section.name}</h3>
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

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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
              className="h-12"
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
              className="h-12"
            />
            <p className="mt-1 text-xs text-slate-500">La couleur des mots dans cette zone.</p>
          </div>
        </div>

        <ToggleSectionVisibility checked={form.isActive} onChange={(checked) => onChange({ isActive: checked })} />

        <MediaPicker assets={mediaAssets} selectedImageId={form.imageId} onSelect={(imageId) => onChange({ imageId })} />

        {sectionModel.fields.length > 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
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

      <div className="mt-5 flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{saveMessage || '4. Quand c est bon, enregistre cette zone.'}</p>
        <button type="button" onClick={onSave} disabled={isSaving} className="button-primary">
          {isSaving ? 'Enregistrement...' : 'Enregistrer la zone'}
        </button>
      </div>
    </section>
  );
}
