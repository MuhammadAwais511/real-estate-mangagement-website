import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[70vh] place-items-center px-6 py-16 text-center text-white sm:px-8">
      <div className="max-w-xl rounded-[36px] border border-white/10 bg-slate-950/80 p-10 shadow-2xl shadow-slate-950/30">
        <p className="text-sm uppercase tracking-[0.3em] text-cyan-300/90">Page not found</p>
        <h1 className="mt-6 text-4xl font-semibold">Oops — this page doesn’t exist.</h1>
        <p className="mt-4 text-slate-400">Return home or explore the property listings to continue your journey.</p>
        <Link href="/" className="mt-8 inline-flex rounded-3xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Back to homepage
        </Link>
      </div>
    </main>
  );
}
