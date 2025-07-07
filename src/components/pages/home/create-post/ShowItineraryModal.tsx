import React, { useRef } from "react";
import {
  X,
  Star,
  Clock,
  MapPin,
  Plane,
  Download,
  Train,
  Bus,
  Car,
  Ship,
  Bookmark,
} from "lucide-react";
import CustomModal from "@/components/custom/custom-modal";
import moment from "moment";
import { IItinerary } from "@/types/itinerary.types";
import Link from "next/link";
import { BiWalk } from "react-icons/bi";
import { IoIosBicycle } from "react-icons/io";
import { useReactToPrint } from "react-to-print";

interface ShowItineraryModalProps {
  visible: boolean;
  onClose: () => void;
  itinerary: IItinerary;
  isEditing?: boolean;
  handleEdit?: () => void;
}

const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} className="text-primary">
        <Star size={14} fill={i <= rating ? "currentColor" : "none"} />
      </span>
    );
  }
  return <div className="flex items-center gap-1">{stars}</div>;
};

// Printable component that will be used for PDF generation
const PrintableItinerary = React.forwardRef<
  HTMLDivElement,
  { itinerary: IItinerary }
>(({ itinerary }, ref) => {
  const formatTime = (time: string | Date | undefined) => {
    if (!time) return "N/A";
    return moment(time, "HH:mm").isValid()
      ? moment(time, "HH:mm").format("h:mm A")
      : "Invalid Time";
  };

  const getTravelModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "plane":
        return <Plane className="size-6 text-blue-500" />;
      case "train":
        return <Train className="size-6 text-blue-500" />;
      case "car":
        return <Car className="size-6 text-blue-500" />;
      case "bus":
        return <Bus className="size-6 text-blue-500" />;
      case "walk":
        return <BiWalk className="size-6 text-blue-500" />;
      case "bicycle":
        return <IoIosBicycle className="size-6 text-blue-500" />;
      case "boat":
        return <Ship className="size-6 text-blue-500" />;
      default:
        return <Plane className="size-6 text-blue-500" />;
    }
  };

  return (
    <div ref={ref} className="p-8 bg-white min-h-screen">
      <style>
        {`
            @media print {
              body { margin: 0; }
              .page-break { page-break-before: always; }
            }
          `}
      </style>

      {/* Header */}
      <div className="text-center mb-8 border-b-2 border-gray-200 pb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Travel Itinerary
        </h1>
        <p className="text-gray-600">
          Generated on {moment().format("MMMM DD, YYYY")}
        </p>
      </div>

      {/* Trip Header */}
      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          {getTravelModeIcon(itinerary?.travelMode)}
          <h2 className="text-2xl font-semibold text-gray-800">
            {itinerary?.tripName}
          </h2>
        </div>
        <p className="text-lg text-gray-600 mb-4">
          {itinerary?.departure} | {itinerary?.arrival}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-base text-gray-600">Overall Rating:</span>
          {itinerary?.overAllRating !== undefined && (
            <StarRating rating={itinerary.overAllRating} />
          )}
        </div>
      </div>

      {/* Days */}
      <div className="space-y-8">
        {itinerary?.days?.map((day, dayIndex) => (
          <div
            key={day?.dayNumber}
            className={dayIndex > 0 ? "page-break" : ""}
          >
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Day Header */}
              <div className="bg-gray-100 px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-red-500" size={20} />
                  <h3 className="text-xl font-semibold text-gray-800">
                    Day {day?.dayNumber}: Arrive in {day?.locationName}
                  </h3>
                </div>
                {day?.weather && (
                  <p className="text-base text-gray-600 mt-2">
                    Weather: {day.weather}
                  </p>
                )}
              </div>

              {/* Activities */}
              <div className="p-6 space-y-6">
                {day?.activities?.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Clock className="text-gray-500" size={18} />
                        <span className="text-lg font-medium text-gray-800">
                          {formatTime(activity?.time)}
                        </span>
                      </div>
                      {activity?.cost > 0 && (
                        <span className="text-lg font-semibold text-green-600">
                          ${activity.cost}
                        </span>
                      )}
                    </div>

                    <div className="mb-3">
                      <p className="text-base text-gray-700 leading-relaxed">
                        {activity?.description?.split("\n")[0]}
                      </p>
                      {activity?.link && (
                        <p className="text-sm text-blue-600 mt-1 break-all">
                          Link: {activity.link}
                        </p>
                      )}
                    </div>
                      <div className="flex items-center justify-between ml-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Rate:</span>
                            {activity?.rating && (
                              <StarRating rating={activity.rating} />
                            )}
                          </div>
                          {activity?.duration && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Duration: {activity.duration}
                            </span>
                          )}
                          {day?.comment && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {day?.comment}
                            </span>
                          )}
                        </div>
                      </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PrintableItinerary.displayName = "PrintableItinerary";

const ShowItineraryModal = ({
  visible,
  onClose,
  itinerary,
  isEditing = false,
  handleEdit,
}: ShowItineraryModalProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    documentTitle: `${itinerary?.tripName || "Itinerary"} - ${moment().format(
      "YYYY-MM-DD"
    )}`,
    onAfterPrint: () => {
      console.log("PDF generated successfully!");
    },
  });

  if (!visible) return null;

  const formatTime = (time: string | Date | undefined) => {
    if (!time) return "N/A";
    return moment(time, "HH:mm").isValid()
      ? moment(time, "HH:mm").format("h:mm A")
      : "Invalid Time";
  };

  const getTravelModeIcon = (mode: string) => {
    switch (mode?.toLowerCase()) {
      case "plane":
        return <Plane className="size-6 text-blue-500" />;
      case "train":
        return <Train className="size-6 text-blue-500" />;
      case "car":
        return <Car className="size-6 text-blue-500" />;
      case "bus":
        return <Bus className="size-6 text-blue-500" />;
      case "walk":
        return <BiWalk className="size-6 text-blue-500" />;
      case "bicycle":
        return <IoIosBicycle className="size-6 text-blue-500" />;
      case "boat":
        return <Ship className="size-6 text-blue-500" />;
      default:
        return <Plane className="size-6 text-blue-500" />;
    }
  };

  return (
    <>
      {/* Hidden printable component */}
      <div style={{ display: "none" }}>
        <PrintableItinerary ref={printRef} itinerary={itinerary} />
      </div>

      <CustomModal
        isOpen={visible}
        onClose={onClose}
        header={
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 rounded-t-xl">
            <div className="flex items-center gap-5">
                <button
                className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-[#E0F7F0] transition-colors"
  
              >
                <Bookmark size={20} />
              </button>
              {/* Download icon */}
              <button
                className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-[#E0F7F0] transition-colors"
                onClick={() => handlePrint()}
                title="Download PDF"
              >
                <Download size={20} />
              </button>
            </div>
            <button
              className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
              onClick={onClose}
            >
              <X size={18} />
            </button>
          </div>
        }
        className="w-full p-2"
      >
        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Trip Header */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              {getTravelModeIcon(itinerary?.travelMode)}
              <h3 className="text-lg font-semibold text-gray-800">
                {itinerary?.tripName}
              </h3>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              {itinerary?.departure} | {itinerary?.arrival}
            </p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-gray-600">Rate:</span>
              {itinerary?.overAllRating !== undefined && (
                <StarRating rating={itinerary.overAllRating} />
              )}
            </div>
          </div>

          {/* Days */}
          <div className="space-y-6">
            {itinerary?.days?.map((day) => (
              <div
                key={day?.dayNumber}
                className="border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* Day Header */}
                <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="text-red-500" size={18} />
                    <h4 className="font-medium text-gray-800">
                      Day {day?.dayNumber}: Arrive in {day?.locationName}
                    </h4>
                  </div>
                  {day?.weather && (
                    <p className="text-sm text-gray-600 mt-1">
                      Weather: {day.weather}
                    </p>
                  )}
                </div>

                {/* Activities */}
                <div className="p-4 space-y-4">
                  {day?.activities?.map((activity, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-blue-500 pl-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="text-gray-500" size={16} />
                          <span className="font-medium text-gray-800">
                            {formatTime(activity?.time)}
                          </span>
                        </div>
                        {activity?.cost > 0 && (
                          <span className="text-base font-medium text-green-600">
                            ${activity.cost}
                          </span>
                        )}
                      </div>
                      <div className="flex items-start gap-3 mb-2">
                        <p className="text-base text-gray-600 ml-6">
                          {activity?.description?.split("\n")[0]}
                        </p>
                        {activity?.link && (
                          <Link
                            href={activity?.link || ""}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-base text-blue-600 hover:underline"
                          >
                            Link
                          </Link>
                        )}
                      </div>
                      <div className="flex items-center justify-between ml-6">
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-gray-600">Rate:</span>
                            {activity?.rating && (
                              <StarRating rating={activity.rating} />
                            )}
                          </div>
                          {activity?.duration && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              Duration: {activity.duration}
                            </span>
                          )}
                          {day?.comment && (
                            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                              {day?.comment}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {isEditing && (
          <div className="w-full mt-5 flex justify-end">
            <button
              className="px-5 py-2 bg-primary text-white rounded-xl cursor-pointer"
              onClick={handleEdit}
            >
              Edit Itinerary
            </button>
          </div>
        )}
      </CustomModal>
    </>
  );
};

export default ShowItineraryModal;
