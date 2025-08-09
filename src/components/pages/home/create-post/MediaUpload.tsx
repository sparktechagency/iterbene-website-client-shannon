"use client";

import React, { useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";

export interface FilePreview {
  name: string;
  preview: string;
  type: string;
  file?: File;
}

interface MediaUploadProps {
  media: File[];
  mediaPreviews: FilePreview[];
  existingMedia: FilePreview[];
  onMediaChange: (media: File[], previews: FilePreview[]) => void;
  onExistingMediaChange: (media: FilePreview[]) => void;
  maxFiles?: number;
  maxImageSize?: number; // in MB
  maxVideoSize?: number; // in MB  
  maxVideoDuration?: number; // in seconds
}

const MediaUpload: React.FC<MediaUploadProps> = ({
  media,
  mediaPreviews,
  existingMedia,
  onMediaChange,
  onExistingMediaChange,
  maxFiles = 10,
  maxImageSize = 5,
  maxVideoSize = 10,
  maxVideoDuration = 60,
}) => {
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const swiperRef = useRef<SwiperClass>(null);

  const allMediaPreviews = [...existingMedia, ...mediaPreviews];

  // Get video duration helper
  const getVideoDuration = useCallback((file: File): Promise<number> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        resolve(video.duration);
      };
      video.onerror = () => {
        resolve(0); // If we can't get duration, assume it's valid
      };
      video.src = URL.createObjectURL(file);
    });
  }, []);

  // Validate file function
  const validateFile = useCallback(async (file: File): Promise<boolean> => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      toast.error(`File "${file.name}" is not a valid image or video file.`);
      return false;
    }

    // Check image size
    if (isImage && file.size > maxImageSize * 1024 * 1024) {
      toast.error(`Image "${file.name}" size should not exceed ${maxImageSize}MB.`);
      return false;
    }

    // Check video size and duration
    if (isVideo) {
      if (file.size > maxVideoSize * 1024 * 1024) {
        toast.error(`Video "${file.name}" size should not exceed ${maxVideoSize}MB.`);
        return false;
      }

      // Check video duration
      const duration = await getVideoDuration(file);
      if (duration > maxVideoDuration) {
        toast.error(`Video "${file.name}" duration should not exceed ${maxVideoDuration} seconds.`);
        return false;
      }
    }

    return true;
  }, [maxImageSize, maxVideoSize, maxVideoDuration, getVideoDuration]);

  // Handle media upload
  const handleMediaUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    
    // Check total file limit
    if (allMediaPreviews.length + newFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    const validFiles: File[] = [];
    const newPreviews: FilePreview[] = [];

    // Process each file
    for (const file of newFiles) {
      const isValid = await validateFile(file);
      if (!isValid) continue;

      validFiles.push(file);
      newPreviews.push({
        name: file.name,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "video",
        file: file,
      });
    }

    if (validFiles.length > 0) {
      onMediaChange([...media, ...validFiles], [...mediaPreviews, ...newPreviews]);
    }

    // Reset input
    if (e.target) {
      e.target.value = "";
    }
  }, [media, mediaPreviews, allMediaPreviews.length, maxFiles, validateFile, onMediaChange]);

  // Remove media handler
  const handleRemoveMedia = useCallback((index: number, isExisting: boolean) => {
    if (isExisting) {
      const newExistingMedia = existingMedia.filter((_, i) => i !== index);
      onExistingMediaChange(newExistingMedia);
    } else {
      const actualIndex = index - existingMedia.length;
      const newMedia = media.filter((_, i) => i !== actualIndex);
      const newPreviews = mediaPreviews.filter((_, i) => i !== actualIndex);
      
      // Revoke URL for removed previews
      const removedPreview = mediaPreviews[actualIndex];
      if (removedPreview?.preview.startsWith('blob:')) {
        URL.revokeObjectURL(removedPreview.preview);
      }
      
      onMediaChange(newMedia, newPreviews);
    }
  }, [existingMedia, media, mediaPreviews, onMediaChange, onExistingMediaChange]);

  // Upload button component
  const UploadButton = (
    <button
      onClick={() => mediaInputRef.current?.click()}
      className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
      type="button"
    >
      <ImageIcon className={`w-6 h-6 ${allMediaPreviews.length > 0 ? 'text-primary' : 'text-gray-400'} hover:text-primary transition-colors`} />
    </button>
  );

  // Media preview component
  const MediaPreview = allMediaPreviews.length > 0 && (
    <div className="w-full px-6 relative">
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: false }}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        spaceBetween={10}
        slidesPerView={allMediaPreviews.length === 1 ? 1 : 2}
        className="w-full"
      >
        {allMediaPreviews.map((item, index) => (
          <SwiperSlide key={`${item.name}-${index}`}>
            <div className="relative group">
              {item.type.startsWith("image") ? (
                <Image
                  src={item.preview}
                  alt={item.name}
                  width={500}
                  height={500}
                  className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-lg"
                />
              ) : (
                <video
                  src={item.preview}
                  controls
                  className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-lg"
                />
              )}
              
              {/* Remove button */}
              <button
                onClick={() => handleRemoveMedia(index, !item.file)}
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
                type="button"
              >
                <X className="w-5 h-5" />
              </button>
              
              {/* File info overlay */}
              <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.type === 'image' ? '📷' : '🎥'} {item.name}
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      {allMediaPreviews.length > 2 && (
        <>
          <button
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute top-1/2 left-7 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 hover:bg-black/70 transition"
            aria-label="Previous slide"
            type="button"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute top-1/2 right-7 -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 hover:bg-black/70 transition"
            aria-label="Next slide"
            type="button"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <>
      {MediaPreview}
      
      {/* Hidden file input */}
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        ref={mediaInputRef}
        onChange={handleMediaUpload}
        className="hidden"
      />
      
      {/* Return upload button for external use */}
      {React.Children.only(
        React.cloneElement(UploadButton as React.ReactElement, {
          key: 'upload-button'
        })
      )}
    </>
  );
};

// Export upload button separately for use in parent component
export const MediaUploadButton: React.FC<{
  onClick: () => void;
  hasMedia: boolean;
}> = ({ onClick, hasMedia }) => (
  <button
    onClick={onClick}
    className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
    type="button"
  >
    <ImageIcon className={`w-6 h-6 ${hasMedia ? 'text-primary' : 'text-gray-400'} hover:text-primary transition-colors`} />
  </button>
);

export default MediaUpload;