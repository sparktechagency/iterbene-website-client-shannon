'use client';

import { Input, Button, Rate } from 'antd';
import { motion } from 'framer-motion';
import { DeleteOutlined } from '@ant-design/icons';
import { Activity, Day } from './create-post';

interface ActivityCardProps {
  activity: Activity;
  dayIndex: number;
  activityIndex: number;
  setDays: React.Dispatch<React.SetStateAction<Day[]>>;
  onRemove: () => void;
}

export default function ActivityCard({
  activity,
  dayIndex,
  activityIndex,
  setDays,
  onRemove,
}: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-3 p-2 bg-white rounded border"
    >
      <div className="flex justify-between items-center mb-2">
        <h6 className="text-sm">Activity {activityIndex + 1}</h6>
        <Button
          type="link"
          danger
          icon={<DeleteOutlined />}
          onClick={onRemove}
        >
          Remove
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-2">
        <Input
          type="time"
          value={activity.time}
          onChange={(e) =>
            setDays((prev) => {
              const newDays = [...prev];
              newDays[dayIndex].activities[activityIndex].time = e.target.value;
              return newDays;
            })
          }
        />
        <Input
          type="number"
          placeholder="Cost ($)"
          value={activity.cost}
          onChange={(e) =>
            setDays((prev) => {
              const newDays = [...prev];
              newDays[dayIndex].activities[activityIndex].cost = Number(e.target.value);
              return newDays;
            })
          }
        />
      </div>
      <Input.TextArea
        rows={2}
        placeholder="What are you doing?"
        value={activity.description}
        onChange={(e) =>
          setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities[activityIndex].description = e.target.value;
            return newDays;
          })
        }
        className="mb-2"
      />
      <Rate
        value={activity.rating}
        onChange={(value) =>
          setDays((prev) => {
            const newDays = [...prev];
            newDays[dayIndex].activities[activityIndex].rating = value;
            return newDays;
          })
        }
      />
    </motion.div>
  );
}