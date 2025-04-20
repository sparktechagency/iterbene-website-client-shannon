"use client";
import Image from "next/image";
import { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MyPhotos = () => {
  // State for controlling the lightbox
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Real images from Unsplash (scenic landscapes with ruins, lakes, and mountains)
  const photos = [
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 1",
    },
    {
      src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 2",
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 3",
    },
    {
      src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 4",
    },
    {
      src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 5",
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 6",
    },
    {
      src: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 7",
    },
    {
      src: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      alt: "Photo 8",
    },
  ];

  return (
    <div className="w-full bg-white p-5 rounded-2xl">
      {/* Header with Title */}
      <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
        <h2 className="text-lg font-semibold text-gray-800">Photos</h2>
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={index}
            className="w-full h-56 md:h-64 lg:h-96 xl:h-[450px] relative cursor-pointer"
            onClick={() => {
              setPhotoIndex(index);
              setOpen(true);
            }}
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover rounded-xl"
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 25vw, 25vw"
              priority={index < 4} // Prioritize loading for the first row
            />
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={photos.map((photo) => ({ src: photo.src, alt: photo.alt }))}
        index={photoIndex}
        on={{ view: ({ index }) => setPhotoIndex(index) }}
      />
    </div>
  );
};

export default MyPhotos;