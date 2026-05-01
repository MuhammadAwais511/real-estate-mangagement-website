import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 px-6 py-10 text-slate-400 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl space-y-4">
          <h2 className="text-2xl font-semibold text-white">Reside</h2>
          <p className="max-w-xl leading-7 text-slate-400">
            Modern real estate for buyers, renters, and investors. Browse premium homes, offices, and curated property experiences.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Contact</p>
            <p>awaisdeveloper763@gmail.com</p>
            <p>0336 7359547</p>
            <p>Shah Nawaz Shar Goth C-37</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Explore</p>
            <Link href="/properties" className="block transition hover:text-white/90">
              Properties
            </Link>
            <Link href="/dashboard" className="block transition hover:text-white/90">
              Dashboard
            </Link>
          </div>
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Follow</p>
            <div className="flex flex-wrap gap-3 text-white/80">
              <a
                href="https://www.instagram.com/muhammad_awais_ali2/"
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-white/90"
              >
                Instagram
              </a>
              <a
                href="https://www.linkedin.com/in/awais-developer-683489372/"
                target="_blank"
                rel="noreferrer noopener"
                className="transition hover:text-white/90"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-slate-500">
        © 2026 Reside. Designed for curated property experiences.
      </div>
    </footer>
  );
}
