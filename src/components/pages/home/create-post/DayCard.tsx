"use client";

import { Input, Button } from "antd";
import { motion } from "framer-motion";
import { PlusCircleOutlined } from "@ant-design/icons";
import ActivityCard from "./ActivityCard";
import { Day } from "./create-post";
import CustomButton from "@/components/custom/custom-button";

interface DayCardProps {
  day: Day;
  dayIndex: number;
  setDays: React.Dispatch<React.SetStateAction<Day[]>>;
  onRemove: () => void;
}

export default function DayCard({
  day,
  dayIndex,
  setDays,
  onRemove,
}: DayCardProps) {
  const addActivity = () => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].activities.push({
        time: "",
        description: "",
        cost: 0,
        rating: 0,
      });
      return newDays;
    });
  };

  const removeActivity = (activityIndex: number) => {
    setDays((prev) => {
      const newDays = [...prev];
      newDays[dayIndex].activities = newDays[dayIndex].activities.filter(
        (_, i) => i !== activityIndex
      );
      return newDays;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 p-3 bg-gray-50 rounded-lg border"
    >
      <div className="flex justify-between items-center mb-3">
        <h5 className="font-medium">Day {day.dayNumber}</h5>
        <CustomButton onClick={onRemove}>Remove Day</CustomButton>
      </div>
      <Input
        placeholder="Location (e.g., City, Country)"
        value={day.locationName}
        onChange={(e) =>
          setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].locationName = e.target.value;
            return newDays;
          })
        }
        className="mb-3"
      />
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <h6 className="text-sm font-medium">Activities</h6>
          <Button
            type="link"
            onClick={addActivity}
            icon={<PlusCircleOutlined />}
          >
            Add Activity
          </Button>
        </div>
        {day.activities.map((activity, actIndex) => (
          <ActivityCard
            key={actIndex}
            activity={activity}
            dayIndex={dayIndex}
            activityIndex={actIndex}
            setDays={setDays}
            onRemove={() => removeActivity(actIndex)}
          />
        ))}
      </div>
    </motion.div>
  );
}
