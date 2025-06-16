import React from 'react';
interface DateSeparatorProps {
  label: string;
}

const DateSeparator: React.FC<DateSeparatorProps> = ({ label }) => {
  return (
    <div className="flex items-center justify-center my-4">
      <div className="flex-grow h-px bg-gray-300"></div>
      <div className="mx-4 px-4 py-0.5 bg-gray-100 text-gray-500 text-sm  rounded-full">
        {label}
      </div>
      <div className="flex-grow h-px bg-gray-300"></div>
    </div>
  );
};

export default DateSeparator;