"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from 'react';
import Image from 'next/image';

import type { EditorMediaAsset, SectionFormState } from '@/components/editor/types';

interface ImageStyleModalProps {
  open: boolean;
  image: EditorMediaAsset | null;
  value: {
    imageFocalX: number;
    imageFocalY: number;
    imageZoom: number;
    imageFit: SectionFormState['imageFit'];
    imageAspectRatio: SectionFormState['imageAspectRatio'];
    imageAltText: string;
  };
  onClose: () => void;
  onCancel: () => void;
  onLiveChange?: (patch: Partial<SectionFormState>) => void;
  onApply: (patch: Partial<SectionFormState>) => void;
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function ratioStyle(ratio: SectionFormState['imageAspectRatio']) {
  if (ratio === '16/9') return { aspectRatio: '16 / 9' };
  if (ratio === '4/3') return { aspectRatio: '4 / 3' };
  if (ratio === '1/1') return { aspectRatio: '1 / 1' };
  return undefined;
}

export function ImageStyleModal({ open, image, value, onClose, onCancel, onLiveChange, onApply }: ImageStyleModalProps) {
  const [local, setLocal] = useState(value);

  useEffect(() => {
    setLocal(value);
  }, [value]);

  useEffect(() => {
    if (!open) {
      return;
    }

    onLiveChange?.(local);
  }, [local, onLiveChange, open]);

  if (!open) {
    return null;
  }

  function onDragStart(event: ReactPointerEvent<HTMLDivElement>) {
    const target = event.currentTarget;
    target.setPointerCapture(event.pointerId);

    const rect = target.getBoundingClientRect();

    function onPointerMove(moveEvent: PointerEvent) {
      const nextX = clamp(((moveEvent.clientX - rect.left) / rect.width) * 100, 0, 100);
      const nextY = clamp(((moveEvent.clientY - rect.top) / rect.height) * 100, 0, 100);
      setLocal((current) => ({ ...current, imageFocalX: nextX, imageFocalY: nextY }));
    }

    function onPointerUp(upEvent: PointerEvent) {
      target.releasePointerCapture(upEvent.pointerId);
      target.removeEventListener('pointermove', onPointerMove);
      target.removeEventListener('pointerup', onPointerUp);
    }

    target.addEventListener('pointermove', onPointerMove);
    target.addEventListener('pointerup', onPointerUp);
  }

  function reset() {
    setLocal((current) => ({
      ...current,
      imageFocalX: 50,
      imageFocalY: 50,
      imageZoom: 1,
      imageFit: 'cover',
      imageAspectRatio: 'auto',
    }));
  }

  function setRatio(ratio: SectionFormState['imageAspectRatio']) {
    setLocal((current) => ({ ...current, imageAspectRatio: ratio }));
  }

  function setFit(fit: SectionFormState['imageFit']) {
    setLocal((current) => ({ ...current, imageFit: fit }));
  }

  function setZoomDelta(delta: number) {
    setLocal((current) => ({ ...current, imageZoom: clamp(current.imageZoom + delta, 1, 2.5) }));
  }

  function centerFocus() {
    setLocal((current) => ({ ...current, imageFocalX: 50, imageFocalY: 50 }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4 py-8 backdrop-blur-sm">
      <div className="w-full max-w-5xl rounded-[28px] border border-white/60 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.28)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Studio photo</p>
            <h4 className="mt-1 text-xl font-semibold text-ink">Cadre, deplace et zoome comme en retouche</h4>
          </div>
          <button type="button" onClick={onClose} className="button-secondary px-4 py-2 text-xs">
            Valider
          </button>
        </div>

        <div className="mt-4 grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,0.9fr)]">
          <section className="rounded-2xl border border-slate-200 bg-slate-50/85 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Apercu du cadre</p>
            <p className="mt-1 text-xs text-slate-600">Clique ou glisse dans l image pour choisir la zone importante. Le rendu de la page se met a jour en direct.</p>

            <div className="relative mt-3 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-900" style={ratioStyle(local.imageAspectRatio)}>
              <div className={`relative w-full ${local.imageAspectRatio === 'auto' ? 'h-72' : 'h-full'}`} onPointerDown={onDragStart}>
                {image ? (
                  <Image
                    src={image.url}
                    alt={local.imageAltText || image.altText || image.originalName}
                    fill
                    className="select-none"
                    style={{
                      objectFit: local.imageFit,
                      objectPosition: `${local.imageFocalX}% ${local.imageFocalY}%`,
                      transform: `scale(${local.imageZoom})`,
                      transformOrigin: `${local.imageFocalX}% ${local.imageFocalY}%`,
                    }}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-300">Aucune image selectionnee</div>
                )}
              </div>

              <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="border border-white/20" />
                ))}
              </div>

              <div
                className="pointer-events-none absolute h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-pine/85 shadow-[0_0_0_2px_rgba(15,23,42,0.25)]"
                style={{ left: `${local.imageFocalX}%`, top: `${local.imageFocalY}%` }}
              />

              <div className="pointer-events-none absolute left-2 top-2 rounded-full bg-slate-900/70 px-2 py-1 text-[11px] font-semibold text-white">
                Focus {Math.round(local.imageFocalX)}% / {Math.round(local.imageFocalY)}%
              </div>
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              <button type="button" onClick={centerFocus} className="button-secondary px-3 py-1.5 text-xs">
                Recentrer
              </button>
              <button type="button" onClick={() => setZoomDelta(-0.1)} className="button-secondary px-3 py-1.5 text-xs">
                Zoom -
              </button>
              <button type="button" onClick={() => setZoomDelta(0.1)} className="button-secondary px-3 py-1.5 text-xs">
                Zoom +
              </button>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-4">
            <div>
              <label htmlFor="image-alt-text">Description image</label>
              <input
                id="image-alt-text"
                value={local.imageAltText}
                onChange={(event) => setLocal((current) => ({ ...current, imageAltText: event.target.value }))}
                placeholder="Exemple: portrait sur scene"
              />
            </div>

            <div className="mt-4">
              <label htmlFor="image-zoom">Zoom ({local.imageZoom.toFixed(2)}x)</label>
              <input
                id="image-zoom"
                type="range"
                min={1}
                max={2.5}
                step={0.01}
                value={local.imageZoom}
                onChange={(event) => setLocal((current) => ({ ...current, imageZoom: Number(event.target.value) }))}
              />
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label htmlFor="image-focal-x">Position horizontale ({Math.round(local.imageFocalX)}%)</label>
                <input
                  id="image-focal-x"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={local.imageFocalX}
                  onChange={(event) => setLocal((current) => ({ ...current, imageFocalX: Number(event.target.value) }))}
                />
              </div>
              <div>
                <label htmlFor="image-focal-y">Position verticale ({Math.round(local.imageFocalY)}%)</label>
                <input
                  id="image-focal-y"
                  type="range"
                  min={0}
                  max={100}
                  step={1}
                  value={local.imageFocalY}
                  onChange={(event) => setLocal((current) => ({ ...current, imageFocalY: Number(event.target.value) }))}
                />
              </div>
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div>
                <label>Cadrage</label>
                <div className="mt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFit('cover')}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${local.imageFit === 'cover' ? 'border-pine bg-pine/10 text-pine' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    Remplir
                  </button>
                  <button
                    type="button"
                    onClick={() => setFit('contain')}
                    className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${local.imageFit === 'contain' ? 'border-pine bg-pine/10 text-pine' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                  >
                    Afficher entier
                  </button>
                </div>
              </div>
              <div>
                <label>Format du cadre</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(['auto', '16/9', '4/3', '1/1'] as const).map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setRatio(ratio)}
                      className={`rounded-xl border px-2.5 py-1.5 text-xs font-semibold transition ${local.imageAspectRatio === ratio ? 'border-pine bg-pine/10 text-pine' : 'border-slate-200 text-slate-700 hover:border-slate-300'}`}
                    >
                      {ratio === 'auto' ? 'Auto' : ratio}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={reset} className="button-secondary px-4 py-2 text-xs">
                Remettre par defaut
              </button>
              <button
                type="button"
                onClick={() => {
                  onApply(local);
                  onClose();
                }}
                className="button-primary px-4 py-2 text-xs"
              >
                Garder ces reglages
              </button>
              <button type="button" onClick={onCancel} className="button-secondary px-4 py-2 text-xs">
                Annuler et revenir
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
