"use client";
import {
  CalendarCheck,
  Globe,
  Image as ImageIcon,
  MapPin,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import ItineraryModal from "./ItineraryModal";
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
  // State for post content
  const [post, setPost] = useState<string>("");
  // State for location
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [showLocationPopup, setShowLocationPopup] = useState<boolean>(false);
  const [locationSearch, setLocationSearch] = useState<string>("");
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  // State for media (images and videos)
  const [images, setImages] = useState<File[]>([]);
  // Refs for file inputs
  const imageInputRef = useRef<HTMLInputElement>(null);
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
          rows={1}
          onChange={postChangeHandler}
          className="w-full h-auto bg-transparent border-none focus:outline-none text-gray-800 placeholder-gray-500 resize-none "
        />
        <button
          className={`flex-shrink-0 ${
            post
              ? "bg-secondary text-white"
              : "border border-[#9194A9] text-[#9194A9]"
          }  px-6 py-3 rounded-xl`}
        >
          Post It!
        </button>
      </div>

      {/* Additional Options Section (Visible when post has text) */}
      {post && (
        <div className="mt-4 flex flex-col gap-3 ">
          {/* Icons for Additional Functionalities */}
          <div className="w-full bg-[#E7E8EC] flex items-center gap-4 px-6 py-2 rounded-b-xl">
            {/* Location Icon with Popup */}
            <div className="relative">
              <button
                onClick={() => setShowLocationPopup(true)}
                title="Add Location"
              >
                <MapPin
                  className={`w-6 h-6 ${
                    selectedLocation ? "text-primary" : "text-gray-500"
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
                className={`w-6 h-6 ${
                  images.length > 0 ? "text-primary" : "text-gray-500"
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

            {/* Itinerary Icon */}
            <button onClick={() => setShowItineraryModal(true)} title="Add Itinerary">
              <CalendarCheck
                className={`w-6 h-6  hover:text-primary transition-colors`}
              />
            </button>
            {/* Privacy Icon */}
            <button title="Set Privacy">
              <Globe className={`w-6 h-6  transition-colors`} />
            </button>
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
