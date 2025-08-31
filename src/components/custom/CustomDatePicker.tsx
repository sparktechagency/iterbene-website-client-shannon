import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface CustomDatePickerProps {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  register: UseFormRegisterReturn;
  error?: FieldError;
  onChange?: (value: string) => void;
}

const CustomDatePicker: React.FC<CustomDatePickerProps> = ({
  label,
  name,
  placeholder = "Select date",
  required = false,
  minDate,
  maxDate,
  register,
  error,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inputValue, setInputValue] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate calendar days
  const generateCalendarDays = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  };

  // Check if date is disabled
  const isDateDisabled = (date: Date) => {
    const today = startOfDay(new Date());

    if (minDate && isBefore(date, startOfDay(minDate))) return true;
    if (maxDate && isBefore(startOfDay(maxDate), date)) return true;
    if (!minDate && isBefore(date, today)) return true; // Default: disable past dates

    return false;
  };

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    if (isDateDisabled(date)) return;

    setSelectedDate(date);
    const formattedDate = format(date, "yyyy-MM-dd");
    const displayDate = format(date, "MMM dd, yyyy");

    setInputValue(displayDate);

    // Update form value
    register.onChange({
      target: { value: formattedDate, name },
    });

    // Call onChange callback
    onChange?.(formattedDate);

    setIsOpen(false);
  };

  // Handle input click
  const handleInputClick = () => {
    setIsOpen(!isOpen);
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full space-y-1" ref={containerRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-950 text-[15px] font-medium"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Hidden input for form */}
        <input {...register} type="hidden" />

        {/* Display input */}
        <div
          className={`
            w-full flex items-center px-3 py-2.5 
            border rounded-lg bg-white cursor-pointer
            transition-colors duration-200
            ${
              error
                ? "border-red-500 focus-within:border-red-500"
                : "border-gray-300 hover:border-orange-400 focus-within:border-orange-500"
            }
          `}
          onClick={handleInputClick}
        >
          <input
            id={name}
            type="text"
            value={inputValue}
            placeholder={placeholder}
            readOnly
            className="flex-1 outline-none bg-transparent text-gray-900 placeholder:text-gray-500 cursor-pointer"
          />
          <Calendar size={20} className="text-gray-400 ml-2" />
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}

        {/* Calendar Dropdown */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-2 bg-white rounded-lg border border-gray-200 shadow-lg p-4 w-full max-w-sm z-[9999]"
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <ChevronLeft size={18} className="text-gray-600" />
                </button>

                <h3 className="font-semibold text-gray-800">
                  {format(currentMonth, "MMMM yyyy")}
                </h3>

                <button
                  type="button"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="p-1.5 rounded-full hover:bg-gray-100 cursor-pointer transition-colors"
                >
                  <ChevronRight size={18} className="text-gray-600" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="text-center text-xs font-medium text-gray-500 py-2"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendarDays().map((day, index) => {
                  const isCurrentMonth = isSameMonth(day, currentMonth);
                  const isSelected =
                    selectedDate && isSameDay(day, selectedDate);
                  const isTodayDate = isToday(day);
                  const isDisabled = isDateDisabled(day);

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleDateSelect(day)}
                      disabled={isDisabled}
                      className={`
                        w-8 h-8 text-sm rounded-full transition-all duration-150
                        flex items-center justify-center
                        ${
                          isSelected
                            ? "bg-orange-500 text-white font-semibold"
                            : isTodayDate && isCurrentMonth
                            ? "bg-orange-100 text-orange-700 font-semibold"
                            : isCurrentMonth
                            ? "text-gray-700 hover:bg-gray-100"
                            : "text-gray-700"
                        }
                        ${
                          isDisabled
                            ? "cursor-not-allowed opacity-40"
                            : "cursor-pointer"
                        }
                      `}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomDatePicker;
