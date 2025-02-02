import React, { useState, useRef } from "react";
import "./Gallery.css";
import Image from "next/image";

interface GalleryProps {
  images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
  const [mainImage, setMainImage] = useState(images[0]);
  const thumbnailsRef = useRef<HTMLDivElement>(null);

  const handleSwipe = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!thumbnailsRef.current) return;

    const container = thumbnailsRef.current;
    const startX = e.touches[0].clientX;
    let lastX = startX;

    const handleTouchMove = (moveEvent: TouchEvent) => {
      const moveX = moveEvent.touches[0].clientX;
      const deltaX = lastX - moveX;
      lastX = moveX;

      container.scrollLeft += deltaX;
    };

    const handleTouchEnd = () => {
      // Clean up event listeners
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };

    // Attach touch move and end listeners
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
  };

  return (
    <div className="Gallery__wrapper">
      {/* Main image */}
      <div className="Gallery__main-image">
        <Image src={mainImage} width={500} height={500} alt="Main" className="Gallery__main-image-content" />
      </div>

      <div className="Gallery__thumbnails" ref={thumbnailsRef} onTouchStart={handleSwipe}>
        {images.map((image, index) => (
          <Image
            key={index}
            width={80}
            height={80}
            src={image}
            alt={`Thumbnail ${index + 1}`}
            className={`Gallery__thumbnail ${mainImage === image ? "Gallery__thumbnail--active" : ""}`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
};

export default Gallery;
