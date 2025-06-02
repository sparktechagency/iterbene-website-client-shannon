"use client";
import Image from "next/image";
import VideoCard from "../../UserProfilePage/UserVideos/VideoCard";
import { IMedia } from "@/types/post.types";
interface PostContentRenderProps {
  data: IMedia[];
}

const PostContentRender = ({ data }: PostContentRenderProps) => {
  const mediaCount = data?.length;

  // Single media item
  if (mediaCount === 1) {
    const media = data[0];
    return (
      <div className="w-full mt-3">
        {media.mediaType === "image" ? (
          <Image
              src={media?.mediaUrl}
              alt={`Post media`}
              width={400}
              height={350}
              className="w-full object-contain cursor-pointer rounded-md"
            />
        ) : (
          <VideoCard url={media?.mediaUrl} className="w-full h-[350px]" />
        )}
      </div>
    );
  }

  // Two media items
  if (mediaCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        {data.map((media, index) => (
          <div key={index} className="aspect-square">
            {media?.mediaType === "image" ? (
              <Image
                src={media?.mediaUrl}
                alt="Post media"
                width={400}
                height={350}
                className="w-full h-[350px]  rounded-xl cursor-pointer"
              />
            ) : (
              <VideoCard url={media?.mediaUrl} className="w-full h-[350px]" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Three media items
  if (mediaCount === 3) {
    return (
      <div className="grid grid-cols-2 gap-3 mt-3">
        <div className="col-span-full">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={350}
              className="w-full h-[350px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0]?.mediaUrl} className="h-[350px]" />
          )}
        </div>
        <div className="col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={260}
              className="w-full h-[260px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1]?.mediaUrl} className="h-[260px]" />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={260}
              className="w-full h-[260px] object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} />
          )}
        </div>
      </div>
    );
  }
  // Four media items
  if (mediaCount === 4) {
    return (
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="row-span-2 col-span-1">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={800}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0]?.mediaUrl} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1]?.mediaUrl} />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} />
          )}
        </div>
        <div className="col-span-1">
          {data[3]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} />
          )}
        </div>
      </div>
    );
  }
  // Four media items ++
  if (mediaCount > 4) {
    return (
      <div className="grid grid-cols-3 gap-3 mt-3">
        <div className="row-span-2 col-span-1">
          {data[0]?.mediaType === "image" ? (
            <Image
              src={data[0]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0]?.mediaUrl} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1]?.mediaUrl} />
          )}
        </div>
        <div className="col-span-1">
          {data[2]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} />
          )}
        </div>
        <div className="col-span-1 relative">
          {data[3]?.mediaType === "image" ? (
            <Image
              src={data[2]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2]?.mediaUrl} />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-xl">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-3xl">
              {mediaCount}+
            </span>
          </div>
        </div>
      </div>
    );
  }
};

export default PostContentRender;


// "use client";
// import Image from "next/image";
// import { useState, useRef, useCallback, useEffect } from "react";
// import { useVideoContext } from "@/contexts/VideoContext";
// import { IMedia } from "@/types/post.types";
// import VideoCard, {
//   VideoCardRef,
// } from "../../UserProfilePage/UserVideos/VideoCard";

// interface PostContentRenderProps {
//   data?: IMedia[];
//   shouldAutoplay?: boolean;
// }

// // Function to extract dominant color from image
// const getImageDominantColor = (img: HTMLImageElement): Promise<string> => {
//   return new Promise((resolve) => {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d");

//     if (!ctx) {
//       resolve("#f3f4f6"); // Fallback color
//       return;
//     }

//     // Limit canvas size for performance
//     const maxSize = 100;
//     const scale = Math.min(maxSize / img.width, maxSize / img.height, 1);
//     canvas.width = img.width * scale;
//     canvas.height = img.height * scale;

//     ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

//     try {
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       let r = 0,
//         g = 0,
//         b = 0;
//       let pixelCount = 0;

//       // Sample every 5th pixel
//       for (let i = 0; i < data.length; i += 20) {
//         r += data[i];
//         g += data[i + 1];
//         b += data[i + 2];
//         pixelCount++;
//       }

//       r = Math.floor(r / pixelCount);
//       g = Math.floor(g / pixelCount);
//       b = Math.floor(b / pixelCount);

//       // Make the color slightly muted
//       const darkenFactor = 0.8;
//       r = Math.floor(r * darkenFactor);
//       g = Math.floor(g * darkenFactor);
//       b = Math.floor(b * darkenFactor);
//       resolve(`rgb(${r}, ${g}, ${b})`);
//     } catch {
//       resolve("#f3f4f6"); // Fallback color
//     }
//   });
// };

// interface SmartImageProps {
//   src: string;
//   alt: string;
//   className?: string;
//   containerHeight?: string;
// }

// const SmartImage = ({
//   src,
//   alt,
//   className = "",
//   containerHeight = "350px",
// }: SmartImageProps) => {
//   const [bgColor, setBgColor] = useState("#f3f4f6");
//   const [imageLoaded, setImageLoaded] = useState(false);
//   const [imageError, setImageError] = useState(false);
//   const imgRef = useRef<HTMLImageElement>(null);

//   const handleImageLoad = useCallback(async () => {
//     if (imgRef.current) {
//       try {
//         const dominantColor = await getImageDominantColor(imgRef.current);
//         setBgColor(dominantColor);
//         setImageLoaded(true);
//       } catch (error) {
//         console.log("Error extracting color:", error);
//         setImageLoaded(true); // Mark as loaded even if color extraction fails
//       }
//     }
//   }, []);

//   const handleImageError = () => {
//     setImageError(true);
//     setImageLoaded(true); // Mark as loaded to avoid infinite loading state
//   };

//   if (imageError) {
//     return (
//       <div
//         className={`relative w-full rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
//         style={{ height: containerHeight }}
//       >
//         <span className="text-gray-500">Image failed to load</span>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`relative w-full rounded-xl overflow-hidden ${className}`}
//       style={{
//         height: containerHeight,
//         backgroundColor: imageLoaded ? bgColor : "#f3f4f6",
//         transition: "background-color 0.3s ease",
//       }}
//     >
//       <Image
//         ref={imgRef}
//         src={src}
//         alt={alt}
//         fill
//         className="object-contain cursor-pointer transition-opacity duration-300"
//         style={{ opacity: imageLoaded ? 1 : 0.8 }}
//         sizes="(max-width: 640px) 100vw, 50vw"
//         onLoad={handleImageLoad}
//         onError={handleImageError}
//         crossOrigin="anonymous"
//       />
//     </div>
//   );
// };

// const PostContentRender = ({
//   data = [],
//   shouldAutoplay = false,
// }: PostContentRenderProps) => {
//   const mediaCount = data.length;
//   const videoRefs = useRef<{ [key: string]: VideoCardRef }>({});
//   const { currentPlayingVideo, setCurrentPlayingVideo } = useVideoContext();

//   // Cleanup video refs when data changes
//   useEffect(() => {
//     return () => {
//       Object.values(videoRefs.current).forEach((ref) => {
//         if (ref && ref.isPlaying) {
//           ref.pause();
//         }
//       });
//       videoRefs.current = {};
//     };
//   }, [data]);

//   const handleVideoPlayStateChange = (isPlaying: boolean, videoUrl: string) => {
//     if (isPlaying) {
//       if (currentPlayingVideo && currentPlayingVideo !== videoUrl) {
//         Object.values(videoRefs.current).forEach((ref) => {
//           if (ref && ref.isPlaying) {
//             ref.pause();
//           }
//         });
//       }
//       setCurrentPlayingVideo(videoUrl);
//     } else if (currentPlayingVideo === videoUrl) {
//       setCurrentPlayingVideo(null);
//     }
//   };

//   const renderMedia = (
//     media: IMedia,
//     className: string,
//     containerHeight: string = "350px"
//   ) => {
//     if (!media.mediaUrl) {
//       return (
//         <div
//           className={`relative w-full rounded-xl overflow-hidden bg-gray-200 flex items-center justify-center ${className}`}
//           style={{ height: containerHeight }}
//         >
//           <span className="text-gray-500">Media not available</span>
//         </div>
//       );
//     }

//     if (media.mediaType === "image") {
//       return (
//         <SmartImage
//           src={media.mediaUrl}
//           alt="Post media"
//           className={className}
//           containerHeight={containerHeight}
//         />
//       );
//     } else if (media.mediaType === "video") {
//       return (
//         <VideoCard
//           ref={(ref) => {
//             if (ref && media.mediaUrl) {
//               videoRefs.current[media.mediaUrl] = ref;
//             }
//           }}
//           url={media.mediaUrl}
//           className={className}
//           autoplay={shouldAutoplay}
//           onPlayStateChange={handleVideoPlayStateChange}
//         />
//       );
//     }
//     return null;
//   };

//   if (mediaCount === 0) {
//     return null;
//   }

//   // Single media item
//   if (mediaCount === 1) {
//     const media = data[0];
//     return (
//       <div className="w-full mt-3">
//         {renderMedia(media, "w-full h-[350px]", "350px")}
//       </div>
//     );
//   }

//   // Two media items
//   if (mediaCount === 2) {
//     return (
//       <div className="grid grid-cols-2 gap-4 mt-3">
//         {data.map((media, index) => (
//           <div key={index}>
//             {renderMedia(media, "w-full h-[350px]", "350px")}
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Three media items
//   if (mediaCount === 3) {
//     return (
//       <div className="grid grid-cols-2 gap-4 mt-3">
//         <div className="col-span-full">
//           {renderMedia(data[0], "h-[350px]", "350px")}
//         </div>
//         <div className="col-span-1">
//           {renderMedia(data[1], "h-[260px]", "260px")}
//         </div>
//         <div className="col-span-1">
//           {renderMedia(data[2], "h-[260px]", "260px")}
//         </div>
//       </div>
//     );
//   }

//   // Four media items
//   if (mediaCount === 4) {
//     return (
//       <div className="grid grid-cols-3 gap-4 mt-3">
//         <div className="row-span-2 col-span-1">
//           {renderMedia(data[0], "h-full", "100%")}
//         </div>
//         <div className="row-span-2 col-span-1">
//           {renderMedia(data[1], "h-full", "100%")}
//         </div>
//         <div className="col-span-1">
//           {renderMedia(data[2], "h-full", "100%")}
//         </div>
//         <div className="col-span-1">
//           {renderMedia(data[3], "h-full", "100%")}
//         </div>
//       </div>
//     );
//   }

//   // More than four media items
//   if (mediaCount > 4) {
//     return (
//       <div className="grid grid-cols-3 gap-4 mt-3">
//         <div className="row-span-2 col-span-1">
//           {renderMedia(data[0], "h-full", "100%")}
//         </div>
//         <div className="row-span-2 col-span-1">
//           {renderMedia(data[1], "h-full", "100%")}
//         </div>
//         <div className="col-span-1">
//           {renderMedia(data[2], "h-full", "100%")}
//         </div>
//         <div className="col-span-1 relative">
//           {renderMedia(data[3], "h-full", "100%")}
//           <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center">
//             <span className="text-white text-xl md:text-3xl font-semibold">
//               +{mediaCount - 4}
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return null;
// };

// export default PostContentRender;
