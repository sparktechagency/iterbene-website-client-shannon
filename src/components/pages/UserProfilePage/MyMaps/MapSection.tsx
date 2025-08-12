"use client";

const MapSection = ({
  mapHide,
  showFullMap,
  setShowFullMap,
}: {
  mapHide: boolean;
  showFullMap: boolean;
  setShowFullMap: React.Dispatch<React.SetStateAction<boolean>>;
}) => {

  // Set default center to user's current location from API
  // const userCurrentLocation =
  //   responseData?.data?.attributes?.userCurrentLocation;
  // const defaultCenter: Location =
  //   userCurrentLocation &&
  //   typeof userCurrentLocation.latitude === "number" &&
  //   typeof userCurrentLocation.longitude === "number"
  //     ? {
  //         lat: userCurrentLocation.latitude,
  //         lng: userCurrentLocation.longitude,
  //       }
  //     : {
  //         lat: 40.7128, // Fallback to New York if API data is unavailable or invalid
  //         lng: -74.006,
  //       };

  // Get locations from API data
  // const interestedPlaces: Location[] = responseData?.data?.attributes
  //   ?.interestedLocations
  //   ? responseData.data.attributes.interestedLocations.map(
  //       (loc: ITripVisitedLocation) => ({
  //         lat: loc.latitude,
  //         lng: loc.longitude,
  //       })
  //     )
  //   : [];

  // const visitedPlaces: Location[] = responseData?.data?.attributes
  //   ?.visitedLocations
  //   ? responseData.data.attributes.visitedLocations.map(
  //       (loc: ITripVisitedLocation) => ({
  //         lat: loc.latitude,
  //         lng: loc.longitude,
  //       })
  //     )
  //   : [];

  // const homeLocation: Location = defaultCenter;

  // Custom marker icons with better error handling
  // const getCustomIcons = () => {
  //   if (!isLoaded || !window.google || !window.google.maps) {
  //     console.warn("Google Maps not loaded yet");
  //     return null;
  //   }

  //   try {
  //     const Size = window.google.maps.Size;
  //     return {
  //       interested: {
  //         url: "https://iter-bene.s3.eu-north-1.amazonaws.com/basic/interested.png",
  //         scaledSize: new Size(40, 40),
  //         optimized: false,
  //         anchor: new window.google.maps.Point(20, 40),
  //       },
  //       visited: {
  //         url: "https://iter-bene.s3.eu-north-1.amazonaws.com/basic/visit.png",
  //         scaledSize: new Size(40, 40),
  //         optimized: false,
  //         anchor: new window.google.maps.Point(20, 40),
  //       },
  //       home: {
  //         url: "https://iter-bene.s3.eu-north-1.amazonaws.com/basic/home.png",
  //         scaledSize: new Size(40, 40),
  //         optimized: false,
  //         anchor: new window.google.maps.Point(20, 40),
  //       },
  //     };
  //   } catch (error) {
  //     console.error("Error creating custom icons:", error);
  //     return null;
  //   }
  // };

  // Handle map toggle without button nesting
  const handleMapToggle = () => {
    setShowFullMap(!showFullMap);
  };

  return (
    <div
      className={`w-full relative px-1 md:px-2 py-2 md:py-4 ${
        mapHide ? "hidden" : showFullMap ? "col-span-full" : ""
      }`}
    >
      {/* Map Controls - Separate from map to avoid nesting issues */}
      <div className="absolute top-4 right-4 z-30 flex gap-2">
        {/* Example: Full screen toggle button */}
        <button
          onClick={handleMapToggle}
          className="bg-white hover:bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-sm transition-colors cursor-pointer"
          aria-label={showFullMap ? "Exit full screen" : "Enter full screen"}
        >
          {showFullMap ? (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9V4.5M15 9h4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15v4.5m0-4.5h4.5m-4.5 0l5.25 5.25"
              />
            </svg>
          ) : (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default MapSection;
