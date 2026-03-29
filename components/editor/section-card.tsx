import type { DragEvent } from 'react';

import type { EditorSection } from '@/components/editor/types';

interface SectionCardProps {
  section: EditorSection;
  active: boolean;
  dropTarget?: boolean;
  index: number;
  onEdit: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDropOnCard: () => void;
  onDragOverCard: (event: DragEvent<HTMLElement>) => void;
  disableMoveUp: boolean;
  disableMoveDown: boolean;
  disableDelete: boolean;
  busy: boolean;
}

export function SectionCard({
  section,
  active,
  dropTarget = false,
  index,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDuplicate,
  onDelete,
  onDragStart,
  onDragEnd,
  onDropOnCard,
  onDragOverCard,
  disableMoveUp,
  disableMoveDown,
  disableDelete,
  busy,
}: SectionCardProps) {
  return (
    <article
      onDrop={onDropOnCard}
      onDragOver={onDragOverCard}
      className={`group relative rounded-3xl border p-4 transition-all duration-200 ${
        active
          ? 'border-pine/70 bg-white shadow-[0_12px_28px_rgba(31,77,75,0.14)] ring-1 ring-pine/20'
          : 'border-slate-200/80 bg-white/75 shadow-[0_4px_14px_rgba(15,23,42,0.05)] hover:border-slate-300 hover:shadow-[0_12px_24px_rgba(15,23,42,0.09)]'
      } ${dropTarget ? 'border-pine/80 ring-2 ring-pine/35' : ''} ${busy ? 'cursor-not-allowed' : ''}`}
    >
      {active ? <span className="absolute left-0 top-4 h-10 w-1 rounded-r-full bg-pine" aria-hidden="true" /> : null}

      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Zone</p>
          <h4 className="mt-1 text-base font-semibold leading-snug text-ink">{index + 1}. {section.title || 'Sans titre'}</h4>
          <p className="mt-1 text-xs text-slate-500">Type: {section.modelName}</p>
          <p className="mt-2 line-clamp-2 text-sm leading-5 text-slate-600">{section.description || 'Ajoute un petit texte pour cette zone.'}</p>
        </div>
        <div className="flex shrink-0 items-start gap-2">
          <div
            draggable={!busy}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            className="mt-0.5 flex h-9 w-9 cursor-grab items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition hover:border-slate-300 hover:text-slate-600 active:cursor-grabbing"
            title="Glisser pour reordonner"
            aria-label="Glisser pour reordonner"
          >
            <div className="grid grid-cols-2 gap-[3px]">
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
              <span className="h-1 w-1 rounded-full bg-current" />
            </div>
          </div>

          <div className={`rounded-full px-3 py-1 text-xs font-semibold ${section.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
            {section.isActive ? 'Visible' : 'Masquee'}
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200/70 pt-3">
        <p className="text-xs text-slate-500">Bouton: {section.ctaLabel || 'Pas encore ajoute'}</p>
        <button type="button" onClick={onEdit} disabled={busy} className="button-secondary px-4 py-2 text-xs disabled:cursor-not-allowed disabled:opacity-50">
          Retoucher
        </button>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 lg:opacity-0 lg:transition-opacity lg:duration-200 group-hover:opacity-100 group-focus-within:opacity-100">
        <button
          type="button"
          onClick={onMoveUp}
          disabled={busy || disableMoveUp}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Monter
        </button>
        <button
          type="button"
          onClick={onMoveDown}
          disabled={busy || disableMoveDown}
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Descendre
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          disabled={busy}
          className="rounded-xl border border-amber-200 bg-white px-3 py-2 text-xs font-semibold text-amber-700 transition hover:border-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Dupliquer
        </button>
        <button
          type="button"
          onClick={onDelete}
          disabled={busy || disableDelete}
          className="rounded-xl border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 transition hover:border-rose-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Supprimer
        </button>
      </div>
    </article>
  );
}
