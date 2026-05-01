export default function TestimonialCard({
  name,
  role,
  quote,
  location,
}: {
  name: string;
  role: string;
  quote: string;
  location: string;
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-slate-950/80 p-7 shadow-2xl shadow-slate-950/30 backdrop-blur-xl">
      <p className="text-lg leading-8 text-slate-100">“{quote}”</p>
      <div className="mt-6 border-t border-white/10 pt-5 text-sm text-slate-400">
        <p className="font-semibold text-white">{name}</p>
        <p>{role} • {location}</p>
      </div>
    </article>
  );
}
