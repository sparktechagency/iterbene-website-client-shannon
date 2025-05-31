import React from "react";
import { X, Star, Clock, MapPin, Plane } from "lucide-react";
import CustomModal from "@/components/custom/custom-modal";
import { IItinerary } from "@/types/itinerary.types";
interface ShowItineraryModalProps {
  visible: boolean;
  onClose: () => void;
  itinerary: IItinerary;
}

// Rating component
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


const ShowItineraryModal = ({ visible, onClose,itinerary }: ShowItineraryModalProps) => {
  if (!visible) return null;

  const formatTime = (time: Date) => {
    return time.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <CustomModal
      isOpen={visible}
      onClose={onClose}
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800">Itinerary</h2>
          <button
            className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
      }
    >
      {/* Content */}
      <div className="flex-1 overflow-y-auto ">
        {/* Trip Header */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Plane className="text-blue-600" size={20} />
            <h3 className="text-lg font-semibold text-gray-800">
              {itinerary?.tripName}
            </h3>
          </div>
          <p className="text-sm text-gray-600 mb-2">
            {itinerary?.departure} | {itinerary?.arrival}
          </p>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Rate:</span>
            <StarRating rating={itinerary?.overAllRating} />
          </div>
        </div>

        {/* Days */}
        <div className="space-y-6">
          {itinerary?.days.map((day) => (
            <div
              key={day.dayNumber}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <div className="flex items-center gap-2">
                  <MapPin className="text-red-500" size={18} />
                  <h4 className="font-medium text-gray-800">
                    Day {day.dayNumber}: Arrive in {day.locationName}
                  </h4>
                </div>
              </div>

              {/* Activities */}
              <div className="p-4 space-y-4">
                {day.activities.map((activity, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="text-gray-500" size={16} />
                        <span className="font-medium text-gray-800">
                          {formatTime(activity.time)} -{" "}
                          {activity.description.split("\n")[0]}
                        </span>
                      </div>
                      {activity.link && (
                        <span className="text-blue-600 text-sm cursor-pointer hover:underline">
                          {activity.link}
                        </span>
                      )}
                    </div>

                    {activity.description.includes("\n") && (
                      <p className="text-sm text-gray-600 mb-3 ml-6">
                        {activity.description.split("\n").slice(1).join("\n")}
                      </p>
                    )}

                    <div className="flex items-center justify-between ml-6">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">Rate:</span>
                          {activity.rating && (
                            <StarRating rating={activity.rating} />
                          )}
                        </div>
                        {activity.description.includes("good sleep") && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Have a good sleep with good environment.
                          </span>
                        )}
                        {activity.description.includes("good lunch") && (
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            Have a good good service.
                          </span>
                        )}
                      </div>
                      {activity.cost > 0 && (
                        <span className="text-sm font-medium text-green-600">
                          ${activity.cost}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Summary */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                Overall Rating:
              </span>
              <StarRating rating={itinerary?.overAllRating} />
            </div>
            <div className="text-sm text-gray-600">
              Total Days: {itinerary?.days.length}
            </div>
          </div>
        </div>
      </div>
      {/* Footer Actions */}
      <div className="border-t border-gray-200 px-6 py-4">
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Itinerary
          </button>
        </div>
      </div>
    </CustomModal>
  );
};

export default ShowItineraryModal;
