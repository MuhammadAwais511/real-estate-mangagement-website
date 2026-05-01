export default function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-4xl border border-dashed border-slate-700/80 bg-slate-950/70 p-10 text-center text-slate-400 shadow-inner shadow-slate-950/20">
      <p className="text-2xl font-semibold text-white">{title}</p>
      <p className="mt-3 max-w-xl mx-auto text-sm leading-7">{description}</p>
    </div>
  );
}
