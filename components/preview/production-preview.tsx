"use client";

import { useMemo, useState } from 'react';
import Image from 'next/image';

import type { PublishPayload, SectionContract } from '@/types/site';

interface ProductionPreviewProps {
  payload: PublishPayload;
}

function blockValue(section: SectionContract, key: string) {
  return section.blocks.find((block) => block.key === key)?.value || '';
}

function widthClass(value: string) {
  if (value === 'compact') return 'max-w-4xl';
  if (value === 'wide') return 'max-w-7xl';
  return 'max-w-5xl';
}

function spacingClass(value: string) {
  if (value === 'tight') return 'py-8 md:py-10';
  if (value === 'airy') return 'py-16 md:py-20';
  return 'py-12 md:py-14';
}

function headingClass(value: string) {
  if (value === 'sm') return 'text-2xl md:text-3xl';
  if (value === 'lg') return 'text-4xl md:text-5xl';
  return 'text-3xl md:text-4xl';
}

function mobileSpacingClass(value: string) {
  if (value === 'compact') return 'py-6 md:py-10';
  if (value === 'comfortable') return 'py-10 md:py-14';
  if (value === 'airy') return 'py-14 md:py-16';
  return '';
}

function alignClass(contentAlign: string, mobileAlign: string) {
  const desktop = contentAlign === 'center' ? 'md:text-center' : 'md:text-left';

  if (mobileAlign === 'center') return `text-center ${desktop}`;
  if (mobileAlign === 'left') return `text-left ${desktop}`;
  return contentAlign === 'center' ? 'text-center' : 'text-left';
}

function ratioStyle(value: string) {
  if (value === '16/9') return { aspectRatio: '16 / 9' };
  if (value === '4/3') return { aspectRatio: '4 / 3' };
  if (value === '1/1') return { aspectRatio: '1 / 1' };
  return undefined;
}

function frameWidth(device: 'mobile' | 'tablet' | 'desktop') {
  if (device === 'mobile') return 'mx-auto max-w-sm';
  if (device === 'tablet') return 'mx-auto max-w-4xl';
  return 'max-w-none';
}

export function ProductionPreview({ payload }: ProductionPreviewProps) {
  const [selectedSlug, setSelectedSlug] = useState(payload.pages[0]?.slug || '');
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');

  const page = useMemo(
    () => payload.pages.find((item) => item.slug === selectedSlug) || payload.pages[0],
    [payload.pages, selectedSlug],
  );

  if (!page) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-sm text-slate-600">
        Aucun rendu disponible.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-3xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {payload.pages.map((item) => (
              <button
                key={item.slug}
                type="button"
                onClick={() => setSelectedSlug(item.slug)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  page.slug === item.slug ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.title}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(['mobile', 'tablet', 'desktop'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setDevice(item)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  device === item ? 'bg-pine text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item === 'mobile' ? 'Mobile' : item === 'tablet' ? 'Tablette' : 'Desktop'}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className={`${frameWidth(device)} overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[0_14px_30px_rgba(15,23,42,0.12)]`}>
        {page.sections.map((section) => {
          const bg = blockValue(section, 'style.backgroundColor') || payload.themeSettings.surfaceColor;
          const text = blockValue(section, 'style.textColor') || payload.themeSettings.textColor;
          const contentWidth = widthClass(blockValue(section, 'style.contentWidth') || 'normal');
          const spacing = spacingClass(blockValue(section, 'style.verticalSpacing') || 'normal');
          const mobileSpacing = mobileSpacingClass(blockValue(section, 'style.mobileSpacing') || 'inherit');
          const align = alignClass(blockValue(section, 'style.contentAlign') || 'left', blockValue(section, 'style.mobileAlign') || 'inherit');
          const heading = headingClass(blockValue(section, 'style.headingScale') || 'md');

          const imageFit = blockValue(section, 'style.image.fit') === 'contain' ? 'contain' : 'cover';
          const imageRatio = blockValue(section, 'style.image.aspectRatio') || 'auto';
          const imageFocalX = Number(blockValue(section, 'style.image.focalX')) || 50;
          const imageFocalY = Number(blockValue(section, 'style.image.focalY')) || 50;
          const imageZoom = Number(blockValue(section, 'style.image.zoom')) || 1;
          const imageAlt = blockValue(section, 'style.image.altText') || section.title;

          return (
            <article key={section.key} style={{ backgroundColor: bg, color: text }}>
              {section.imageUrl ? (
                <div className="relative w-full" style={ratioStyle(imageRatio)}>
                  <div className={imageRatio === 'auto' ? 'relative h-56 md:h-72' : 'relative h-full min-h-[260px]'}>
                    <Image
                      src={section.imageUrl}
                      alt={imageAlt}
                      fill
                      className="select-none"
                      style={{
                        objectFit: imageFit,
                        objectPosition: `${imageFocalX}% ${imageFocalY}%`,
                        transform: `scale(${Math.max(1, Math.min(2.5, imageZoom))})`,
                        transformOrigin: `${imageFocalX}% ${imageFocalY}%`,
                      }}
                    />
                  </div>
                </div>
              ) : null}

              <div className={`mx-auto ${contentWidth} ${spacing} ${mobileSpacing} ${align} px-6`}>
                <h2 className={`${heading} font-semibold leading-tight`}>{section.title}</h2>
                {section.subtitle ? <p className="mt-2 text-base opacity-90">{section.subtitle}</p> : null}
                {section.description ? (
                  <p className={`mt-3 text-sm leading-7 opacity-90 ${align === 'text-center' ? 'mx-auto max-w-3xl' : 'max-w-3xl'}`}>
                    {section.description}
                  </p>
                ) : null}
                {section.ctaLabel ? (
                  <a
                    href={section.ctaHref || '#'}
                    className="mt-6 inline-flex items-center justify-center rounded-full bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm"
                  >
                    {section.ctaLabel}
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
