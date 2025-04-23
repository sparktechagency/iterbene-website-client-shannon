"use client";
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
          <div className="relative w-full h-56 md:h-[500px] rounded-md overflow-hidden">
            <Image
              src={media.url}
              alt={`Post media`}
              fill
              className="object-cover cursor-pointer"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : (
          <VideoCard url={media.url} className="w-full h-[400px]" />
        )}
      </div>
    );
  }

  // Two media items
  if (mediaCount === 2) {
    return (
      <div
        className="grid grid-cols-2 gap-4 mt-3"
        onClick={handleContainerClick}
      >
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
                <VideoCard url={media.url} className="w-full h-[360px]" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Three media items
  if (mediaCount === 3) {
    return (
      <div
        className="grid grid-cols-2 gap-4 mt-3"
        onClick={handleContainerClick}
      >
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
            <VideoCard url={data[0].url} />
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
            <VideoCard url={data[1].url} className="h-[260px]" />
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
            <VideoCard url={data[2].url} />
          )}
        </div>
      </div>
    );
  }
  // Four media items
  if (mediaCount === 4) {
    return (
      <div
        className="grid grid-cols-3 gap-4 mt-3"
        onClick={handleContainerClick}
      >
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
            <VideoCard url={data[0].url} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1].type === "photo" ? (
            <Image
              src={data[1].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1].url} />
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
            <VideoCard url={data[2].url} />
          )}
        </div>
        <div className="col-span-1">
          {data[3].type === "photo" ? (
            <Image
              src={data[2].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2].url} />
          )}
        </div>
      </div>
    );
  }
  // Four media items ++
  if (mediaCount > 4) {
    return (
      <div
        className="grid grid-cols-3 gap-4 mt-3"
        onClick={handleContainerClick}
      >
        <div className="row-span-2 col-span-1">
          {data[0].type === "photo" ? (
            <Image
              src={data[0].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[0].url} />
          )}
        </div>
        <div className="row-span-2 col-span-1">
          {data[1].type === "photo" ? (
            <Image
              src={data[1].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[1].url} />
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
            <VideoCard url={data[2].url} />
          )}
        </div>
        <div className="col-span-1 relative">
          {data[3].type === "photo" ? (
            <Image
              src={data[2].url}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
            />
          ) : (
            <VideoCard url={data[2].url} />
          )}
          <div className="absolute top-0 left-0 w-full h-full bg-black/30 rounded-xl">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-xl md:text-3xl">{mediaCount}+</span>
          </div>
        </div>
      </div>
    );
  }
};

export default PostContentRender;
