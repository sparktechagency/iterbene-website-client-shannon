"use client";
import { Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import CustomInput from "@/components/custom/custom-input";
import { Control, useFieldArray } from "react-hook-form";

interface DayCardProps {
  control: Control;
}

export default function DayCard({ control }: DayCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "days",
  });

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

  //   one day automatic active
  if (fields.length === 0) {
    addDay();
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-medium">Itinerary Days</h4>
        <Button type="link" onClick={addDay} icon={<PlusCircleOutlined />}>
          Add Day
        </Button>
      </div>
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
          <CustomInput
            name="location"
            label="Location"
            placeholder="Where are you exploring? (e.g., Rome, Italy)"
            fullWidth
            size="md"
            required
          />
          <div className="grid grid-cols-2 gap-4 mt-2">
            {/* add comment and weather */}
            <CustomInput
              name="comment"
              label="Comment"
              placeholder="Any notes for this day? (e.g., Pack sunscreen)"
              fullWidth
              size="md"
            />
            <CustomInput
              name="weather"
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
