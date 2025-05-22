"use client";
import React, { useState, useEffect, useRef } from "react";
import { PiPlus } from "react-icons/pi";
import CustomModal from "@/components/custom/custom-modal";
import Image from "next/image";
import { FiUpload } from "react-icons/fi";
import { MdChangeCircle } from "react-icons/md";
import CustomForm from "@/components/custom/custom-form";
import CustomInput from "@/components/custom/custom-input";
import CustomSelectField from "@/components/custom/custom-seletectField";
import { FieldValues } from "react-hook-form";
import { LocateIcon, Lock, MapPin } from "lucide-react";
import CustomButton from "@/components/custom/custom-button";
import { IoClose } from "react-icons/io5";
import useUser from "@/hooks/useUser";
import { Select } from "antd";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { useCreateGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import { IMyConnections } from "@/types/connection.types";

const { Option } = Select;

// Add your Google Maps API key here
const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || "YOUR_API_KEY_HERE";

// Types for Google Places API response
interface GooglePlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

interface SelectedLocation {
  name: string;
  latitude: number;
  longitude: number;
}

const CreateGroup: React.FC = () => {
  const user = useUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [groupImage, setGroupImage] = useState<string | null>(null);
  const [groupFile, setGroupFile] = useState<File | null>(null);
  const [coLeaders, setCoLeaders] = useState<string[]>([]);

  // Location search states
  const [locationQuery, setLocationQuery] = useState("");
  const [locationResults, setLocationResults] = useState<
    GooglePlacePrediction[]
  >([]);
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isSearchingLocation, setIsSearchingLocation] = useState(false);

  const locationInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const autocompleteServiceRef =
    useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(
    null
  );

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    // Reset location states when modal closes
    setLocationQuery("");
    setLocationResults([]);
    setSelectedLocation(null);
    setShowLocationDropdown(false);
    setGroupFile(null);
  };

  //get my all connections list
  const { data: responseData } = useGetMyConnectionsQuery(undefined);
  const myConnections = responseData?.data?.attributes?.results;

  //create group mutation
  const [createGroup, { isLoading }] = useCreateGroupMutation();

  // Initialize Google Places API
  useEffect(() => {
    const initializeGooglePlaces = () => {
      if (window.google && window.google.maps && window.google.maps.places) {
        autocompleteServiceRef.current =
          new window.google.maps.places.AutocompleteService();

        // Create a dummy div for PlacesService (required by Google)
        const dummyDiv = document.createElement("div");
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          dummyDiv
        );
      }
    };

    // Load Google Maps API if not already loaded
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeGooglePlaces;
      document.head.appendChild(script);
    } else {
      initializeGooglePlaces();
    }
  }, []);

  // Search locations using Google Places API
  const searchLocations = async (query: string) => {
    if (query?.length < 3 || !autocompleteServiceRef.current) {
      setLocationResults([]);
      return;
    }

    setIsSearchingLocation(true);
    try {
      const request = {
        input: query,
        types: ["establishment", "geocode"], // Include businesses and addresses
      };

      autocompleteServiceRef.current.getPlacePredictions(
        request,
        (predictions, status) => {
          setIsSearchingLocation(false);
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            console.log("Predictions:", predictions);
            setLocationResults(predictions);
            setShowLocationDropdown(true);
          } else {
            setLocationResults([]);
            setShowLocationDropdown(false);
          }
        }
      );
    } catch (error) {
      console.error("Error searching locations:", error);
      toast.error("Failed to search locations");
      setIsSearchingLocation(false);
    }
  };

  // Get place details from place_id
  const getPlaceDetails = (placeId: string, description: string) => {
    if (!placesServiceRef.current) return;

    const request = {
      placeId: placeId,
      fields: ["geometry", "formatted_address", "name"],
    };

    placesServiceRef.current.getDetails(request, (place, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && place) {
        console.log(place);
        const selected: SelectedLocation = {
          name: place.formatted_address || description,
          latitude: place.geometry?.location?.lat() || 0,
          longitude: place.geometry?.location?.lng() || 0,
        };

        setSelectedLocation(selected);
        setLocationQuery(description);
        setShowLocationDropdown(false);
        setLocationResults([]);
      } else {
        toast.error("Failed to get location details");
      }
    });
  };

  // Debounce location search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (locationQuery && !selectedLocation) {
        searchLocations(locationQuery);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [locationQuery, selectedLocation]);

  // Handle location input change
  const handleLocationInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setLocationQuery(value);
    setSelectedLocation(null);

    if (value.length === 0) {
      setLocationResults([]);
      setShowLocationDropdown(false);
    }
  };

  // Handle location selection
  const handleLocationSelect = (prediction: GooglePlacePrediction) => {
    getPlaceDetails(prediction.place_id, prediction.description);
  };

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !locationInputRef.current?.contains(event.target as Node)
      ) {
        setShowLocationDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Revoke the previous object URL to prevent memory leaks
      if (groupImage) {
        URL.revokeObjectURL(groupImage);
      }
      const imageUrl = URL.createObjectURL(file);
      setGroupImage(imageUrl);
      setGroupFile(file);
    }
  };

  const handleFormSubmit = async (values: FieldValues) => {
    // Validate location selection
    if (!selectedLocation) {
      toast.error("Please select a valid location");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.groupName);
      formData.append("description", values.description);
      formData.append("privacy", values.privacy);
      formData.append(
        "location",
        JSON.stringify({
          latitude: selectedLocation.latitude,
          longitude: selectedLocation.longitude,
        })
      );
      formData.append("locationName", selectedLocation.name);
      formData.append("groupImage", groupFile || "");
      if (coLeaders.length > 0) {
        formData.append("coLeaders", JSON.stringify(coLeaders));
      }
      await createGroup(formData).unwrap();
      toast.success("Group created successfully!");
      closeModal();
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  const handleCoLeaderChange = (value: string[]) => {
    setCoLeaders(value);
  };
  return (
    <section className="w-full mb-8">
      <button
        onClick={openModal}
        className="w-full bg-[#FEEFE8] text-secondary flex justify-center items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
      >
        <PiPlus size={24} />
        <span>Create New Group</span>
      </button>
      {/* Render the Modal */}
      <CustomModal
        header={
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
            <h2 className="text-xl font-semibold text-gray-800">
              Create Group
            </h2>
            <button
              className="text-gray-600  border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
              onClick={closeModal}
            >
              <IoClose size={18} />
            </button>
          </div>
        }
        isOpen={isModalOpen}
        onClose={closeModal}
      >
        {/* Group Group Image */}
        <div className="w-full h-44 bg-[#DDDDDD] rounded-xl mb-4 relative flex items-center justify-center">
          {groupImage ? (
            <div className="relative w-full h-full">
              <Image
                src={groupImage}
                alt="Group Image"
                width={300}
                height={300}
                className="w-full h-full object-cover rounded-xl"
              />
              {/* Change Image Button */}
              <label className="absolute top-2 right-2 bg-white rounded-full p-2 cursor-pointer shadow-md">
                <MdChangeCircle size={24} className="text-orange-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
              </label>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center justify-center h-full">
              <FiUpload size={24} className="text-gray-500" />
              <span className="text-gray-500 text-sm mt-1">
                Upload group image
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </label>
          )}
        </div>

        {/* Leader Info */}
        <div className="flex items-center gap-3 my-4">
          {user && (
            <Image
              src={user?.profileImage}
              alt="Leader"
              width={50}
              height={50}
              className="size-[50px] object-cover ring-2 ring-gray-300 rounded-full"
            />
          )}
          <div>
            <p className="text-gray-800 font-semibold">{user?.fullName}</p>
            <p className="text-gray-500 text-sm">Leader • Your Profile</p>
          </div>
        </div>

        {/* Form */}
        <CustomForm onSubmit={handleFormSubmit}>
          <div className="flex flex-col gap-6 mt-8">
            <CustomInput
              type="text"
              required
              label="Group Name"
              name="groupName"
              placeholder="Group name"
            />

            {/* Custom Google Places Location Search Input */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="relative">
                  <input
                    ref={locationInputRef}
                    type="text"
                    value={locationQuery}
                    onChange={handleLocationInputChange}
                    placeholder="Search for a location..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg  outline-none"
                    onFocus={() => {
                      if (locationResults.length > 0) {
                        setShowLocationDropdown(true);
                      }
                    }}
                  />
                  <LocateIcon
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  {isSearchingLocation && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    </div>
                  )}
                </div>

                {/* Google Places Location Dropdown */}
                {showLocationDropdown && locationResults.length > 0 && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
                  >
                    {locationResults?.map((prediction) => (
                      <div
                        key={prediction.place_id}
                        onClick={() => handleLocationSelect(prediction)}
                        className="px-4 py-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors"
                      >
                        <MapPin
                          size={16}
                          className="text-blue-500 mt-1 flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {prediction.structured_formatting.main_text}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {prediction.structured_formatting.secondary_text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Who can see the group? */}
            <CustomSelectField
              items={[
                { label: "Public", value: "public" },
                { label: "Private", value: "private" },
              ]}
              label="Who can see the group?"
              icon={<Lock size={22} className="text-[#9194A9]" />}
              placeholder="Who can see the group?"
              name="privacy"
              required
            />

            {/* Description */}
            <CustomInput
              type="textarea"
              label="Description"
              name="description"
              isTextarea
              placeholder="What are the details?"
              required
            />

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <button className="size-6 flex justify-center  items-center rounded-full flex-shrink-0 border-2">
                  <PiPlus size={18} />
                </button>
                <h1 className="text-base font-semibold text-gray-900">
                  Add co-leaders
                </h1>
              </div>
              <div className="w-full bg-[#F2F3F5] p-6 rounded-xl">
                <Select
                  mode="multiple"
                  allowClear
                  value={coLeaders}
                  onChange={handleCoLeaderChange}
                  style={{ width: "100%" }}
                  placeholder="Add co-leaders"
                  size="large"
                  className="text-gray-900"
                >
                  {myConnections?.map((connection: IMyConnections) => (
                    <Option key={connection?.sentBy?._id} value={connection?.sentBy?._id}>
                      {connection?.sentBy?.fullName}
                    </Option>
                  ))}
                </Select>
                <h1 className=" text-gray-600 mt-2">
                  Co-leaders can accept or decline once you&apos;ve published
                  your group.
                </h1>
              </div>
            </div>

            <CustomButton
              loading={isLoading}
              type="submit"
              className="px-5 py-3.5 rounded-xl border  transition cursor-pointer"
            >
              <span>Create Group</span>
            </CustomButton>
          </div>
        </CustomForm>
      </CustomModal>
    </section>
  );
};

export default CreateGroup;
