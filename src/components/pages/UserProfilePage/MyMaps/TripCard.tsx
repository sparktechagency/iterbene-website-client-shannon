"use client";
import ITrip from "@/types/trip.types";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import VideoCard from "../UserVideos/VideoCard";

const TripCard = ({ trip }: { trip: ITrip }) => {
  const hasMultipleMedia = trip?.media && trip.media.length > 1;

  return (
    <div className="w-full h-full max-h-96 bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Media Section */}
      <div className="relative mb-4">
        {hasMultipleMedia ? (
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={10}
              slidesPerView={1}
              pagination={{
                clickable: true,
              }}
              className="w-full h-[250px] rounded-xl overflow-hidden"
            >
              {trip.media.map((media, index) => (
                <SwiperSlide key={index}>
                  {media.mediaType === "image" ? (
                    <Image
                      src={media.mediaUrl}
                      alt={`Trip media ${index + 1}`}
                      width={300}
                      height={250}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <VideoCard
                      url={media.mediaUrl}
                      className="w-full h-full rounded-xl"
                    />
                  )}
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          // Single media item
          <div className="w-full h-[250px] rounded-xl overflow-hidden">
            {trip?.media[0]?.mediaType === "image" ? (
              <Image
                src={trip?.media[0]?.mediaUrl}
                alt="Trip media"
                width={300}
                height={250}
                className="w-full h-full object-cover rounded-xl"
              />
            ) : trip?.media[0]?.mediaType === "video" ? (
              <VideoCard
                url={trip?.media[0]?.mediaUrl}
                className="w-full h-full rounded-xl"
              />
            ) : null}
          </div>
        )}
      </div>

      {/* Trip Information */}
      <div className="flex gap-3 justify-between items-start flex-grow">
        <div className="space-y-1 flex-grow">
          <h3 className="text-xl font-medium text-gray-800 line-clamp-2">
            {trip?.visitedLocationName}
          </h3>
          <p className="text-base text-gray-400">{trip?.distance} miles away</p>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
