import { Inbox } from 'lucide-react';

export function AdminEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-200 text-slate-500">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="text-base font-black text-slate-900">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-slate-500">{description}</p>
    </div>
  );
}
