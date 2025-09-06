"use client";
import { Button } from "antd";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";
import CustomInput from "@/components/custom/custom-input";
import { Control, useFieldArray, useFormContext } from "react-hook-form";
import CustomRating from "@/components/custom/CustomRating";

interface ActivityCardProps {
  control: Control;
  dayIndex: number;
}

const ActivityCard = ({ control, dayIndex }: ActivityCardProps) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `days.${dayIndex}.activities`,
  });

  const {
    register,
    formState: { errors },
  } = useFormContext();

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
              name={`days.${dayIndex}.activities.${activityIndex}.time`}
              label="Time"
              type="time"
              size="md"
              fullWidth
              placeholder="When does this start? (e.g., 9:00 AM)"
              required
              register={register(
                `days.${dayIndex}.activities.${activityIndex}.time`,
                {
                  required: "Time is required",
                }
              )}
              error={
                errors?.days?.[dayIndex]?.activities?.[activityIndex]?.time
              }
            />
            <CustomInput
              name={`days.${dayIndex}.activities.${activityIndex}.duration`}
              label="Duration"
              type="text"
              size="md"
              fullWidth
              placeholder="How long will it take? (e.g., 2 hours)"
              required
              register={register(
                `days.${dayIndex}.activities.${activityIndex}.duration`,
                {
                  required: "Duration is required",
                }
              )}
              error={
                errors?.days?.[dayIndex]?.activities?.[activityIndex]?.duration
              }
            />
            <CustomInput
              name={`days.${dayIndex}.activities.${activityIndex}.link`}
              label="Link"
              type="url"
              size="md"
              fullWidth
              placeholder="Add a hotel/booking link (optional)"
              register={register(
                `days.${dayIndex}.activities.${activityIndex}.link`
              )}
              error={
                errors?.days?.[dayIndex]?.activities?.[activityIndex]?.link
              }
            />
            <CustomInput
              name={`days.${dayIndex}.activities.${activityIndex}.cost`}
              label="Cost ($)"
              type="number"
              size="md"
              fullWidth
              placeholder="How much will it cost? (e.g., 50)"
              register={register(
                `days.${dayIndex}.activities.${activityIndex}.cost`
              )}
              error={
                errors?.days?.[dayIndex]?.activities?.[activityIndex]?.cost
              }
            />
          </div>
          <CustomInput
            name={`days.${dayIndex}.activities.${activityIndex}.description`}
            label="Description"
            isTextarea
            fullWidth
            placeholder="What's the plan? (e.g., Visit the Colosseum)"
            required
            register={register(
              `days.${dayIndex}.activities.${activityIndex}.description` as const,
              {
                required: "Description is required",
              }
            )}
            error={
              errors?.days?.[dayIndex]?.activities?.[activityIndex]?.description
            }
          />
          <div className="mt-3">
            <CustomRating
              name={`days.${dayIndex}.activities.${activityIndex}.rating`}
              label="Rating"
              required
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityCard;
