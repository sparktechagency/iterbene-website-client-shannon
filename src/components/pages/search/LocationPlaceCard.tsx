"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { IVisitedPlace } from "@/types/search.types";

const LocationPlaceCard = ({ place }: { place: IVisitedPlace }) => {
  const hasMultipleImages = place?.imageUrls && place?.imageUrls?.length > 1;
  return (
    <div className="w-full h-full max-h-[400px] bg-white rounded-xl p-4 flex flex-col border border-[#E7E8EC] hover:shadow-xl transition-all duration-300 cursor-pointer">
      {/* Media Section */}
      <div className="relative mb-4">
        {hasMultipleImages ? (
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
              {place?.imageUrls?.map((media, index) => (
                <SwiperSlide key={index}>
                  <Image
                    src={media}
                    alt={`Trip media ${index + 1}`}
                    width={300}
                    height={250}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        ) : (
          // Single media item
          <div className="w-full h-[250px] rounded-xl overflow-hidden">
            <Image
              src={place?.imageUrls[0]}
              alt="Trip media"
              width={300}
              height={250}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
        )}
      </div>
      {/* Trip Information */}
      <div className="flex gap-3 justify-between items-start flex-grow">
        <div className="space-y-1 flex-grow">
          <div className="flex justify-between items-center gap-3">
            <h3 className="text-lg font-medium text-gray-800 line-clamp-2">
              {place?.placeName}
            </h3>
            {place.rating && (
              <h1 className="flex items-center gap-1">
                <FaStar className="text-primary" />
                <h1>{place.rating}</h1>
              </h1>
            )}
          </div>

          {/* direaction */}
          <Link href={place?.directionsUrl} target="_blank">
            <button className="bg-secondary px-5 py-2 rounded-xl text-white cursor-pointer mt-2">
              Direaction
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LocationPlaceCard;
