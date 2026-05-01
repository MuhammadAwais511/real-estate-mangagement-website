export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-4xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl shadow-slate-950/20">
      <div className="h-56 rounded-3xl bg-slate-800/60" />
      <div className="mt-5 space-y-3">
        <div className="h-5 w-2/3 rounded-full bg-slate-800/60" />
        <div className="h-4 w-1/2 rounded-full bg-slate-800/60" />
        <div className="flex items-center gap-3">
          <div className="h-4 w-24 rounded-full bg-slate-800/60" />
          <div className="h-4 w-16 rounded-full bg-slate-800/60" />
        </div>
      </div>
    </div>
  );
}
