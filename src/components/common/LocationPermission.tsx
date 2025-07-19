"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Check, AlertCircle, Loader2 } from "lucide-react";
import { createPortal } from "react-dom";
import { IoMdClose } from "react-icons/io";
import toast from "react-hot-toast";
import { useSetLatestLocationMutation } from "@/redux/features/profile/profileApi";
import { TError } from "@/types/error";
import useUser from "@/hooks/useUser";

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
  const [locationData, setLocationData] = useState<ILocationData | null>(null);
  const [previousLocationData, setPreviousLocationData] =
    useState<ILocationData | null>(null);
  const [setLatestLocation] = useSetLatestLocationMutation();
  const user = useUser();

  // Load previous location from localStorage on component mount
  useEffect(() => {
    const savedLocation = localStorage.getItem("userLastLocation");
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation);
        setPreviousLocationData(parsedLocation);
        setLocationData(parsedLocation);
      } catch (error) {
        console.error("Error parsing saved location:", error);
      }
    }
  }, []);

  // Check if locations are different
  const areLocationsDifferent = useCallback(
    (
      newLocation: ILocationData,
      oldLocation: ILocationData | null
    ): boolean => {
      if (!oldLocation) return true;

      const latDiff = Math.abs(
        parseFloat(newLocation.latitude) - parseFloat(oldLocation.latitude)
      );
      const lonDiff = Math.abs(
        parseFloat(newLocation.longitude) - parseFloat(oldLocation.longitude)
      );

      // Consider locations different if they're more than ~100 meters apart (roughly 0.001 degrees)
      return (
        latDiff > 0.001 ||
        lonDiff > 0.001 ||
        newLocation.city !== oldLocation.city ||
        newLocation.state !== oldLocation.state ||
        newLocation.country !== oldLocation.country
      );
    },
    []
  );

  // Memoize checkPermissionStatus to avoid useEffect dependency issues
  const checkPermissionStatus = useCallback(async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionStatus(permission.state);

      // Only fetch location if permission is granted, user exists, and we don't have recent data
      if (permission.state === "granted" && user && !locationData) {
        await handleRequestPermission();
      }
    } catch (error) {
      console.log("Error checking permission status:", error);
      setPermissionStatus("prompt");
    }
  }, [locationData, user]); // Depend on locationData and user

  useEffect(() => {
    setMounted(true);

    // Check if user exists and doesn't have permission stored
    if (user) {
      const hasPermission =
        localStorage.getItem("locationPermissionGranted") === "true";
      const hasDeclined =
        localStorage.getItem("locationPermissionDenied") === "true";

      // Only show modal if permission not granted and not previously declined
      if (!hasPermission && !hasDeclined) {
        setIsOpen(true);
      }

      // If user has permission, automatically check and update location
      if (hasPermission) {
        checkPermissionStatus();
      }
    }

    return () => setMounted(false);
  }, [user, checkPermissionStatus]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      checkPermissionStatus();
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, checkPermissionStatus]);

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

  const handleRequestPermission = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    if (!user) {
      toast.error("User not found. Please log in first.");
      return;
    }

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
              timeout: 15000, // Increased timeout
              maximumAge: 300000,
            }
          );
        }
      );

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      // Get address data
      const addressData = await getAddressFromCoordinates(latitude, longitude);

      const newLocationData: ILocationData = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        locationName: addressData?.locationName || "Location found",
        city: addressData?.city,
        state: addressData?.state,
        country: addressData?.country,
      };

      // Check if location data has actually changed compared to previous location
      const hasLocationChanged = areLocationsDifferent(
        newLocationData,
        previousLocationData
      );

      if (hasLocationChanged) {
        try {
          // Ensure all fields are properly set before sending to API
          const locationPayload: ILocationData = {
            latitude: newLocationData.latitude,
            longitude: newLocationData.longitude,
            locationName: newLocationData.locationName || "Unknown location",
            city: newLocationData.city || "",
            state: newLocationData.state || "",
            country: newLocationData.country || "",
          };
          await setLatestLocation(locationPayload).unwrap();
          // Update both current and previous location data
          setLocationData(locationPayload);
          setPreviousLocationData(locationPayload);

          // Save to localStorage for future comparisons
          localStorage.setItem(
            "userLastLocation",
            JSON.stringify(locationPayload)
          );
        } catch (apiError) {
          console.error("API error:", apiError);
          const err = apiError as TError;
          toast.error(err?.data?.message || "Failed to update location");
          return; // Don't set permission as granted if API call failed
        }
      } else {
        setLocationData(newLocationData);
      }

      setPermissionStatus("granted");
      localStorage.setItem("locationPermissionGranted", "true");

      // Close modal after successful location update
      setTimeout(() => {
        setIsOpen(false);
      }, 1500);
    } catch (error) {
      console.error("Permission request failed:", error);

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
            break;
          default:
            toast.error("An unknown error occurred");
        }
      } else {
        toast.error("Failed to get location");
      }

      setPermissionStatus("denied");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleCloseModal = () => {
    if (!isRequesting) {
      setIsOpen(false);
    }
  };

  const handleDeny = () => {
    if (isRequesting) return;

    setPermissionStatus("denied");
    localStorage.setItem("locationPermissionDenied", "true");
    toast.error(
      "Location permission denied. You can enable it later in settings."
    );
    setIsOpen(false);
  };

  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

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
                  ? "Location Access Granted"
                  : permissionStatus === "denied"
                  ? "Location Access Denied"
                  : permissionStatus === "checking"
                  ? "Getting Your Location..."
                  : "Enable Location Access"}
              </h3>

              <div className="text-center mb-6">
                {permissionStatus === "granted" && (
                  <p className="text-green-600">
                    Your location has been updated successfully!
                  </p>
                )}

                {permissionStatus === "denied" && (
                  <div className="space-y-2">
                    <p className="text-red-600">Location access was denied.</p>
                    <p className="text-sm text-gray-600">
                      You can enable location access in your browser settings to
                      get better matches.
                    </p>
                  </div>
                )}

                {permissionStatus === "checking" && (
                  <p className="text-yellow-600">
                    Please wait while we get your location...
                  </p>
                )}

                {permissionStatus === "prompt" && (
                  <p className="text-gray-600">
                    We need your location to provide better matches and
                    experiences. Your location data is kept secure and private.
                  </p>
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

              <div className="flex gap-3 justify-center">
                <button
                  className="px-8 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleDeny}
                  disabled={isRequesting}
                >
                  {permissionStatus === "denied" ? "Close" : "Not Now"}
                </button>

                {permissionStatus !== "denied" &&
                  permissionStatus !== "granted" && (
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
                        "Allow Location"
                      )}
                    </button>
                  )}
              </div>

              <p className="text-xs text-gray-500 text-center mt-4">
                You can change this setting anytime in your browser preferences.
              </p>
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
