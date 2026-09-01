export function AdminLoadingState({ label = 'Loading data...' }: { label?: string }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-soft-sm">
      <div className="flex items-center gap-3 text-slate-500">
        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-orange-500" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
    </div>
  );
}
