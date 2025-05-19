"use client";
import useUser from "@/hooks/useUser";
import {
  CalendarCheck,
  ChevronLeft,
  ChevronRight,
  Globe,
  Image as ImageIcon,
  Lock,
  MapPin,
  Search,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import ItineraryModal from "./ItineraryModal";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd";

// Interfaces
export interface Location {
  latitude: number;
  longitude: number;
}

export interface Activity {
  time: string;
  description: string;
  cost: number;
  rating: number;
}

export interface Day {
  dayNumber: number;
  locationName: string;
  location: Location;
  activities: Activity[];
}

export interface FilePreview {
  name: string;
  preview: string;
  type: string;
}

const CreatePost = () => {
  const user = useUser();
  // State for post content
  const [post, setPost] = useState<string>("");
  // State for location
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>("");
  // State for privacy
  const [privacy, setPrivacy] = useState<string>("public");
  const [showPrivacyPopup, setShowPrivacyPopup] = useState<boolean>(false);
  // State for media
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<FilePreview[]>([]);
  // State for itinerary
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  // Refs
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const locationPopupRef = useRef<HTMLDivElement>(null);
  const privacyPopupRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [post]);

  // Close popups on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationPopupRef.current &&
        !locationPopupRef.current.contains(event.target as Node)
      ) {
        setShowLocationPopup(false);
      }
      if (
        privacyPopupRef.current &&
        !privacyPopupRef.current.contains(event.target as Node)
      ) {
        setShowPrivacyPopup(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle post input change
  const postChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };

  // Mock location search results (replace with real API in production)
  const mockLocations = [
    "Rome, Italy",
    "Colosseum, Rome, Italy",
    "Pantheon, Rome, Italy",
    "Piazza Navona, Rome, Italy",
  ].filter((location) =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Handle location selection
  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setShowLocationPopup(false);
    setLocationSearch("");
  };

  // Remove location
  const handleRemoveLocation = () => {
    setSelectedLocation(null);
  };

  // Handle privacy selection
  const handlePrivacySelect = (option: string) => {
    setPrivacy(option);
    setShowPrivacyPopup(false);
  };

  // Handle media upload
  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map((file) => ({
        name: file.name,
        preview: URL.createObjectURL(file),
        type: file.type.startsWith("image/") ? "image" : "video",
      }));
      setMedia((prev) => [...prev, ...newFiles]);
      setMediaPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove media
  const handleRemoveMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
    setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // Fallback profile image
  const defaultProfileImage = "/default-profile.png";
  return (
    <section className="w-full bg-white rounded-xl">
      {/* Post Input Section */}
      <div className="w-full flex px-4 pt-4 pb-2 gap-3">
        {user?.profileImage ? (
          <Image
            src={user.profileImage}
            alt="User Profile"
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <Image
            src={defaultProfileImage}
            alt="Default Profile"
            width={50}
            height={50}
            className="size-[50px] rounded-full object-cover flex-shrink-0"
          />
        )}
        <textarea
          ref={textareaRef}
          placeholder={`What's new, ${user?.fullName || "User"}?`}
          value={post}
          onChange={postChangeHandler}
          className="w-full bg-transparent border-none text-justify mt-3 text-base focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
        />
        <button
          className={`w-[120px] h-[50px] ${
            post || media.length > 0
              ? "bg-secondary text-white"
              : "border border-[#9194A9] text-[#9194A9]"
          } rounded-xl`}
        >
          Post It!
        </button>
      </div>

      {/* Media Preview Section */}
      <div className="w-full px-6 relative">
        {mediaPreviews.length > 0 && (
          <>
            <Swiper
              modules={[Pagination]} // removed Navigation
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              pagination={{ clickable: false }}
              spaceBetween={10}
              slidesPerView={mediaPreviews.length === 1 ? 1 : 2}
              className="w-full"
            >
              {mediaPreviews.map((item, index) => (
                <SwiperSlide key={index}>
                  <div className="relative">
                    {item.type === "image" ? (
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
                    <button
                      onClick={() => handleRemoveMedia(index)}
                      className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom navigation buttons */}
            {mediaPreviews.length > 2 && (
              <>
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="absolute top-1/2 left-7 cursor-pointer -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 hover:bg-black/70 transition"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="absolute top-1/2 right-7 cursor-pointer -translate-y-1/2 bg-black/50 text-white rounded-full p-2 z-20 hover:bg-black/70 transition"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </>
        )}
      </div>

      {/* Additional Options Section */}
      {(post || media.length > 0 || selectedLocation) && (
        <div className="flex flex-col gap-4 mt-4 ">
          {/* Selected Location and Privacy Display */}
          <div className="flex items-center gap-4 px-4">
            <AnimatePresence>
              {selectedLocation && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5 text-primary" />
                  <span className="text-sm text-gray-700">
                    {selectedLocation}
                  </span>
                  <button
                    onClick={handleRemoveLocation}
                    className="text-[#9194A9] hover:text-red-500"
                    aria-label="Remove location"
                  >
                    <X className="size-4" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <span className="text-sm text-gray-700 capitalize">
                {privacy}
              </span>
            </div>
          </div>

          {/* Icons for Additional Functionalities */}
          <div className="flex items-center gap-5 bg-[#E7E8EC] px-4 py-1.5 rounded-b-xl">
            {/* Location Icon with Popup */}
            <div className="relative" ref={locationPopupRef}>
              <Tooltip title="Add a location" placement="bottom">
                <button
                  onClick={() => setShowLocationPopup(true)}
                  className="cursor-pointer"
                >
                  <MapPin
                    className={`w-6 h-6 mt-2 ${
                      selectedLocation ? "text-primary" : "text-[#9194A9]"
                    } hover:text-primary transition-colors`}
                  />
                </button>
              </Tooltip>
              <AnimatePresence>
                {showLocationPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-10 left-0 bg-white rounded-2xl shadow-xl p-5 w-80 z-20"
                  >
                    <div className="relative">
                      <input
                        type="text"
                        value={locationSearch}
                        onChange={(e) => setLocationSearch(e.target.value)}
                        placeholder="Search location..."
                        className="w-full px-4 py-2 border rounded-full border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <Search className="w-5 h-5 text-[#9194A9] absolute top-3 right-4" />
                    </div>
                    <div className="mt-4 max-h-40 overflow-y-auto">
                      {mockLocations.length > 0 ? (
                        mockLocations.map((location, index) => (
                          <div
                            key={index}
                            onClick={() => handleLocationSelect(location)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                          >
                            <MapPin className="size-5 text-[#9194A9]" />
                            <span className="text-sm text-gray-900">
                              {location}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-[#9194A9]">
                          No locations found
                        </p>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Media Upload Icon */}
            <Tooltip title="Upload media" placement="bottom">
              <button
                onClick={() => mediaInputRef.current?.click()}
                className="cursor-pointer"
              >
                <ImageIcon
                  className={`w-6 h-6 ${
                    media.length > 0 ? "text-primary" : "text-[#9194A9]"
                  } hover:text-primary transition-colors`}
                />
              </button>
            </Tooltip>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              ref={mediaInputRef}
              onChange={handleMediaUpload}
              className="hidden"
            />

            {/* Itinerary Icon */}
            <Tooltip title="Add Itinerary" placement="bottom">
              <button
                onClick={() => setShowItineraryModal(true)}
                className="cursor-pointer"
              >
                <CalendarCheck className="w-6 h-6 text-[#9194A9] hover:text-primary transition-colors" />
              </button>
            </Tooltip>

            {/* Privacy Icon with Popup */}
            <div className="relative" ref={privacyPopupRef}>
              <Tooltip title="Set privacy" placement="bottom">
                <button
                  onClick={() => setShowPrivacyPopup(true)}
                  className="cursor-pointer"
                >
                  <Globe
                    className={`w-6 h-6 mt-2 ${
                      privacy !== "public" ? "text-primary" : "text-[#9194A9]"
                    } hover:text-primary transition-colors`}
                  />
                </button>
              </Tooltip>
              <AnimatePresence>
                {showPrivacyPopup && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-10 left-0 bg-white rounded-2xl shadow-xl p-5 w-80 z-20"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          Who can see this post
                        </h4>
                        <p className="text-sm text-[#9194A9]">
                          Choose who can reply to this post.
                        </p>
                      </div>
                    </div>
                    {[
                      { value: "public", icon: Globe, label: "Public" },
                      { value: "friends", icon: Users, label: "Friends" },
                      { value: "Only me", icon: Lock, label: "Only me" },
                    ].map((option) => (
                      <div
                        key={option.value}
                        onClick={() => handlePrivacySelect(option.value)}
                        className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                      >
                        <option.icon className="size-5 text-[#9194A9]" />
                        <span className="text-sm text-gray-700">
                          {option.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}

      <ItineraryModal
        visible={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
      />
    </section>
  );
};

export default CreatePost;
