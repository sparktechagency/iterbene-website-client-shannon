"use client";
import React, { useState, useEffect } from "react";
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
  const [setLatestLocation] = useSetLatestLocationMutation();
  const user = useUser(); 

  useEffect(() => {
    const hasPermission =
      localStorage.getItem("locationPermissionGranted") === "true";
    if (user && !hasPermission) {
      setIsOpen(true);
    }
    setMounted(true);
    return () => setMounted(false);
  }, [user]);

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
  }, [isOpen]);

  const checkPermissionStatus = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    try {
      const permission = await navigator.permissions.query({
        name: "geolocation",
      });
      setPermissionStatus(permission.state);
    } catch (error) {
      console.log("Error checking permission status:", error);
      setPermissionStatus("prompt");
    }
  };

  const getAddressFromCoordinates = async (
    latitude: number,
    longitude: number
  ): Promise<Partial<ILocationData>> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results[0]) {
        const addressComponents = data.results[0].address_components;
        let city: string | undefined;
        let state: string | undefined;
        let country: string | undefined;

        for (const component of addressComponents) {
          const types = component.types;
          if (types.includes("locality")) {
            city = component.long_name;
          } else if (types.includes("administrative_area_level_1")) {
            state = component.long_name;
          } else if (types.includes("country")) {
            country = component.long_name;
          }
        }

        return {
          locationName:
            data.results[0].formatted_address || "Address not found",
          city,
          state,
          country,
        };
      } else {
        console.log("Error fetching address:", data.status);
        return { locationName: "Address not found" };
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      return { locationName: "Address not found" };
    }
  };

  const handleRequestPermission = async () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by this browser");
      return;
    }

    setIsRequesting(true);

    try {
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 300000,
          });
        }
      );

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const addressData = await getAddressFromCoordinates(latitude, longitude);

      const newLocationData: ILocationData = {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        locationName: addressData?.locationName || "",
        city: addressData?.city,
        state: addressData?.state,
        country: addressData?.country,
      };

      if (
        locationData &&
        locationData.latitude === newLocationData.latitude &&
        locationData.longitude === newLocationData.longitude &&
        locationData.locationName === newLocationData.locationName &&
        locationData.city === newLocationData.city &&
        locationData.state === newLocationData.state &&
        locationData.country === newLocationData.country
      ) {
        setIsRequesting(false);
        setIsOpen(false);
        localStorage.setItem("locationPermissionGranted", "true");
        return;
      }
      await setLatestLocation(newLocationData).unwrap();
      setPermissionStatus("granted");
      localStorage.setItem("locationPermissionGranted", "true");
      setLocationData(newLocationData);
      setIsRequesting(false);
      setIsOpen(false);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong");
      setIsRequesting(false);
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const handleDeny = () => {
    setPermissionStatus("denied");
    toast.error(
      "Location permission denied. You can enable it later in settings."
    );
    handleCloseModal();
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
              className="absolute top-4 right-4 text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-gray-100 transition-colors"
              onClick={handleCloseModal}
              disabled={isRequesting}
            >
              <IoMdClose size={18} />
            </button>

            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className={`p-3 rounded-full ${statusConfig.iconBg}`}>
                  <div className={statusConfig.iconColor}>
                    {isRequesting ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      statusConfig.icon
                    )}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                {permissionStatus === "granted"
                  ? "Location Access Granted"
                  : permissionStatus === "denied"
                  ? "Location Access Denied"
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

                {permissionStatus !== "denied" && (
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