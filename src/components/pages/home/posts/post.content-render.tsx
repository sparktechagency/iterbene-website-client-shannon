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
          <div className="relative w-full h-56 md:h-[500px] rounded-md overflow-hidden">
            <Image
              src={media?.mediaUrl}
              alt={`Post media`}
              fill
              className="object-cover cursor-pointer"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        ) : (
          <VideoCard url={media?.mediaUrl} className="w-full h-[400px]" />
        )}
      </div>
    );
  }

  // Two media items
  if (mediaCount === 2) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-3">
        {data.map((media, index) => (
          <div key={index} className="aspect-square">
            {media?.mediaType === "image" ? (
              <Image
                src={media?.mediaUrl}
                alt="Post media"
                width={400}
                height={400}
                className="w-full h-full object-cover rounded-xl cursor-pointer"
              />
            ) : (
              <VideoCard url={media?.mediaUrl} className="w-full h-[360px]" />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Three media items
  if (mediaCount === 3) {
    return (
      <div className="grid grid-cols-2 gap-4 mt-3">
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
        <div className="col-span-1">
          {data[1]?.mediaType === "image" ? (
            <Image
              src={data[1]?.mediaUrl}
              alt="Post media"
              width={400}
              height={400}
              className="w-full h-full object-cover rounded-xl cursor-pointer"
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
  // Four media items
  if (mediaCount === 4) {
    return (
      <div className="grid grid-cols-3 gap-4 mt-3">
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
      <div className="grid grid-cols-3 gap-4 mt-3">
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
