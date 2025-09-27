"use client";
import CustomInput from "@/components/custom/custom-input";
import { LocationDetails } from "@/hooks/useGoogleLocationSearch";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import ActivityCard from "./ActivityCard";
import LocationSearchInput from "@/components/custom/LocationSearchInput";

interface DayCardProps {
  control: Control<{
    tripName: string;
    travelMode: string;
    departure: string;
    arrival: string;
    days: Array<{
      dayNumber: number;
      location: { latitude: number; longitude: number };
      locationName: string;
      activities: Array<{
        time: string;
        description: string;
        link?: string;
        duration: string;
        cost?: number;
        rating: number;
      }>;
      comment?: string;
      weather?: string;
    }>;
  }>;
}

const DayCard = ({ control }: DayCardProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });

  const {
    setValue,
    watch,
    register,
    formState: { errors },
  } = useFormContext<{
    tripName: string;
    travelMode: string;
    departure: string;
    arrival: string;
    days: Array<{
      dayNumber: number;
      location: { latitude: number; longitude: number };
      locationName: string;
      activities: Array<{
        time: string;
        description: string;
        link?: string;
        duration: string;
        cost?: number;
        rating: number;
      }>;
      comment?: string;
      weather?: string;
    }>;
  }>();

  // Watch all days to get current values
  const watchedDays = watch("days");

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

  // Handle location select for specific day
  const handleLocationSelect = (
    location: LocationDetails,
    dayIndex: number
  ) => {
    setValue(`days.${dayIndex}.locationName`, location.name);
    setValue(`days.${dayIndex}.location`, {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  // Handle input change for location search
  const handleLocationInputChange = (value: string, dayIndex: number) => {
    setValue(`days.${dayIndex}.locationName`, value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Itinerary Days</h4>
        <Button type="link" onClick={addDay} icon={<PlusCircleOutlined />}>
          Add Day
        </Button>
      </div>
      {fields?.map((day, dayIndex) => (
        <div
          key={day.id}
          className="mb-4 p-3 bg-gray-50 rounded-lg border border-[#DDDDDD]"
        >
          <div className="flex justify-between items-center mb-3">
            <h5 className="font-medium">Day {dayIndex + 1}</h5>
            {fields?.length > 1 && (
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
          <div className="mb-3">
            <LocationSearchInput
              name={`days.${dayIndex}.locationName`}
              label="Location" 
              required
              value={watchedDays?.[dayIndex]?.locationName || ""}
              showSelectedInfo={false}
              onLocationSelect={(location) =>
                handleLocationSelect(location, dayIndex)
              }
              onInputChange={(value) =>
                handleLocationInputChange(value, dayIndex)
              }
              placeholder="Where are you exploring? (e.g., Rome, Italy)"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <CustomInput
              name={`days.${dayIndex}.comment`}
              label="Comment"
              placeholder="Any notes for this day? (e.g., Pack sunscreen)"
              fullWidth
              size="md"
              register={register(`days.${dayIndex}.comment`)}
              error={errors?.days?.[dayIndex]?.comment}
            />
            <CustomInput
              name={`days.${dayIndex}.weather`}
              label="Weather"
              placeholder="Expected weather? (e.g., Sunny, 25°C)"
              fullWidth
              size="md"
              register={register(`days.${dayIndex}.weather` as const)}
              error={errors?.days?.[dayIndex]?.weather}
            />
          </div>
          <div className="my-3">
            <ActivityCard control={control} dayIndex={dayIndex} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default DayCard;
