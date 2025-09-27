import { useCallback, useRef, useState } from "react";
import getImageDominantColor from "./getImageDominantColor";
import Image from "next/image";
import toast from "react-hot-toast";

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
}

const SmartImage = ({ src, alt, className = "" }: SmartImageProps) => {
  const [bgColor, setBgColor] = useState("#f3f4f6");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = useCallback(async () => {
    if (imgRef.current) {
      try {
        const dominantColor = await getImageDominantColor(imgRef.current);
        setBgColor(dominantColor);
        setImageLoaded(true);
      } catch {
        toast.error("Failed to extract image color");
        setImageLoaded(true); // Mark as loaded even if color extraction fails
      }
    }
  }, []);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true); // Mark as loaded to avoid infinite loading state
  };

  if (imageError) {
    return (
      <div
        className={`relative w-full  rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
        // style={{ height: containerHeight }}
      >
        <span className="text-gray-500">Image failed to load</span>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden ${className}`}
      style={{
        backgroundColor: imageLoaded ? bgColor : "#f3f4f6",
        transition: "background-color 0.3s ease",
      }}
    >
      <Image
        ref={imgRef}
        src={src}
        alt={alt}
        fill
        className="object-contain cursor-pointer transition-opacity duration-300"
        style={{ opacity: imageLoaded ? 1 : 0.8 }}
        sizes="(max-width: 640px) 100vw, 50vw"
        onLoad={handleImageLoad}
        onError={handleImageError}
        crossOrigin="anonymous"
      />
    </div>
  );
};
export default SmartImage;
