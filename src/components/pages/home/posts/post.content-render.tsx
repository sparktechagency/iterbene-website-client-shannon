"use client";
import CustomVideoPlayer from "@/components/custom/custom-video-player";
import Image from "next/image";
import VideoCard from "../../user-profile/user-video-tab/video-card";

interface Media {
  type: "photo" | "video";
  url: string;
}

interface PostContentRenderProps {
  setShowDescription: (value: boolean) => void;
  data: Media[];
}

const PostContentRender = ({
  setShowDescription,
  data,
}: PostContentRenderProps) => {
  if (!data || data.length === 0) return null;

  const mediaCount = data.length;
  const mediaToShow = data.slice(0, 4); // Only show first 4 items

  // Handle click on the container
  const handleContainerClick = () => {
    setShowDescription(true);
  };

  // Single media item
  if (mediaCount === 1) {
    const media = data[0];
    return (
      <div className="w-full mt-3" onClick={handleContainerClick}>
        {media.type === "photo" ? (
          <Image
            src={media.url}
            alt="Post media"
            width={800}
            height={600}
            className="w-full h-auto max-h-[600px] object-contain rounded-md cursor-pointer"
            layout="responsive"
          />
        ) : (
          <VideoCard url={media.url} />
        )}
      </div>
    );
  }

  // Two media items
  if (mediaCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-3" onClick={handleContainerClick}>
        {data.map((media, index) => (
          <div key={index} className="aspect-square">
            {media.type === "photo" ? (
              <Image
                src={media.url}
                alt="Post media"
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
            ) : (
              <CustomVideoPlayer url={media.url} />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Three media items
  if (mediaCount === 3) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-3" onClick={handleContainerClick}>
        <div className="row-span-2 col-span-1">
          {data[0].type === "photo" ? (
            <Image
              src={data[0].url}
              alt="Post media"
              width={400}
              height={800}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <CustomVideoPlayer url={data[0].url} />
          )}
        </div>
        <div className="col-span-1">
          {data[1].type === "photo" ? (
            <Image
              src={data[1].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <CustomVideoPlayer url={data[1].url} />
          )}
        </div>
        <div className="col-span-1">
          {data[2].type === "photo" ? (
            <Image
              src={data[2].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <CustomVideoPlayer url={data[2].url} />
          )}
        </div>
      </div>
    );
  }

  // Four or more media items
  return (
    <div className="grid grid-cols-2 gap-1 mt-3" onClick={handleContainerClick}>
      {mediaToShow.map((media, index) => (
        <div key={index} className="aspect-square relative">
          {media.type === "photo" ? (
            <Image
              src={media.url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-md cursor-pointer"
            />
          ) : (
            <CustomVideoPlayer url={media.url} />
          )}
        </div>
      ))}
    </div>
  );
};

export default PostContentRender;