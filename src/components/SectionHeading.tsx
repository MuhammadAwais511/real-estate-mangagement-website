export default function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Featured</p>
      <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      <p className="max-w-2xl text-slate-400">{description}</p>
    </div>
  );
}
