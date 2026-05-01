import Image from "next/image";
import { motion } from "framer-motion";

export default function PropertyGallery({ images }: { images: string[] }) {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
      {images.slice(0, 4).map((image, index) => (
        <motion.div
          key={image}
          whileHover={{ scale: 1.02 }}
          className={`overflow-hidden rounded-[28px] ${index === 0 ? "lg:row-span-2" : ""}`}
        >
          <Image
            src={image}
            alt={`Property image ${index + 1}`}
            width={1200}
            height={800}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        </motion.div>
      ))}
    </div>
  );
}
