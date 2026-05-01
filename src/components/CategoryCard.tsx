import { motion } from "framer-motion";

export default function CategoryCard({
  title,
  subtitle,
  accent,
}: {
  title: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group rounded-4xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-slate-950/20 transition"
    >
      <div className={`inline-flex rounded-2xl px-4 py-2 text-sm font-semibold ${accent}`}>
        {title}
      </div>
      <p className="mt-6 text-lg font-semibold text-white">{subtitle}</p>
      <p className="mt-3 text-sm leading-6 text-slate-400">Curated listings from modern homes to premium offices.</p>
    </motion.article>
  );
}
