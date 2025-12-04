import { FC } from "react";
import { motion } from "framer-motion";
import Gallery from "@/components/Gallery/Gallery";

interface ProductGalleryProps {
  images: string[];
}

const ProductGallery: FC<ProductGalleryProps> = ({ images }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  return (
    <motion.div 
      variants={itemVariants}
      className="w-full lg:w-1/2 lg:sticky lg:top-8 lg:self-start"
    >
      <div className="!bg-transparent rounded-2xl">
        <Gallery images={images} />
      </div>
    </motion.div>
  );
};

export default ProductGallery;