import Image from 'next/image';

import type { EditorMediaAsset, EditorSection, SectionFormState } from '@/components/editor/types';

interface LivePreviewProps {
  section: EditorSection;
  form: SectionFormState;
  mediaAssets: EditorMediaAsset[];
  mode?: 'editor' | 'page' | 'final';
  selected?: boolean;
  onSelect?: () => void;
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

function headingClass(scale: SectionFormState['headingScale']) {
  if (scale === 'sm') return 'text-2xl md:text-3xl';
  if (scale === 'lg') return 'text-4xl md:text-5xl';
  return 'text-3xl md:text-4xl';
}

function mobileSpacingClass(value: SectionFormState['mobileSpacing']) {
  if (value === 'compact') return 'py-6 md:py-10';
  if (value === 'comfortable') return 'py-10 md:py-14';
  if (value === 'airy') return 'py-14 md:py-16';
  return '';
}

function alignClass(contentAlign: SectionFormState['contentAlign'], mobileAlign: SectionFormState['mobileAlign']) {
  const desktop = contentAlign === 'center' ? 'md:text-center' : 'md:text-left';

  if (mobileAlign === 'center') {
    return `text-center ${desktop}`;
  }

  if (mobileAlign === 'left') {
    return `text-left ${desktop}`;
  }

  return contentAlign === 'center' ? 'text-center' : 'text-left';
}

function ratioStyle(ratio: SectionFormState['imageAspectRatio']) {
  if (ratio === '16/9') return { aspectRatio: '16 / 9' };
  if (ratio === '4/3') return { aspectRatio: '4 / 3' };
  if (ratio === '1/1') return { aspectRatio: '1 / 1' };
  return undefined;
}

export function LivePreview({ section, form, mediaAssets, mode = 'editor', selected = false, onSelect }: LivePreviewProps) {
  const image = mediaAssets.find((asset) => asset.id === form.imageId);
  const containerClass = widthClass(form.contentWidth);
  const sectionSpacingClass = spacingClass(form.verticalSpacing);
  const mobileSpacing = mobileSpacingClass(form.mobileSpacing);
  const headingScaleClass = headingClass(form.headingScale);
  const textAlignClass = alignClass(form.contentAlign, form.mobileAlign);
  const isFinal = mode === 'final';
  const isInteractive = !!onSelect && !isFinal;

  return (
    <div
      className={mode === 'editor' ? 'rounded-[30px] border border-white/70 bg-white/85 p-4 shadow-[0_14px_32px_rgba(15,23,42,0.08)] backdrop-blur transition-all duration-200' : ''}
    >
      {mode === 'editor' ? (
        <>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resultat en direct</p>
          <p className="mt-1 text-sm text-slate-500">C est exactement ce que tu es en train de modifier.</p>
        </>
      ) : null}

      <section
        role={isInteractive ? 'button' : undefined}
        tabIndex={isInteractive ? 0 : undefined}
        onClick={isInteractive ? onSelect : undefined}
        onKeyDown={
          isInteractive
            ? (event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelect?.();
                }
              }
            : undefined
        }
        className={`overflow-hidden transition-all duration-200 ${isFinal ? '' : 'rounded-[28px] border'} ${
          mode === 'editor' ? 'mt-4' : ''
        } ${
          selected
            ? 'border-pine/60 ring-2 ring-pine/25 shadow-[0_18px_34px_rgba(31,77,75,0.15)]'
            : 'border-slate-200/80 shadow-[0_8px_20px_rgba(15,23,42,0.08)]'
        } ${isInteractive ? 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_18px_32px_rgba(15,23,42,0.14)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pine/35' : ''}`}
        style={{
          backgroundColor: form.backgroundColor || '#f8fafc',
          color: form.textColor || '#141826',
        }}
      >
        {image ? (
          <div className="relative w-full" style={ratioStyle(form.imageAspectRatio)}>
            <div className={form.imageAspectRatio === 'auto' ? 'relative h-52 w-full' : 'relative h-full w-full'}>
              <Image
                src={image.url}
                alt={form.imageAltText || image.altText || image.originalName}
                fill
                className="select-none"
                style={{
                  objectFit: form.imageFit,
                  objectPosition: `${form.imageFocalX}% ${form.imageFocalY}%`,
                  transform: `scale(${form.imageZoom})`,
                  transformOrigin: `${form.imageFocalX}% ${form.imageFocalY}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <div className="flex h-40 items-center justify-center bg-white/45 text-sm text-slate-600">Aucune photo pour cette zone</div>
        )}

        <div className={`${containerClass} ${sectionSpacingClass} ${mobileSpacing} ${textAlignClass} mx-auto space-y-3 px-6`}>
          {mode === 'editor' ? (
            <div className="flex items-center justify-between gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">Zone: {section.name}</p>
              {selected ? <span className="rounded-full bg-pine/12 px-2.5 py-1 text-[11px] font-semibold text-pine">Selectionnee</span> : null}
            </div>
          ) : null}
          <h3 className={`${headingScaleClass} font-semibold leading-tight`}>{form.title || 'Titre principal'}</h3>
          {form.subtitle ? <p className="text-base opacity-85">{form.subtitle}</p> : null}
          {form.description ? <p className={`${form.contentAlign === 'center' ? 'mx-auto' : ''} max-w-2xl text-sm leading-6 opacity-90`}>{form.description}</p> : null}
          {form.ctaLabel ? (
            <button type="button" className="mt-2 rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-ink shadow-sm">
              {form.ctaLabel}
            </button>
          ) : null}
        </div>
      </section>
    </div>
  );
}
