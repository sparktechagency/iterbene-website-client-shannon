"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useSetLatestLocationMutation } from "@/redux/features/profile/profileApi";
import useUser from "@/hooks/useUser";
import {
  useCookies,
  COOKIE_NAMES,
  migrateFromLocalStorage,
} from "@/contexts/CookieContext";
import { TError } from "@/types/error";

interface ILocationData {
  latitude: string;
  longitude: string;
  locationName: string;
  city?: string;
  state?: string;
  country?: string;
}

const LocationPermission = () => {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<
    "prompt" | "granted" | "denied" | "checking"
  >("prompt");

  const [setLatestLocation] = useSetLatestLocationMutation();
  const user = useUser();
  const { getBooleanCookie, setBooleanCookie } = useCookies();

  // Use ref to track if component is still mounted
  const isMountedRef = useRef(true);

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<Partial<ILocationData>> => {
    try {
      // Check if API key exists
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
      if (!apiKey) {
        console.error("Google Maps API key not found");
        return {
          locationName: "Address not found",
          city: undefined,
          state: undefined,
          country: undefined,
        };
      }

      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.status === "OK" && data.results?.[0]) {
        const result = data.results[0];
        const addressComponents = result.address_components || [];
        let city: string | undefined;
        let state: string | undefined;
        let country: string | undefined;

        for (const component of addressComponents) {
          const types = component.types;
          if (
            types.includes("locality") ||
            types.includes("administrative_area_level_2")
          ) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
          }

          // Fallback for city if locality not found
          if (!city && types.includes("sublocality_level_1")) {
            city = component.long_name;
          }
        }

        const addressData = {
          locationName: result.formatted_address || "Address not found",
          city: city || undefined,
          state: state || undefined,
          country: country || undefined,
        };
        return addressData;
      } else {
        console.warn("Geocoding API returned no results:", data.status);
        return {
          locationName: "Address not found",
          city: undefined,
          state: undefined,
          country: undefined,
        };
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return {
        locationName: "Address not found",
        city: undefined,
        state: undefined,
        country: undefined,
      };
    }
  };

  const handleRequestPermission = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    if (!user) {
      toast.error("User not found. Please log in first.");
      return;
    }

    if (isRequesting) return; // Prevent multiple simultaneous requests

    setIsRequesting(true);
    setPermissionStatus("checking");

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            resolve,
            (error) => {
              console.error("Geolocation error:", error);
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 300000,
            }
          );
        }
      );

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Get address data
      const addressData = await getAddressFromCoordinates(latitude, longitude);

      // Check if component is still mounted after async operation
      if (!isMountedRef.current) return;

      const newLocationData: ILocationData = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        locationName: addressData?.locationName || "Location found",
        city: addressData?.city,
        state: addressData?.state,
        country: addressData?.country,
      };
      try {
        await setLatestLocation({
          latitude: newLocationData.latitude,
          longitude: newLocationData.longitude,
          locationName: newLocationData.locationName,
          city: newLocationData.city,
          state: newLocationData.state,
          country: newLocationData.country,
        });
      } catch (error) {
        const err = error as TError;
        toast.error(err?.data?.message || "Failed to update location!");
      }

      setPermissionStatus("granted");
      setBooleanCookie(COOKIE_NAMES.LOCATION_PERMISSION_GRANTED, true);

      // Close modal after successful location update
      setTimeout(() => {
        if (isMountedRef.current) {
          setIsOpen(false);
        }
      }, 1500);
    } catch (error) {
      console.error("Permission request failed:", error);

      // Check if component is still mounted
      if (!isMountedRef.current) return;

      if (error instanceof GeolocationPositionError) {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            toast.error("Location permission denied");
            setPermissionStatus("denied");
            break;
          case error.POSITION_UNAVAILABLE:
            toast.error("Location information unavailable");
            setPermissionStatus("denied");
            break;
          case error.TIMEOUT:
            toast.error("Location request timed out");
            setPermissionStatus("prompt"); // Allow retry
            break;
          default:
            toast.error("An unknown error occurred");
            setPermissionStatus("denied");
        }
      } else {
        toast.error("Failed to get location");
        setPermissionStatus("denied");
      }
    } finally {
      if (isMountedRef.current) {
        setIsRequesting(false);
      }
    }
  }, [user, isRequesting, setLatestLocation, setBooleanCookie]);
  // Initialize previous location data (removed cookie dependency)
  useEffect(() => {}, []);

  useEffect(() => {
    setMounted(true);
    isMountedRef.current = true;

    if (typeof window !== "undefined") {
      // Migrate from localStorage to cookies
      try {
        migrateFromLocalStorage();
      } catch (error) {
        console.error("Error migrating from localStorage:", error);
      }
    }

    // Check if user exists and doesn't have permission stored
    if (user) {
      const hasPermission = getBooleanCookie(
        COOKIE_NAMES.LOCATION_PERMISSION_GRANTED
      );
      const hasDeclined = getBooleanCookie(
        COOKIE_NAMES.LOCATION_PERMISSION_DENIED
      );

      // Only show modal if permission not granted and not previously declined
      if (!hasPermission && !hasDeclined) {
        setIsOpen(true);
      }
    }

    return () => {
      isMountedRef.current = false;
      setMounted(false);
    };
  }, [user, getBooleanCookie]);

  // Handle modal open/close effects
  useEffect(() => {
    if (isOpen && mounted) {
      document.body.style.overflow = "hidden";
      // Don't check permission status automatically
      // Keep it as "prompt" to ask user
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, mounted]);

  const handleCloseModal = useCallback(() => {
    if (!isRequesting) {
      setIsOpen(false);
    }
  }, [isRequesting]);

  const handleDeny = useCallback(() => {
    if (isRequesting) return;

    setPermissionStatus("denied");
    setBooleanCookie(COOKIE_NAMES.LOCATION_PERMISSION_DENIED, true);
    setIsOpen(false);
  }, [isRequesting, setBooleanCookie]);

  const handleModalClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const getStatusConfig = () => {
    switch (permissionStatus) {
      case "granted":
        return {
          icon: <Check className="w-6 h-6" />,
          iconBg: "bg-green-100",
          iconColor: "text-green-600",
          confirmBg: "bg-green-600 hover:bg-green-700",
        };
      case "denied":
        return {
          icon: <AlertCircle className="w-6 h-6" />,
          iconBg: "bg-red-100",
          iconColor: "text-red-600",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
        };
      case "checking":
        return {
          icon: <Loader2 className="w-6 h-6 animate-spin" />,
          iconBg: "bg-yellow-100",
          iconColor: "text-yellow-600",
          confirmBg: "bg-yellow-600 hover:bg-yellow-700",
        };
      default:
        return {
          icon: <MapPin className="w-6 h-6" />,
          iconBg: "bg-blue-100",
          iconColor: "text-blue-600",
          confirmBg: "bg-blue-600 hover:bg-blue-700",
        };
    }
  };

  const statusConfig = getStatusConfig();

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4"
          style={{ zIndex: 9999 }}
          onClick={handleCloseModal}
        >
          <motion.div
            className="w-full max-w-md bg-white rounded-xl shadow-2xl relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            onClick={handleModalClick}
          >
            <button
              className="absolute top-4 right-4 text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-gray-100 transition-colors disabled:opacity-50"
              onClick={handleCloseModal}
              disabled={isRequesting}
              aria-label="Close modal"
            >
              <IoMdClose size={18} />
            </button>

            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${statusConfig.iconBg}`}>
                  <div className={statusConfig.iconColor}>
                    {statusConfig.icon}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {permissionStatus === "granted"
                  ? "Location Updated Successfully!"
                  : permissionStatus === "denied"
                  ? "Location Permission Denied"
                  : permissionStatus === "checking"
                  ? "Getting Your Location..."
                  : "Location Permission"}
              </h3>

              <div className="text-center mb-6">
                {permissionStatus === "granted" && (
                  <p className="text-green-600">
                    Your location has been updated successfully!
                  </p>
                )}
                {permissionStatus === "checking" && (
                  <p className="text-yellow-600">
                    Please wait while we get your location...
                  </p>
                )}

                {permissionStatus === "prompt" && (
                  <div className="space-y-3">
                    <p className="text-gray-800 font-medium">
                      Do you want to share your location?
                    </p>
                    <p className="text-sm text-gray-600">
                      We&apos;ll use your location to provide better matches and
                      experiences. Your location data is kept secure and
                      private.
                    </p>
                  </div>
                )}
              </div>

              {permissionStatus === "denied" && (
                <div className="flex items-center justify-center bg-red-50 text-red-700 p-3 rounded-md mb-4">
                  <AlertCircle size={20} className="mr-2" />
                  <span className="text-sm">
                    You can enable location access in your browser settings.
                  </span>
                </div>
              )}

              <div className="flex flex-col md:flex-row gap-5 justify-center">
                {permissionStatus !== "granted" && (
                  <button
                    className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={handleDeny}
                    disabled={isRequesting}
                  >
                    No
                  </button>
                )}

                {permissionStatus !== "granted" && (
                  <button
                    className={`px-8 py-3 rounded-xl font-medium transition-colors cursor-pointer ${statusConfig.confirmBg} text-white disabled:opacity-50 disabled:cursor-not-allowed`}
                    onClick={handleRequestPermission}
                    disabled={isRequesting}
                  >
                    {isRequesting ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Getting Location...
                      </div>
                    ) : (
                      "Yes"
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (!mounted) return null;

  return createPortal(modalContent, document.body);
};

export default LocationPermission;
