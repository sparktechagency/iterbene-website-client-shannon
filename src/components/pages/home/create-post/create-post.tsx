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
import CustomButton from "@/components/custom/custom-button";
import CustomModal from "@/components/custom/custom-modal";
import { IoMdClose } from "react-icons/io";
import { BsUpload } from "react-icons/bs";
import { FieldValues, useForm } from "react-hook-form";
import { IActivity, IDay } from "@/types/itinerary.types";
import { useCreateItineraryMutation } from "@/redux/features/itinerary/itineraryApi";
import toast from "react-hot-toast";
import { TError } from "@/types/error";
import { useCreatePostMutation } from "@/redux/features/post/postApi";
import { useGetHashtagPostsQuery } from "@/redux/features/hashtag/hashtagApi";

export interface FilePreview {
  name: string;
  preview: string;
  type: string;
}

const CreatePost = () => {
  const user = useUser();
  // State for post content
  const [post, setPost] = useState<string>("");
  // State for hashtag suggestions
  const [hashtagQuery, setHashtagQuery] = useState<string>("");
  const [showHashtagSuggestions, setShowHashtagSuggestions] = useState<boolean>(false);
  const hashtagPopupRef = useRef<HTMLDivElement>(null);

  // Use form
  const methods = useForm();
  const { reset } = methods;

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
  const [itineraryId, setItineraryId] = useState<string>("");
  const [createItinerary, { isLoading }] = useCreateItineraryMutation();

  // Post
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();

  // Hashtag query
  const { data: hashtagData, isFetching: isHashtagFetching } = useGetHashtagPostsQuery(hashtagQuery, {
    skip: !hashtagQuery, // Skip query if hashtagQuery is empty
  });

  // Refs
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const locationPopupRef = useRef<HTMLDivElement>(null);
  const privacyPopupRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperClass>(null);

  // PDF modal
  const [showPdfModal, setShowPdfModal] = useState(false);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
      if (
        hashtagPopupRef.current &&
        !hashtagPopupRef.current.contains(event.target as Node)
      ) {
        setShowHashtagSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle post input change and detect hashtags
  const postChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setPost(value);

    // Detect hashtag input (e.g., #nic)
    const cursorPosition = e.target.selectionStart || 0;
    const textBeforeCursor = value.slice(0, cursorPosition);
    const lastWord = textBeforeCursor.split(/\s+/).pop() || "";

    if (lastWord.startsWith("#") && lastWord.length > 1) {
      const query = lastWord.slice(1).toLowerCase(); // Remove # and normalize
      setHashtagQuery(query);
      setShowHashtagSuggestions(true);
    } else {
      setHashtagQuery("");
      setShowHashtagSuggestions(false);
    }
  };

  // Handle hashtag selection
  const handleHashtagSelect = (hashtag: string) => {
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = post.slice(0, cursorPosition);
    const textAfterCursor = post.slice(cursorPosition);
    const lastWord = textBeforeCursor.split(/\s+/).pop() || "";
    const wordStartIndex = textBeforeCursor.length - lastWord.length;

    // Replace the partial hashtag with the selected one
    const newPost =
      post.slice(0, wordStartIndex) + `#${hashtag} ` + textAfterCursor;
    setPost(newPost);
    setHashtagQuery("");
    setShowHashtagSuggestions(false);

    // Refocus textarea and set cursor after the hashtag
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        const newCursorPos = wordStartIndex + hashtag.length + 2; // +2 for # and space
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }
    }, 0);
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

  // Create new itinerary
  const handleCreateItinerary = async (values: FieldValues) => {
    try {
      const payload = {
        ...values,
        days: values.days.map((day: IDay, index: number) => ({
          ...day,
          dayNumber: index + 1,
          location: {
            latitude: day?.location?.latitude,
            longitude: day?.location?.longitude,
          },
          locationName: day?.locationName,
          comment: day?.comment,
          weather: day?.weather,
          activities: day?.activities?.map((activity: IActivity) => ({
            ...activity,
            rating: activity?.rating || 0,
          })),
        })),
      };
      const response = await createItinerary(payload).unwrap();
      const itineraryId = response?.data?.attributes?._id;
      setItineraryId(itineraryId);
      setShowItineraryModal(false);
      toast.success("Itinerary created successfully!");
      reset();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // Create new post
  const handleCreatePost = async () => {
    const visitedLocation = {
      latitude: 500000,
      longitude: 870022,
    };
    try {
      const formData = new FormData();
      formData.append("content", post);
      formData.append("visitedLocation", JSON.stringify(visitedLocation));
      formData.append("sourceId", user?._id || "");
      formData.append("itineraryId", itineraryId || "");
      formData.append("postType", "User");
      formData.append("visitedLocationName", selectedLocation || "");
      formData.append("privacy", privacy || "");
      media?.forEach((file) => {
        formData.append("postFiles", file);
      });
      await createPost(formData).unwrap();
      toast.success("Post created successfully!");
      setMedia([]);
      setMediaPreviews([]);
      setPost("");
      setSelectedLocation(null);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
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
        <div className="relative w-full">
          <textarea
            ref={textareaRef}
            placeholder={`What's new, ${user?.fullName || "User"}?`}
            value={post}
            onChange={postChangeHandler}
            className="w-full bg-transparent border-none text-justify mt-3 text-base focus:outline-none text-gray-800 placeholder-gray-400 resize-none"
          />
          {/* Hashtag Suggestions Popup */}
          <AnimatePresence>
            {showHashtagSuggestions && (
              <motion.div
                ref={hashtagPopupRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 bg-white rounded-2xl shadow-xl p-4 border border-gray-200 w-80 z-20 max-h-40 overflow-y-auto"
              >
                {isHashtagFetching ? (
                  <p className="text-sm text-[#9194A9]">Loading hashtags...</p>
                ) : hashtagData?.data?.attributes?.results?.length > 0 ? (
                   hashtagData?.data?.attributes?.results?.map((hashtag: { name: string,postCount: number }, index: number) => (
                    <div
                      key={index}
                      onClick={() => handleHashtagSelect(hashtag?.name)}
                      className="flex flex-col px-3 py-1 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                    >
                      <span className="text-base text-gray-900 font-semibold">#{hashtag.name}</span>
                      <p className="text-sm text-[#9194A9]">{hashtag?.postCount} posts</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#9194A9]">No hashtags found</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <button
          onClick={handleCreatePost}
          disabled={!post && media.length === 0}
          className={`w-[140px] cursor-pointer flex justify-center items-center h-[50px] ${
            post || media.length > 0
              ? "bg-secondary text-white"
              : "border border-[#9194A9] text-[#9194A9]"
          } rounded-xl`}
        >
          {isCreatingPost ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-current"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Loading...
            </>
          ) : (
            "Post It!"
          )}
        </button>
      </div>

      {/* Media Preview Section */}
      <div className="w-full px-6 relative">
        {mediaPreviews.length > 0 && (
          <>
            <Swiper
              modules={[Pagination]}
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
        <div className="flex flex-col gap-4 mt-4">
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
                onClick={() => setShowPdfModal(true)}
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
                      { value: "private", icon: Lock, label: "Private" },
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
      <CustomModal
        isOpen={showPdfModal}
        onClose={() => setShowPdfModal(false)}
        header={
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">Itinerary</h2>
            <button
              className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
              onClick={() => setShowPdfModal(false)}
            >
              <IoMdClose size={18} />
            </button>
          </div>
        }
      >
        <div className="w-full bg-white rounded-xl p-5 max-w-2xl">
          <div className="border-2 border-dashed border-gray-300 p-6 text-center">
            <input
              type="file"
              accept="application/pdf"
              ref={pdfInputRef}
              className="hidden"
            />
            <BsUpload size={28} className="text-secondary mx-auto my-2" />
            <p className="text-gray-500 mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-gray-400 text-sm">(PDF, max 1mb)</p>
            <button
              onClick={() => pdfInputRef.current?.click()}
              className="mt-4 text-primary underline"
            >
              Browse Files
            </button>
          </div>
          <CustomButton
            fullWidth
            className="mt-6 px-5 py-3"
            variant="default"
            onClick={() => {
              setShowPdfModal(false);
              setShowItineraryModal(true);
            }}
          >
            Create One
          </CustomButton>
          <CustomButton fullWidth className="mt-7 px-5 py-3" variant="outline">
            Save
          </CustomButton>
        </div>
      </CustomModal>
      <ItineraryModal
        visible={showItineraryModal}
        onClose={() => setShowItineraryModal(false)}
        handleCreateItinerary={handleCreateItinerary}
        isLoading={isLoading}
      />
    </section>
  );
};

export default CreatePost;