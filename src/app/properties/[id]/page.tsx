import { notFound } from "next/navigation";
import { getPropertyById, properties } from "@/data/properties";
import PropertyDetails from "@/components/PropertyDetails";

// ✅ Static params
export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }));
}

// ✅ Metadata — params is now a Promise in Next.js 15+
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    return {
      title: "Property not found — Reside",
      description: "The property you are looking for could not be found.",
    };
  }

  return {
    title: `${property.title} — Reside`,
    description: property.description,
  };
}

// ✅ Page — params is now a Promise in Next.js 15+
export default async function PropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const property = getPropertyById(id);

  if (!property) {
    notFound();
  }

  return <PropertyDetails property={property} />;
}
