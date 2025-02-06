import React from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import Image from "next/image";
import "./Gallery.css";

interface GalleryProps {
  images: string[];
}

const Gallery = ({ images }: GalleryProps) => {
  return (
    <div className="gallery-container">
      <Splide
        options={{
          type: "loop",
          perPage: 1,
          perMove: 1,
          autoplay: false,
          arrows: true,
          pagination: true,
          speed: 800
        }}
        className="splide"
      >
        {images.map((src, index) => (
          <SplideSlide key={src} className="splide__slide">
            <Image src={src} width={500} height={500} alt={`Image ${index + 1}`} className="responsive-image" />
          </SplideSlide>
        ))}
      </Splide>
    </div>
  );
};

export default Gallery;
