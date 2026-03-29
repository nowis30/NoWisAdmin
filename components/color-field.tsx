interface ColorFieldProps {
  id: string;
  name: string;
  label: string;
  help: string;
  value: string;
  onChange: (value: string) => void;
}

export function ColorField({ id, name, label, help, value, onChange }: ColorFieldProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <label htmlFor={id} className="mb-1">{label}</label>
      <p className="mb-3 text-xs text-slate-500">{help}</p>

      <div className="flex items-center gap-3">
        <input id={id} name={name} type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-14 rounded-xl border border-slate-200 p-1" />
        <input value={value} onChange={(event) => onChange(event.target.value)} className="h-11" />
      </div>

      <div className="mt-3 h-9 rounded-xl border border-slate-200" style={{ backgroundColor: value }} />
    </div>
  );
}
