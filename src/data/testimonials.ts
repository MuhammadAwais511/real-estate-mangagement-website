export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  location: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Mia Chen",
    role: "Startup Founder",
    quote:
      "The team helped me find the perfect modern home and the booking flow felt premium. Every detail is smooth and intuitive.",
    location: "Austin, TX",
  },
  {
    id: "t2",
    name: "Julian Park",
    role: "Tech Executive",
    quote:
      "Favorites, recent views, and dashboard history make property planning easy. The design feels polished and professional.",
    location: "San Francisco, CA",
  },
  {
    id: "t3",
    name: "Sofia Ramirez",
    role: "Real Estate Investor",
    quote:
      "The presentation is premium, and the detail pages made the booking experience feel seamless. I’d use this again immediately.",
    location: "Miami, FL",
  },
  {
    id: "t4",
    name: "Noah Bennett",
    role: "Creative Director",
    quote:
      "The dashboard layout is thoughtful, and the responsive experience works beautifully across devices. It feels like a real product.",
    location: "New York, NY",
  },
];
