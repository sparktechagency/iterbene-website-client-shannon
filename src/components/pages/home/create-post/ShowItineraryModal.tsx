import React from "react";
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
} from "lucide-react";
import CustomModal from "@/components/custom/custom-modal";
import moment from "moment";
import { IItinerary } from "@/types/itinerary.types";
import Link from "next/link";
import { BiWalk } from "react-icons/bi";
import { IoIosBicycle } from "react-icons/io";

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


const ShowItineraryModal = ({
  visible,
  onClose,
  itinerary,
  isEditing = false,
  handleEdit,
}: ShowItineraryModalProps) => {
  // Generate and download PDF for regular itineraries
  const handleGeneratePDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${itinerary?.tripName || "Itinerary"} - ${moment().format("YYYY-MM-DD")}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #ccc; padding-bottom: 20px; }
            .trip-info { background: #f5f5f5; padding: 20px; margin-bottom: 20px; border-radius: 8px; }
            .day-section { margin-bottom: 30px; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; }
            .day-header { background: #f0f0f0; padding: 15px; border-bottom: 1px solid #ddd; }
            .activity { border-left: 4px solid #3b82f6; padding: 15px; margin-bottom: 15px; }
            .activity-time { font-weight: bold; color: #333; }
            .activity-cost { color: #059669; font-weight: bold; }
            @media print {
              .no-print { display: none; }
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Travel Itinerary</h1>
            <p>Generated on ${moment().format("MMMM DD, YYYY")}</p>
          </div>

          <div class="trip-info">
            <h2>${itinerary?.tripName || 'Travel Itinerary'}</h2>
            <p><strong>Route:</strong> ${itinerary?.departure || 'N/A'} → ${itinerary?.arrival || 'N/A'}</p>
            <p><strong>Travel Mode:</strong> ${itinerary?.travelMode || 'N/A'}</p>
            ${itinerary?.overAllRating ? `<p><strong>Overall Rating:</strong> ${itinerary.overAllRating}/5 stars</p>` : ''}
          </div>

          ${itinerary?.days?.map((day) => `
            <div class="day-section">
              <div class="day-header">
                <h3>Day ${day?.dayNumber}: ${day?.locationName || 'Unknown Location'}</h3>
                ${day?.weather ? `<p><strong>Weather:</strong> ${day.weather}</p>` : ''}
                ${day?.comment ? `<p><strong>Note:</strong> ${day.comment}</p>` : ''}
              </div>
              <div style="padding: 15px;">
                ${day?.activities?.map((activity) => `
                  <div class="activity">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span class="activity-time">${moment(activity?.time, "HH:mm").isValid() ? moment(activity.time, "HH:mm").format("h:mm A") : activity?.time || 'N/A'}</span>
                      ${activity?.cost && activity.cost > 0 ? `<span class="activity-cost">$${activity.cost}</span>` : ''}
                    </div>
                    <p style="margin-bottom: 10px;">${activity?.description || 'No description'}</p>
                    ${activity?.link ? `<p style="color: #3b82f6; font-size: 14px;">Link: ${activity.link}</p>` : ''}
                    <div style="font-size: 12px; color: #666;">
                      ${activity?.rating ? `Rating: ${activity.rating}/5 stars` : ''}
                      ${activity?.duration ? ` • Duration: ${activity.duration}` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

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
      <CustomModal
        isOpen={visible}
        onClose={onClose}
        header={
          <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 rounded-t-xl">
            <div className="flex items-center gap-5">
              {/* Download icon */}
              <button
                className="text-gray-600 border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center hover:bg-[#E0F7F0] transition-colors"
                onClick={() => {
                  if (itinerary?.isPdf && itinerary?.pdfUrl) {
                    // Direct download for PDF
                    const link = document.createElement('a');
                    link.href = itinerary.pdfUrl;
                    link.download = `${itinerary.tripName || 'itinerary'}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  } else {
                    // Generate and download PDF for regular itinerary
                    handleGeneratePDF();
                  }
                }}
                title={itinerary?.isPdf ? "Download PDF" : "Download PDF"}
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
          {itinerary?.isPdf && itinerary?.pdfUrl ? (
            /* PDF Viewer */
            <div className="w-full h-full">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  PDF Itinerary
                </h3>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <iframe
                  src={itinerary.pdfUrl}
                  width="100%"
                  height="600"
                  title="PDF Itinerary"
                  className="border-none"
                />
              </div>
            </div>
          ) : (
            /* Regular Itinerary Display */
            <>
              {/* Trip Header */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {itinerary?.travelMode &&
                    getTravelModeIcon(itinerary?.travelMode)}
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
            </>
          )}
        </div>
        {isEditing && !itinerary?.isPdf && (
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
