"use client";
import { Button, Rate } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import CustomInput from "@/components/custom/custom-input";
import { Control, Controller, useFieldArray } from "react-hook-form";

interface ActivityCardProps {
  control: Control;
  dayIndex: number;
}

export default function ActivityCard({ control, dayIndex }: ActivityCardProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.activities`,
  });

  const addActivity = () => {
    append({
      time: "",
      description: "",
      link: "",
      duration: "",
      cost: 0,
      rating: 0,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h6 className="text-sm font-medium">Activities</h6>
        <Button type="link" onClick={addActivity} icon={<PlusCircleOutlined />}>
          Add Activity
        </Button>
      </div>
      {fields.map((activity, activityIndex) => (
        <div
          key={activity.id}
          className="mb-3 p-2 bg-white rounded border border-[#DDDDDD]"
        >
          <div className="flex justify-between items-center mb-2">
            <h6 className="text-sm">Activity {activityIndex + 1}</h6>
            {fields.length > 1 && (
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => remove(activityIndex)}
              >
                Remove
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <CustomInput
              name="time"
              label="Time"
              type="time"
              size="md"
              fullWidth
              placeholder="When does this start? (e.g., 9:00 AM)"
              required
            />
            <CustomInput
              name="duration"
              label="Duration"
              type="text"
              size="md"
              fullWidth
              placeholder="How long will it take? (e.g., 2 hours)"
              required
            />
            <CustomInput
              name="link"
              label="Link"
              type="url"
              size="md"
              fullWidth
              placeholder="Add a hotel/booking link (optional)"
            />
            <CustomInput
              name="cost"
              label="Cost ($)"
              type="number"
              size="md"
              fullWidth
              placeholder="How much will it cost? (e.g., 50)"
            />
          </div>
          <CustomInput
            name="description"
            label="Description"
            isTextarea
            fullWidth
            placeholder="What’s the plan? (e.g., Visit the Colosseum)"
            required
          />
          <div className="mt-3">
            <label className="block text-gray-950 mb-1 text-[15px]">
              Rating <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name={`days.${dayIndex}.activities.${activityIndex}.rating`}
              render={({ field }) => (
                <Rate
                  value={field.value}
                  onChange={(value) => field.onChange(value)}
                />
              )}
            />
          </div>
        </div>
      ))}
    </div>
  );
}