interface ToggleSectionVisibilityProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSectionVisibility({ checked, onChange }: ToggleSectionVisibilityProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50/85 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-ink">Afficher cette zone</p>
        <p className="text-xs text-slate-500">Coupe ce bouton pour cacher cette zone.</p>
      </div>
      <span className="relative inline-flex items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          className="peer sr-only"
        />
        <span className="h-7 w-12 rounded-full bg-slate-300 transition peer-checked:bg-pine" />
        <span className="pointer-events-none absolute left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}
