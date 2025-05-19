"use client";
import { Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import CustomInput from "@/components/custom/custom-input";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import { useEffect, useRef } from "react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface DayCardProps {
  control: Control;
}

const DayCard = ({ control }: DayCardProps)  => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });

  const { setValue } = useFormContext();

  // Load Google Maps API
  const { isLoaded, error } = useGoogleMaps(
    process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY || ""
  );

  const addDay = () => {
    append({
      dayNumber: fields.length + 1,
      location: { latitude: 0, longitude: 0 },
      locationName: "",
      activities: [
        {
          time: "",
          description: "",
          link: "",
          duration: "",
          cost: 0,
          rating: 0,
        },
      ],
      comment: "",
      weather: "",
    });
  };

  // One day automatically active
  if (fields.length === 0) {
    addDay();
  }

  // Google Maps Autocomplete setup
  const autocompleteRefs = useRef<(google.maps.places.Autocomplete | null)[]>([]);

  useEffect(() => {
    if (!isLoaded || error) {
      if (error) console.error(error);
      return;
    }

    autocompleteRefs.current = fields.map((_, index) => {
      const input = document.getElementById(`location-input-${index}`) as HTMLInputElement;
      if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          types: ["geocode"],
          fields: ["address_components", "geometry", "name"],
        });

        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();
          if (place?.geometry && place?.geometry?.location) {
            console.log("Selected place:", place);
            const locationName = place?.address_components
              ? place?.address_components[0]?.long_name || place?.name
              : place?.name || "";
            setValue(`days.${index}.locationName`, locationName);
            setValue(`days.${index}.location`, {
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
            });
          } else {
            console.warn("No geometry data available for selected place");
          }
        });

        return autocomplete;
      }
      return null;
    });

    return () => {
      autocompleteRefs.current.forEach((autocomplete) => {
        if (autocomplete) {
          google.maps.event.clearInstanceListeners(autocomplete);
        }
      });
      autocompleteRefs.current = [];
    };
  }, [fields, isLoaded, error, setValue]);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Itinerary Days</h4>
        <Button type="link" onClick={addDay} icon={<PlusCircleOutlined />}>
          Add Day
        </Button>
      </div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      {!isLoaded && !error && (
        <p className="text-gray-500 text-sm mb-2">Loading Google Maps...</p>
      )}
      {fields.map((day, dayIndex) => (
        <div
          key={day.id}
          className="mb-4 p-3 bg-gray-50 rounded-lg border border-[#DDDDDD]"
        >
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium">Day {dayIndex + 1}</h5>
            {fields.length > 1 && (
              <Button
                type="link"
                danger
                onClick={() => remove(dayIndex)}
                icon={<DeleteOutlined />}
              >
                Remove Day
              </Button>
            )}
          </div>
          <div className="mb-2">
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Location
            </label>
            <input
              id={`location-input-${dayIndex}`}
              name={`days.${dayIndex}.locationName`}
              placeholder="Where are you exploring? (e.g., Rome, Italy)"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              required
              disabled={!isLoaded || !!error}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <CustomInput
              name={`days.${dayIndex}.comment`}
              label="Comment"
              placeholder="Any notes for this day? (e.g., Pack sunscreen)"
              fullWidth
              size="md"
            />
            <CustomInput
              name={`days.${dayIndex}.weather`}
              label="Weather"
              placeholder="Expected weather? (e.g., Sunny, 25°C)"
              fullWidth
              size="md"
            />
          </div>
          <div className="my-3">
            <ActivityCard control={control} dayIndex={dayIndex} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default DayCard;