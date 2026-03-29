import Image from 'next/image';

import type { EditorMediaAsset, EditorSection, SectionFormState } from '@/components/editor/types';

interface LivePreviewProps {
  section: EditorSection;
  form: SectionFormState;
  mediaAssets: EditorMediaAsset[];
  mode?: 'editor' | 'page' | 'final';
}

function widthClass(contentWidth: SectionFormState['contentWidth']) {
  if (contentWidth === 'compact') return 'max-w-3xl';
  if (contentWidth === 'wide') return 'max-w-7xl';
  return 'max-w-5xl';
}

function spacingClass(verticalSpacing: SectionFormState['verticalSpacing']) {
  if (verticalSpacing === 'tight') return 'py-6';
  if (verticalSpacing === 'airy') return 'py-16';
  return 'py-10';
}

export function LivePreview({ section, form, mediaAssets, mode = 'editor' }: LivePreviewProps) {
  const image = mediaAssets.find((asset) => asset.id === form.imageId);
  const containerClass = widthClass(form.contentWidth);
  const sectionSpacingClass = spacingClass(form.verticalSpacing);
  const isFinal = mode === 'final';

  return (
    <div className={mode === 'editor' ? 'rounded-[30px] border border-slate-200 bg-white p-4' : ''}>
      {mode === 'editor' ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resultat en direct</p>
          <p className="mt-1 text-sm text-slate-500">C est exactement ce que tu es en train de modifier.</p>
        </>
      ) : null}

      <section
        className={`overflow-hidden ${isFinal ? '' : 'rounded-[26px] border border-slate-200'} ${mode === 'editor' ? 'mt-4' : ''}`}
        style={{
          backgroundColor: form.backgroundColor || '#f8fafc',
          color: form.textColor || '#141826',
        }}
      >
        {image ? (
          <div className="relative h-52 w-full">
            <Image src={image.url} alt={image.altText || image.originalName} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center bg-white/40 text-sm text-slate-500">Aucune photo pour cette zone</div>
        )}

        <div className={`${containerClass} ${sectionSpacingClass} mx-auto space-y-3 px-6`}>
          {mode === 'editor' ? <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Zone: {section.name}</p> : null}
          <h3 className="text-3xl font-semibold">{form.title || 'Titre principal'}</h3>
          {form.subtitle ? <p className="text-base opacity-85">{form.subtitle}</p> : null}
          {form.description ? <p className="max-w-2xl text-sm leading-6 opacity-90">{form.description}</p> : null}
          {form.ctaLabel ? (
            <button type="button" className="mt-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-ink">
              {form.ctaLabel}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
