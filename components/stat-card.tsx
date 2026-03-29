export function StatCard({ label, value, helper }: { label: string; value: string | number; helper: string }) {
  return (
    <div className="panel p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">{label}</p>
      <p className="mt-3 text-3xl font-semibold text-ink">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{helper}</p>
    </div>
  );
}