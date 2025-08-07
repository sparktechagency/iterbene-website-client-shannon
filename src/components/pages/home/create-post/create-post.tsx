"use client";
import CustomButton from "@/components/custom/custom-button";
import CustomModal from "@/components/custom/custom-modal";
import useUser from "@/hooks/useUser";
import { useGetHashtagsQuery } from "@/redux/features/hashtag/hashtagApi";
import { useCreateItineraryMutation } from "@/redux/features/itinerary/itineraryApi";
import {
  useCreatePostMutation,
  useUpdatePostMutation,
} from "@/redux/features/post/postApi";
import { TError } from "@/types/error";
import { IActivity, IDay, IItinerary } from "@/types/itinerary.types";
import { Tooltip } from "antd";
import { AnimatePresence, motion } from "framer-motion";
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
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { BsUpload } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperClass, SwiperSlide } from "swiper/react";
import CreateItineraryModal from "./CreateItineraryModal";
import ShowItineraryModal from "./ShowItineraryModal";
import EditItineraryModal from "./EditItineraryModal";
import { IPost } from "@/types/post.types";
import { LocationDetails2, LocationPrediction2, useGoogleLocationSearch2 } from "@/hooks/useGoogleLocationSearch2";

export interface FilePreview {
  name: string;
  preview: string;
  type: string;
  file?: File; // Add file property for existing media
}

// Define post types
export type PostType = "User" | "Group" | "Event";

interface CreatePostProps {
  postType?: PostType;
  groupId?: string;
  eventId?: string;
  initialPostData?: IPost; // New prop for editing
  onPostCreated?: () => void;
  setAllPosts?: (posts: IPost[] | ((prev: IPost[]) => IPost[])) => void;
}

const CreatePost = ({
  postType = "User",
  groupId,
  eventId,
  initialPostData,
  onPostCreated,
  setAllPosts
}: CreatePostProps) => {
  const user = useUser();
  // State for post content
  const [post, setPost] = useState<string>("");
  // State for hashtag suggestions
  const [hashtagQuery, setHashtagQuery] = useState<string>("");
  const [showHashtagSuggestions, setShowHashtagSuggestions] =
    useState<boolean>(false);
  const hashtagPopupRef = useRef<HTMLDivElement>(null);
  // Use form
  const methods = useForm();
  const { reset } = methods;

  const defaultLocation = user?.country;

  // State for location
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails2 | null>(null);
  // Location search states
  const [locationQuery, setLocationQuery] = useState<string>("");
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Use the reusable Google location search hook
  const {
    predictions,
    isLoading: isSearchingLocation,
    searchLocations,
    getLocationDetails,
    clearPredictions,
  } = useGoogleLocationSearch2({
    debounceMs: 300,
    minQueryLength: 1,
    maxResults: 5
  });
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);

  // State for privacy
  const [privacy, setPrivacy] = useState<string>("public");
  const [showPrivacyPopup, setShowPrivacyPopup] = useState<boolean>(false);

  // State for media
  const [media, setMedia] = useState<File[]>([]);
  const [mediaPreviews, setMediaPreviews] = useState<FilePreview[]>([]);
  const [existingMedia, setExistingMedia] = useState<FilePreview[]>([]); // For existing media in edit mode

  // State for textarea focus
  const [isTextareaFocused, setIsTextareaFocused] = useState<boolean>(false);
  
  // Function to render text with highlighted hashtags
  const renderTextWithHashtags = (text: string) => {
    if (!text) return text;
    
    // Regular expression to match hashtags
    const hashtagRegex = /(#\w+)/g;
    const parts = text.split(hashtagRegex);
    
    return parts.map((part, index) => {
      if (part.match(hashtagRegex)) {
        return (
          <span key={index} className="text-[#3B82F6]">
            {part}
          </span>
        );
      }
      return part;
    });
  };

  // State for itinerary
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [itineraryModalOpen, setItineraryModalOpen] = useState<boolean>(false);
  const [itinerary, setItinerary] = useState<IItinerary | null>(null);
  const [editItineraryModal, setEditItineraryModal] = useState(false);
  const [createItinerary, { isLoading }] = useCreateItineraryMutation();

  // Post
  const [createPost, { isLoading: isCreatingPost }] = useCreatePostMutation();
  const [updatePost, { isLoading: isUpdatingPost }] = useUpdatePostMutation(); // New mutation for updating

  // Hashtag query
  const { data: hashtagData } = useGetHashtagsQuery(hashtagQuery, {
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

  // Populate form fields if initialPostData is provided (edit mode)
  useEffect(() => {
    if (initialPostData) {
      setPost(initialPostData.content);
      setPrivacy(initialPostData.privacy || "public");
      if (
        initialPostData.visitedLocationName &&
        initialPostData.visitedLocation
      ) {
        setSelectedLocation({
          name: initialPostData.visitedLocationName,
          latitude: initialPostData.visitedLocation.latitude,
          longitude: initialPostData.visitedLocation.longitude,
          place_id: '',
        });
      }
      if (initialPostData.itinerary) {
        setItinerary(initialPostData.itinerary);
      }
      if (initialPostData.media && initialPostData.media.length > 0) {
        setExistingMedia(
          initialPostData.media.map((m) => ({
            name: m?.mediaUrl,
            preview: m?.mediaUrl,
            type: m?.mediaType,
            file: undefined, // Mark as existing, not new File object
          }))
        );
      }
    }
  }, [initialPostData]);

  // Different configurations based on post type
  const getPostConfig = () => {
    switch (postType) {
      case "Group":
        return {
          placeholder: `What's new, ${user?.fullName || "User"}?`,
          showPrivacy: false,
          showLocation: true,
          showItinerary: true,
          showHeaderContext: false,
        };
      case "Event":
        return {
          placeholder: `What's new, ${user?.fullName || "User"}?`,
          showPrivacy: false,
          showLocation: true,
          showItinerary: true,
          showHeaderContext: false,
        };
      default: // timeline
        return {
          placeholder: `What's new, ${user?.fullName || "User"}?`,
          showPrivacy: true,
          showLocation: true,
          showItinerary: true,
          showHeaderContext: false,
        };
    }
  };

  const config = getPostConfig();

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

    // Only show hashtag suggestions for timeline posts
    if (postType === "User") {
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
    const newPost = `${post.slice(
      0,
      wordStartIndex
    )}#${hashtag} ${textAfterCursor}`;
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
  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const validFiles: File[] = [];
      const newPreviews: FilePreview[] = [];

      for (const file of newFiles) {
        const isImage = file.type.startsWith("image/");
        const isVideo = file.type.startsWith("video/");

        if (isImage) {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`Image "${file.name}" size should not exceed 5MB.`);
            continue;
          }
        }

        if (isVideo) {
          if (file.size > 10 * 1024 * 1024) {
            toast.error(`Please upload a video less than 10MB.`);
            continue;
          }

          const duration = await new Promise<number>((resolve) => {
            const video = document.createElement("video");
            video.preload = "metadata";
            video.onloadedmetadata = () => {
              window.URL.revokeObjectURL(video.src);
              resolve(video.duration);
            };
            video.src = URL.createObjectURL(file);
          });

          if (duration > 60) {
            toast.error(
              `Please upload a video with a duration less than 60 seconds.`
            );
            continue;
          }
        }

        validFiles.push(file);
        newPreviews.push({
          name: file.name,
          preview: URL.createObjectURL(file),
          type: file.type.startsWith("image/") ? "image" : "video",
          file: file,
        });
      }

      setMedia((prev) => [...prev, ...validFiles]);
      setMediaPreviews((prev) => [...prev, ...newPreviews]);

      // Reset the file input to allow re-uploading the same file
      if (e.target) {
        e.target.value = "";
      }
    }
  };

  // Remove media
  const handleRemoveMedia = (index: number, isExisting: boolean) => {
    if (isExisting) {
      setExistingMedia((prev) => prev.filter((_, i) => i !== index));
    } else {
      setMedia((prev) => prev.filter((_, i) => i !== index));
      setMediaPreviews((prev) => prev.filter((_, i) => i !== index));
    }
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
      const itinerary = response?.data?.attributes;
      setItinerary(itinerary);
      setItineraryModalOpen(false);
      toast.success("Itinerary created successfully!");
      reset();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  // handle itinerary modal open
  const handleItineraryModalOpen = () => {
    setEditItineraryModal(true);
    setShowItineraryModal(false);
  };

  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocationQuery(value);
    setSelectedLocation(null);

    if (value.length === 0) {
      clearPredictions();
    } else {
      searchLocations(value);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (prediction: LocationPrediction2) => {
    const locationDetails = await getLocationDetails(prediction.place_id);
    if (locationDetails) {
      setSelectedLocation(locationDetails);
      setLocationQuery("");
      setShowLocationPopup(false);
      clearPredictions();
    }
  };

  // Handle post creation or update
  const handlePostAction = async () => {
    const formData = new FormData();
    if (post) {
      formData.append("content", post);
    }
    formData.append(
      "sourceId",
      postType === "Group"
        ? groupId
        : postType === "Event"
        ? eventId
        : user?._id
    );
    formData.append("postType", postType === "User" ? "User" : postType);
    if (selectedLocation) {
      formData.append(
        "visitedLocation",
        JSON.stringify({
          latitude: selectedLocation?.latitude,
          longitude: selectedLocation?.longitude,
        })
      );
      formData.append("visitedLocationName", selectedLocation?.name || "");
    }
    if (privacy) {
      formData.append("privacy", privacy);
    }
    if (itinerary) {
      formData.append("itineraryId", itinerary?._id || "");
    }
    // Add new media files
    media?.forEach((file) => {
      formData.append("postFiles", file);
    });

    try {
      if (initialPostData) {
        if(setAllPosts){
          //optimistic update
          // if (setAllPosts) {
          //   setAllPosts((prevPosts: IPost[]) =>
          //     prevPosts.map((p) => (p._id === initialPostData._id ? formData : p))
          //   );
          // }
        }
        toast.success("Post updated successfully!");
        await updatePost({ id: initialPostData?._id, data: formData }).unwrap();
      } else {
        await createPost(formData).unwrap();
        toast.success("Post created successfully!");
      }

      // Reset form
      setMedia([]);
      setMediaPreviews([]);
      setExistingMedia([]);
      setPost("");
      setSelectedLocation(null);
      setItinerary(null);
      setShowHashtagSuggestions(false);

      // Optional callback
      onPostCreated?.();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  const handleMapIconClick = () => {
    setShowLocationPopup(true);
    setLocationQuery(defaultLocation);
    searchLocations(defaultLocation); // Trigger search with default value
  };

  const allMediaPreviews = [...existingMedia, ...mediaPreviews];
  const isActionLoading = isCreatingPost || isUpdatingPost;

  return (
    <>
      {user && (
        <section className="w-full bg-white rounded-xl">
          {/* Post Input Section */}
          <div className="w-full flex px-4 pt-4 pb-2 gap-3">
            {user && (
              <Image
                src={user?.profileImage}
                alt="User Profile"
                width={50}
                height={50}
                className="size-[50px] rounded-full object-cover flex-shrink-0"
              />
            )}
            <div className="relative w-full">
              {/* Invisible textarea for input handling */}
              <textarea
                ref={textareaRef}
                placeholder={!post ? config.placeholder : ""}
                value={post}
                onChange={postChangeHandler}
                onFocus={()=>setIsTextareaFocused(true)}
                className="w-full bg-transparent border-none text-justify mt-4 text-base focus:outline-none placeholder-gray-400 resize-none whitespace-pre-wrap text-transparent caret-black"
                style={{ caretColor: 'black' }}
              />
              
              {/* Display overlay with hashtag highlighting */}
              <div 
                className="absolute top-0 left-0 w-full bg-transparent border-none text-justify mt-4 text-base pointer-events-none resize-none whitespace-pre-wrap text-gray-900"
                style={{
                  minHeight: textareaRef.current?.style.height || 'auto',
                  lineHeight: '1.5'
                }}
              >
                {post ? renderTextWithHashtags(post) : (
                  <span className="text-gray-400">{config.placeholder}</span>
                )}
              </div>
              {/* Hashtag Suggestions Popup */}
              <AnimatePresence>
                {showHashtagSuggestions &&
                  hashtagData?.data?.attributes?.results?.length > 0 && (
                    <motion.div
                      ref={hashtagPopupRef}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full left-0 bg-white rounded-2xl shadow-xl p-4 border border-gray-200 w-80 z-20 max-h-56 overflow-y-auto"
                    >
                      {hashtagData?.data?.attributes?.results?.length > 0 &&
                        hashtagData?.data?.attributes?.results?.map(
                          (
                            hashtag: { name: string; postCount: number },
                            index: number
                          ) => (
                            <div
                              key={index}
                              onClick={() => handleHashtagSelect(hashtag?.name)}
                              className="flex flex-col px-3 py-1 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                            >
                              <span className="text-base text-gray-900 font-semibold">
                                #{hashtag?.name}
                              </span>
                              <p className="text-sm text-[#9194A9]">
                                {hashtag?.postCount} posts
                              </p>
                            </div>
                          )
                        )}
                    </motion.div>
                  )}
              </AnimatePresence>
            </div>
            {!post && allMediaPreviews?.length === 0 && (
              <button
                onClick={handlePostAction}
                disabled={
                  (!post && allMediaPreviews.length === 0) || isActionLoading
                }
                className={`w-[140px]  flex justify-center items-center h-[45px] mt-1 ${
                  post || allMediaPreviews.length > 0
                    ? "bg-secondary text-white cursor-pointer"
                    : "border border-[#9194A9] text-[#9194A9]"
                } rounded-xl`}
              >
                {isActionLoading ? (
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
                  </>
                ) : initialPostData ? (
                  "Update Post"
                ) : (
                  "Post It!"
                )}
              </button>
            )}
          </div>

          {/* Media Preview Section */}
          <div className="w-full px-6 relative">
            {allMediaPreviews?.length > 0 && (
              <>
                <Swiper
                  modules={[Pagination]}
                  pagination={{ clickable: false }}
                  onSwiper={(swiper) => {
                    swiperRef.current = swiper;
                  }}
                  spaceBetween={10}
                  slidesPerView={allMediaPreviews?.length === 1 ? 1 : 2}
                  className="w-full"
                >
                  {allMediaPreviews?.map((item, index) => (
                    <SwiperSlide key={item.preview}>
                      <div className="relative">
                        {item.type.startsWith("image") ? (
                          <Image
                            src={item?.preview}
                            alt={item?.name}
                            width={500}
                            height={500}
                            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-lg"
                          />
                        ) : (
                          <video
                            src={item?.preview}
                            controls
                            className="w-full h-56 md:h-72 lg:h-96 object-cover rounded-lg"
                          />
                        )}
                        <button
                          onClick={() => handleRemoveMedia(index, !item.file)} // Pass true if it's an existing media (no file object)
                          className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom navigation buttons */}
                {allMediaPreviews.length > 2 && (
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
          {(post ||
            allMediaPreviews.length > 0 ||
            selectedLocation ||
            initialPostData ||
            isTextareaFocused) && (
            <>
              {/* Selected Location and Privacy Display */}
              <div className="w-full flex justify-between gap-4 p-2 items-center">
                <div className="w-full flex items-center gap-4 px-4">
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
                          {selectedLocation?.name}
                        </span>
                        <button
                          onClick={handleRemoveLocation}
                          className="text-[#9194A9] hover:text-red-500 cursor-pointer"
                          aria-label="Remove location"
                        >
                          <X className="size-4" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {(config?.showPrivacy || initialPostData) && ( // Show privacy for user posts or when editing any post
                    <div className="flex items-center gap-2">
                      {privacy === "public" ? (
                        <Globe className="w-6 h-6 text-primary transition-colors" />
                      ) : privacy === "friends" ? (
                        <Users className="w-6 h-6 text-primary transition-colors" />
                      ) : (
                        <Lock className="w-6 h-6 text-primary transition-colors" />
                      )}
                      <span className="text-sm text-gray-700 capitalize">
                        {privacy}
                      </span>
                    </div>
                  )}
                  {itinerary && (
                    <div
                      onClick={() => setShowItineraryModal(true)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <CalendarCheck className="w-5 h-5 text-primary" />
                      <span className="text-sm text-gray-700">
                        View Itinerary
                      </span>
                    </div>
                  )}
                </div>
                {/* if post or allMediaPrivies lenght > 0 show post button */}
                {post || allMediaPreviews.length > 0 ? (
                  <div className="flex-1 justify-end items-center">
                    <button
                      onClick={handlePostAction}
                      disabled={
                        (!post && allMediaPreviews.length === 0) ||
                        isActionLoading
                      }
                      className={`w-[140px]  flex justify-center items-center h-[45px] mt-1 ${
                        post || allMediaPreviews.length > 0
                          ? "bg-secondary text-white cursor-pointer"
                          : "border border-[#9194A9] text-[#9194A9]"
                      } rounded-xl`}
                    >
                      {isActionLoading ? (
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
                        </>
                      ) : initialPostData ? (
                        "Update Post"
                      ) : (
                        "Post It!"
                      )}
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Icons for Additional Functionalities */}
              <div className="flex items-center gap-5 bg-[#E7E8EC] px-4 py-1.5 rounded-b-xl">
                {/* Media Upload Icon - Always available */}
                <Tooltip title="Upload media" placement="bottom">
                  <button
                    onClick={() => mediaInputRef.current?.click()}
                    className="cursor-pointer"
                  >
                    <ImageIcon
                      className={`w-6 h-6 ${
                        allMediaPreviews.length > 0
                          ? "text-primary"
                          : "text-[#9194A9]"
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

                {/* Location Icon - Only for timeline and group posts */}
                {(config.showLocation || initialPostData) && ( // Show location for user/group posts or when editing any post
                  <div className="relative" ref={locationPopupRef}>
                    <Tooltip title="Add a location" placement="bottom">
                      <button
                        onClick={handleMapIconClick}
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
                              ref={locationInputRef}
                              type="text"
                              value={locationQuery}
                              onChange={handleLocationInputChange}
                              placeholder="Search for a location.."
                              className="w-full px-4 py-2 border rounded-full border-gray-200 focus:outline-none "
                              onFocus={() => {
                                if (predictions?.length > 0) {
                                  setShowLocationPopup(true);
                                }
                              }}
                            />
                            <Search className="w-5 h-5 text-[#9194A9] absolute top-3 right-4" />
                            {isSearchingLocation && (
                              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 max-h-56 overflow-y-auto">
                            {predictions?.map((prediction) => (
                              <div
                                key={prediction?.place_id}
                                onClick={() => handleLocationSelect(prediction)}
                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer rounded-md transition-colors"
                              >
                                <MapPin className="size-5 text-[#9194A9]" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-gray-900 truncate">
                                    {prediction.main_text}
                                  </p>
                                  <p className="text-xs text-gray-500 truncate">
                                    {
                                      prediction?.secondary_text
                                    }
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Itinerary Icon*/}
                {(config.showItinerary || initialPostData) && ( // Show itinerary for user/group posts or when editing any post
                  <Tooltip title="Add Itinerary" placement="bottom">
                    <button
                      onClick={() => setShowPdfModal(true)}
                      className="cursor-pointer"
                    >
                      <CalendarCheck className="w-6 h-6 text-[#9194A9] hover:text-primary transition-colors" />
                    </button>
                  </Tooltip>
                )}

                {/* Privacy Icon */}
                {(config.showPrivacy || initialPostData) && ( // Show privacy for user posts or when editing any post
                  <div className="relative" ref={privacyPopupRef}>
                    <Tooltip title="Set privacy" placement="bottom">
                      <button
                        onClick={() => setShowPrivacyPopup(true)}
                        className="cursor-pointer"
                      >
                        <Globe
                          className={`w-6 h-6 mt-2 ${
                            privacy !== "public"
                              ? "text-primary"
                              : "text-[#9194A9]"
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
                                Choose who can see this post
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
                )}
              </div>
            </>
          )}

          <CustomModal
            isOpen={showPdfModal}
            onClose={() => setShowPdfModal(false)}
            header={
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
                <h2 className="text-xl font-semibold text-gray-800">
                  Itinerary
                </h2>
                <button
                  className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
                  onClick={() => setShowPdfModal(false)}
                >
                  <IoMdClose size={18} />
                </button>
              </div>
            }
            className="w-full p-2"
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
                  setItineraryModalOpen(true);
                }}
              >
                Create One
              </CustomButton>
              <CustomButton
                fullWidth
                className="mt-7 px-5 py-3"
                variant="outline"
              >
                Save
              </CustomButton>
            </div>
          </CustomModal>
          <CreateItineraryModal
            visible={itineraryModalOpen}
            onClose={() => setItineraryModalOpen(false)}
            handleCreateItinerary={handleCreateItinerary}
            isLoading={isLoading}
          />
          <ShowItineraryModal
            visible={showItineraryModal}
            onClose={() => setShowItineraryModal(false)}
            itinerary={itinerary as IItinerary}
            isEditing={true}
            handleEdit={handleItineraryModalOpen}
          />
          {editItineraryModal && (
            <EditItineraryModal
              visible={editItineraryModal}
              onClose={() => setEditItineraryModal(false)}
              itineraryId={itinerary?._id || ""}
              setItinerary={setItinerary}
            />
          )}
        </section>
      )}
    </>
  );
};

export default CreatePost;
