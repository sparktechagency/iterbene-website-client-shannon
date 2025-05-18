'use client';

import { useState } from 'react';
import { Modal, Input, Select, message, Button } from 'antd';
import { motion } from 'framer-motion';
import { PlusCircleOutlined, SendOutlined } from '@ant-design/icons';
import DayCard from './DayCard';
import { Day } from './create-post';

const { Option } = Select;

interface ItineraryModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function ItineraryModal({ visible, onClose }: ItineraryModalProps) {
  const [tripName, setTripName] = useState('');
  const [travelMode, setTravelMode] = useState('');
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [days, setDays] = useState<Day[]>([
    {
      dayNumber: 1,
      locationName: '',
      location: { latitude: 0, longitude: 0 },
      activities: [{ time: '', description: '', cost: 0, rating: 0 }],
    },
  ]);

  const addDay = () => {
    setDays([
      ...days,
      {
        dayNumber: days.length + 1,
        locationName: '',
        location: { latitude: 0, longitude: 0 },
        activities: [{ time: '', description: '', cost: 0, rating: 0 }],
      },
    ]);
  };

  const removeDay = (dayIndex: number) => {
    if (days.length === 1) {
      message.warning('At least one day is required.');
      return;
    }
    setDays(
      days
        .filter((_, index) => index !== dayIndex)
        .map((day, index) => ({
          ...day,
          dayNumber: index + 1,
        }))
    );
  };

  const handleCreateItinerary = () => {
    if (!tripName.trim()) {
      message.error('Please enter a trip name.');
      return;
    }
    console.log({ tripName, travelMode, departure, arrival, days });
    message.success('Itinerary created!');
    setTripName('');
    setTravelMode('');
    setDeparture('');
    setArrival('');
    setDays([
      {
        dayNumber: 1,
        locationName: '',
        location: { latitude: 0, longitude: 0 },
        activities: [{ time: '', description: '', cost: 0, rating: 0 }],
      },
    ]);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      title="Create Itinerary"
      className="max-w-lg max-h-screen overflow-y-auto"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-4"
      >
        <Input
          placeholder="Trip Name (e.g., Summer Vacation 2025)"
          value={tripName}
          onChange={(e) => setTripName(e.target.value)}
          className="mb-4"
        />
        <Select
          placeholder="Select travel mode"
          value={travelMode || undefined}
          onChange={setTravelMode}
          className="w-full mb-4"
          allowClear
        >
          <Option value="CAR">Car</Option>
          <Option value="PLANE">Plane</Option>
          <Option value="TRAIN">Train</Option>
          <Option value="BUS">Bus</Option>
          <Option value="BOAT">Boat</Option>
        </Select>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <Input
            placeholder="Departure (e.g., New York)"
            value={departure}
            onChange={(e) => setDeparture(e.target.value)}
          />
          <Input
            placeholder="Arrival (e.g., Los Angeles)"
            value={arrival}
            onChange={(e) => setArrival(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium">Itinerary Days</h4>
            <Button
              type="link"
              onClick={addDay}
              icon={<PlusCircleOutlined />}
            >
              Add Day
            </Button>
          </div>
          {days.map((day, index) => (
            <DayCard
              key={index}
              day={day}
              dayIndex={index}
              setDays={setDays}
              onRemove={() => removeDay(index)}
            />
          ))}
        </div>
        <Button
          type="primary"
          block
          onClick={handleCreateItinerary}
          icon={<SendOutlined />}
          className="bg-blue-500"
        >
          Create Itinerary
        </Button>
      </motion.div>
    </Modal>
  );
}