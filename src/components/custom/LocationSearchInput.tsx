import {
  LocationDetails,
  LocationPrediction,
  useGoogleLocationSearch,
} from "@/hooks/useGoogleLocationSearch";
import { MapPin, Loader2 } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface LocationSearchInputProps {
  name: string;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
  onLocationSelect?: (location: LocationDetails) => void;
  onInputChange?: (value: string) => void;
  showSelectedInfo?: boolean;
  disabled?: boolean;
  register: UseFormRegisterReturn;
  error?: FieldError;
}

const LocationSearchInput: React.FC<LocationSearchInputProps> = ({
  name,
  placeholder = "Search for a location...",
  className = "",
  label = "Location",
  required = false,
  onLocationSelect,
  onInputChange,
  showSelectedInfo = false,
  disabled = false,
  register,
  error,
}) => {
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    predictions,
    isLoading,
    isInitialized,
    searchLocations,
    getLocationDetails,
    clearPredictions,
    error: apiError,
  } = useGoogleLocationSearch({
    debounceMs: 300,
    minQueryLength: 2,
    maxResults: 10,
  });

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Clear selected location when user types
    if (selectedLocation) {
      setSelectedLocation(null);
    }

    // Update form state
    register.onChange(e);
    onInputChange?.(newValue);

    if (newValue.length === 0) {
      clearPredictions();
      setShowDropdown(false);
    } else if (newValue.length >= 2) {
      searchLocations(newValue);
    }
  };

  // Handle location selection
  const handleLocationSelect = async (prediction: LocationPrediction) => {
    try {
      const locationDetails = await getLocationDetails(prediction.place_id);

      if (locationDetails) {
        setSelectedLocation(locationDetails);
        setInputValue(prediction.description);
        setShowDropdown(false);
        clearPredictions();

        // Update form state with the selected description
        register.onChange({
          target: { value: prediction.description, name },
        });

        // Call callbacks
        onLocationSelect?.(locationDetails);
        onInputChange?.(prediction.description);
      }
    } catch (error) {
      console.error("Error selecting location:", error);
    }
  };

  // Show dropdown when predictions are available
  useEffect(() => {
    if (predictions.length > 0 && inputValue.length >= 2) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  }, [predictions, inputValue]);

  // Handle clicks outside dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle input focus
  const handleInputFocus = () => {
    if (predictions.length > 0 && inputValue.length >= 2) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={`w-full space-y-1 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-950 text-[15px] font-medium"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative" ref={dropdownRef}>
        {/* Input Container */}
        <div
          className={`
            w-full flex items-center relative
            border rounded-lg bg-white
            ${
              error || apiError
                ? "border-red-500 focus-within:border-red-500"
                : disabled
                ? "border-gray-200 bg-gray-50"
                : "border-gray-300 focus-within:border-orange-500"
            }
            transition-colors duration-200
          `}
        >
          {/* Left Icon */}
          <div className="flex-shrink-0 pl-3">
            <MapPin
              size={20}
              className={`
                ${
                  error || apiError
                    ? "text-red-400"
                    : disabled
                    ? "text-gray-300"
                    : "text-gray-400"
                }
              `}
            />
          </div>

          {/* Input Field */}
          <input
            ref={inputRef}
            id={name}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            placeholder={!isInitialized ? "Loading..." : placeholder}
            disabled={disabled || !isInitialized}
            className={`
              flex-1 py-2.5 px-3 outline-none bg-transparent
              ${disabled ? "text-gray-400" : "text-gray-900"}
              placeholder:text-gray-500
            `}
            autoComplete="off"
          />

          {/* Loading Spinner */}
          {isLoading && (
            <div className="flex-shrink-0 pr-3">
              <Loader2 size={16} className="animate-spin text-orange-500" />
            </div>
          )}
        </div>

        {/* Error Message */}
        {(error || apiError) && (
          <p className="text-red-500 text-sm mt-1">
            {error?.message || apiError}
          </p>
        )}

        {/* Dropdown with Predictions */}
        {showDropdown && predictions.length > 0 && !apiError && (
          <div className="absolute top-full w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[9999]">
            {predictions.map((prediction) => (
              <div
                key={prediction.place_id}
                onClick={() => handleLocationSelect(prediction)}
                className="px-4 py-3 hover:bg-orange-50 cursor-pointer border-b border-gray-100 last:border-b-0 flex items-start gap-3 transition-colors"
              >
                <MapPin
                  size={16}
                  className="text-orange-500 mt-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {prediction.main_text}
                  </p>
                  {prediction.secondary_text && (
                    <p className="text-xs text-gray-500 truncate">
                      {prediction.secondary_text}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Selected Location Info */}
        {showSelectedInfo && selectedLocation && (
          <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-start gap-2">
              <MapPin
                size={16}
                className="text-green-600 mt-0.5 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-green-800 font-medium">
                  Selected: {selectedLocation.name}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Lat: {selectedLocation.latitude.toFixed(6)}, Lng:{" "}
                  {selectedLocation.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearchInput;
