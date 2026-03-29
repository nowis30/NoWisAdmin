interface ToggleSectionVisibilityProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function ToggleSectionVisibility({ checked, onChange }: ToggleSectionVisibilityProps) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div>
        <p className="text-sm font-semibold text-ink">Afficher cette zone</p>
        <p className="text-xs text-slate-500">Coupe ce bouton pour cacher cette zone.</p>
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 rounded border-slate-300"
      />
    </label>
  );
}
