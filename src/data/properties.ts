export type PropertyType = "Apartment" | "House" | "Office" | "Villa" | "Studio";

export type Property = {
  id: string;
  title: string;
  location: string;
  type: PropertyType;
  category: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  features: string[];
  images: string[];
  tags: string[];
  rating: number;
  available: boolean;
};

export const properties: Property[] = [
  {
    id: "lahore-riverside-apartment",
    title: "Lahore Riverside Apartment",
    location: "Lahore, Punjab",
    type: "Apartment",
    category: "Apartment",
    price: 1850000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1320,
    description:
      "Luxury apartment on the Lahore riverfront with contemporary interiors, premium fixtures, and secure residential amenities.",
    features: ["River view", "Community gym", "Concierge service", "Secure parking"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Riverside", "Modern", "Featured"],
    rating: 4.9,
    available: true,
  },
  {
    id: "islamabad-modern-studio",
    title: "Islamabad Modern Studio",
    location: "Islamabad, ICT",
    type: "Studio",
    category: "Apartment",
    price: 1090000,
    bedrooms: 1,
    bathrooms: 1,
    area: 680,
    description:
      "Contemporary studio near Blue Area with lots of natural light, smart storage, and stylish finishes for urban living.",
    features: ["24/7 security", "Walk-in closet", "City views", "Smart lighting"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Studio", "City life", "Minimal"],
    rating: 4.8,
    available: true,
  },
  {
    id: "karachi-beachfront-condo",
    title: "Karachi Beachfront Condo",
    location: "Karachi, Sindh",
    type: "Apartment",
    category: "Apartment",
    price: 2150000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1400,
    description:
      "Premium beachfront condo with ocean breezes, private balcony, and access to resort-style amenities in Clifton.",
    features: ["Beach access", "Clubhouse", "Private elevator", "Secure lobby"],
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418985-1a1126f9f89b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Beachfront", "Luxury", "Featured"],
    rating: 4.8,
    available: true,
  },
  {
    id: "lahore-duplex-villa",
    title: "Lahore Duplex Villa",
    location: "Lahore, Punjab",
    type: "House",
    category: "House",
    price: 2950000,
    bedrooms: 4,
    bathrooms: 4,
    area: 2900,
    description:
      "Spacious duplex villa with landscaped courtyard, premium finishes, and separate family and entertaining zones.",
    features: ["Private garden", "Chef kitchen", "Home office", "Garage"],
    images: [
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418985-1a1126f9f89b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Family", "Garden", "Premium"],
    rating: 4.7,
    available: true,
  },
  {
    id: "faisalabad-office-suite",
    title: "Faisalabad Office Suite",
    location: "Faisalabad, Punjab",
    type: "Office",
    category: "Office",
    price: 1320000,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
    description:
      "Professional office suite with flexible layout, high-speed internet readiness, and modern conference space.",
    features: ["Conference rooms", "Reception area", "High-speed internet", "Parking"],
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1557771528-6bd528b3e1c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418985-1a1126f9f89b?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Office", "Modern", "Professional"],
    rating: 4.9,
    available: true,
  },
  {
    id: "islamabad-hillside-family-home",
    title: "Islamabad Hillside Family Home",
    location: "Islamabad, ICT",
    type: "House",
    category: "House",
    price: 4490000,
    bedrooms: 5,
    bathrooms: 5,
    area: 4800,
    description:
      "Estate-style home near the Margalla Hills with premium finishes, private pool, and multiple entertaining zones.",
    features: ["Pool", "Guest house", "Home theater", "Private elevator"],
    images: [
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Estate", "Luxury", "Hill view"],
    rating: 5,
    available: true,
  },
  {
    id: "karachi-suburban-townhouse",
    title: "Karachi Suburban Townhouse",
    location: "Karachi, Sindh",
    type: "House",
    category: "House",
    price: 1295000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1850,
    description:
      "Comfortable townhouse in a secure gated community with modern kitchen, courtyard, and easy access to local amenities.",
    features: ["Private garage", "Patio", "Community park", "Energy efficient"],
    images: [
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418985-1a1126f9f89b?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Townhouse", "Community", "Comfort"],
    rating: 4.5,
    available: true,
  },
  {
    id: "multan-garden-house",
    title: "Multan Garden House",
    location: "Multan, Punjab",
    type: "House",
    category: "House",
    price: 980000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1520,
    description:
      "Charming family house with a private garden, modern kitchen, and a quiet residential street close to city conveniences.",
    features: ["Private yard", "Quiet street", "Chef kitchen", "High ceilings"],
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Garden", "Charming", "Comfort"],
    rating: 4.7,
    available: true,
  },
  {
    id: "karachi-new-office-tower",
    title: "Karachi New Office Tower",
    location: "Karachi, Sindh",
    type: "Office",
    category: "Office",
    price: 1790000,
    bedrooms: 0,
    bathrooms: 2,
    area: 2100,
    description:
      "Contemporary office space in a landmark tower with coworking lounges, private meeting rooms, and premium client amenities.",
    features: ["Lobby access", "Meeting facilities", "High-speed internet", "City skyline"],
    images: [
      "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1557771528-6bd528b3e1c3?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1533106418985-1a1126f9f89b?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Office", "Premium", "Downtown"],
    rating: 4.6,
    available: true,
  },
  {
    id: "isb-hillside-studio",
    title: "Islamabad Hillside Studio",
    location: "Islamabad, ICT",
    type: "Studio",
    category: "Apartment",
    price: 830000,
    bedrooms: 1,
    bathrooms: 1,
    area: 720,
    description:
      "Stylish hillside studio with panoramic Margalla views, efficient layout, and access to contemporary shared amenities.",
    features: ["Hill views", "Secure entry", "Fitness center", "Private balcony"],
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80",
    ],
    tags: ["Studio", "Hill view", "Compact"],
    rating: 4.7,
    available: true,
  },
];

export function getProperties() {
  return properties;
}

export function getPropertyById(id: string) {
  return properties.find((property) => property.id === id);
}

export const featuredProperties = properties.slice(0, 4);

export const propertyTypes = ["All", "Apartment", "House", "Office", "Villa", "Studio"] as const;
