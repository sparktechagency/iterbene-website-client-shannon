"use client";
import {
  CalendarCheck,
  Globe,
  Image as ImageIcon,
  MapPin,
  Trash2,
  Video,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
// Define types for itinerary entries
interface Activity {
  activity: string;
  comments: string;
  rating: string;
  description: string;
}

interface ItineraryDay {
  tripTo: string;
  date: string;
  time: string;
  link: string;
  activities: Activity[];
}

const CreatePost = () => {
  // State for post content
  const [post, setPost] = useState<string>("");
  // State for location
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>("");
  // State for media (images and videos)
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  // State for privacy
  const [privacy, setPrivacy] = useState<"Public" | "Private">("Public");
  // State for itinerary
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);

  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle post input change
  const postChangeHandler = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPost(e.target.value);
  };

  // Mock location search results (replace with Google Maps API later)
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

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Handle video upload
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newVideos = Array.from(e.target.files);
      setVideos((prev) => [...prev, ...newVideos]);
    }
  };

  // Remove image or video
  const removeMedia = (index: number, type: "image" | "video") => {
    if (type === "image") {
      setImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setVideos((prev) => prev.filter((_, i) => i !== index));
    }
  };



  // Remove an itinerary day
  const removeItineraryDay = (index: number) => {
    setItinerary((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section className="w-full bg-white  rounded-xl ">
      {/* Post Input Section */}
      <div className="w-full flex items-center px-6 py-4 gap-3">
        <Image
          src="https://i.ibb.co.com/DP5pMfK8/story5.jpg"
          alt="User Profile"
          width={46}
          height={46}
          className="size-[46px] rounded-full object-cover mr-3 ring ring-primary flex-shrink-0"
        />
        <textarea
          placeholder="What's new, Alexander?"
          value={post}
           rows={post ? 2 : 1}
          onChange={postChangeHandler}
          className="w-full h-auto bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500 resize-none "
        />
        <button className={`flex-shrink-0 ${post ? "bg-secondary text-white" : "border border-[#9194A9] text-[#9194A9]"}  px-6 py-3 rounded-xl`}>Post It!</button>
      </div>

      {/* Additional Options Section (Visible when post has text) */}
      {post && (
        <div className="mt-4 flex flex-col gap-3 ">
          {/* Display Selected Location */}
          {selectedLocation && (
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-sm">{selectedLocation}</span>
              <button
                onClick={() => setSelectedLocation(null)}
                className="text-xs text-red-500 hover:underline"
              >
                Remove
              </button>
            </div>
          )}

          {/* Image and Video Previews */}
          {(images.length > 0 || videos.length > 0) && (
            <div className="flex flex-wrap gap-3 mt-2">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <Image
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    width={200}
                    height={200}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    onClick={() => removeMedia(index, "image")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {videos.map((video, index) => (
                <div key={index} className="relative">
                  <video
                    src={URL.createObjectURL(video)}
                    className="w-24 h-24 object-cover rounded-md"
                    controls
                  />
                  <button
                    onClick={() => removeMedia(index, "video")}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Itinerary Section */}
          {itinerary.length > 0 && (
            <div className="mt-2">
              <h4 className="text-sm font-semibold text-gray-700">
                Itinerary:
              </h4>
              {itinerary.map((day, index) => (
                <div
                  key={index}
                  className="border-l-2 border-primary pl-3 mt-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {day.tripTo} on {day.date} at {day.time || "N/A"}
                      </p>
                      {day.activities.map((activity, actIndex) => (
                        <div key={actIndex} className="mt-1">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Activity:</span>{" "}
                            {activity.activity}
                          </p>
                          {activity.comments && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Comments:</span>{" "}
                              {activity.comments}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Rating:</span>{" "}
                            {activity.rating}/5
                          </p>
                          {activity.description && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span>{" "}
                              {activity.description}
                            </p>
                          )}
                        </div>
                      ))}
                      {day.link && (
                        <a
                          href={day.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-500 hover:underline"
                        >
                          {day.link}
                        </a>
                      )}
                    </div>
                    <button
                      onClick={() => removeItineraryDay(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Icons for Additional Functionalities */}
          <div className="w-full bg-[#E7E8EC] flex items-center gap-4 px-6 py-2 rounded-b-xl">
            {/* Location Icon with Popup */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPopup(true)}
                title="Add Location"
              >
                <MapPin
                  className={`w-6 h-6 ${selectedLocation ? "text-primary" : "text-gray-500"
                    } hover:text-primary transition-colors`}
                />
              </button>
              {showLocationPopup && (
                <div className="absolute top-8 left-0 bg-white border rounded-xl shadow-lg p-4 w-64 z-10">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-semibold text-gray-700">
                      Add Location
                    </h4>
                    <button
                      onClick={() => setShowLocationPopup(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-40 overflow-y-auto">
                    {mockLocations.length > 0 ? (
                      mockLocations.map((location, index) => (
                        <div
                          key={index}
                          onClick={() => handleLocationSelect(location)}
                          className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer rounded-md"
                        >
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-700">
                            {location}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        No locations found
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Image Upload Icon */}
            <button
              onClick={() => imageInputRef.current?.click()}
              title="Add Image"
            >
              <ImageIcon
                className={`w-6 h-6 ${images.length > 0 ? "text-primary" : "text-gray-500"
                  } hover:text-primary transition-colors`}
              />
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={imageInputRef}
              onChange={handleImageUpload}
              className="hidden"
            />

            {/* Video Upload Icon */}
            <button
              onClick={() => videoInputRef.current?.click()}
              title="Add Video"
            >
              <Video
                className={`w-6 h-6 ${videos.length > 0 ? "text-primary" : "text-gray-500"
                  } hover:text-primary transition-colors`}
              />
            </button>
            <input
              type="file"
              accept="video/*"
              multiple
              ref={videoInputRef}
              onChange={handleVideoUpload}
              className="hidden"
            />

            {/* Itinerary Icon */}
            <button
              title="Add Itinerary"
            >
              <CalendarCheck
                className={`w-6 h-6 ${itinerary.length > 0 ? "text-primary" : "text-gray-500"
                  } hover:text-primary transition-colors`}
              />
            </button>
            {/* Privacy Icon */}
            <button onClick={() => setPrivacy("Public")} title="Set Privacy">
              <Globe
                className={`w-6 h-6 ${privacy === "Public" ? "text-primary" : "text-gray-500"
                  } transition-colors`}
              />
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default CreatePost;
