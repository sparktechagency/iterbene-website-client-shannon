import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the shape of each item in the list
interface ISelectItem {
  value: string;
  label: string;
}

interface ISelectField {
  name: string;
  label?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onChange?: (event: { target: { value: string } }) => void; // Updated to mimic event
  items: ISelectItem[];
  value?: string; // Added controlled value prop
}

const SelectField = ({
  name,
  label,
  variant = "default",
  size = "md",
  required = false,
  icon,
  placeholder = "Select an option",
  items,
  fullWidth,
  onChange,
  value = "",
}: ISelectField) => {
  const [isOpen, setIsOpen] = useState(false);
  // Use provided value if controlled, else use internal state
  const [internalValue, setInternalValue] = useState(value);
  const selectedValue = value !== undefined ? value : internalValue;

  const inputSizeClass = {
    sm: "py-1 px-1.5 text-sm",
    md: "py-[5px] px-1.5 text-base",
    lg: "py-2 px-1.5 text-lg",
  }[size];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelect = (item: ISelectItem) => {
    setInternalValue(item.value);
    if (onChange) {
      // Mimic event object for compatibility
      onChange({ target: { value: item.value } });
    }
    setIsOpen(false);
  };

  // Find the selected item for display
  const selectedItem = items.find((item) => item.value === selectedValue);
  const displayLabel = selectedItem?.label || placeholder;

  return (
    <div className={`w-full relative`}>
      {label && (
        <label htmlFor={name} className="block text-gray-950 mb-2 text-[15px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Dropdown Trigger */}
        <motion.div
          className={`${
            fullWidth ? "w-full" : "w-auto"
          } flex items-center ${
            variant === "outline"
              ? "bg-transparent border-b border-primary rounded-none"
              : "border rounded-lg"
          } border-[#DDDDDD] ${inputSizeClass}`}
          whileFocus={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {icon && <div className="pl-2">{icon}</div>}
          <button
            type="button"
            className={`w-full text-left outline-none cursor-pointer ${
              !selectedValue ? "text-gray-500" : "text-gray-900"
            } ${inputSizeClass}`}
            onClick={toggleDropdown}
          >
            {displayLabel}
          </button>
          <div className="pr-2">
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </motion.div>

        {/* Animated Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-10 w-full mt-1 bg-white border border-[#DDDDDD] rounded-lg shadow-lg max-h-60 overflow-auto ${
                variant === "outline" ? "border-b" : ""
              }`}
            >
              {items.map((item) => (
                <motion.li
                  key={item.value}
                  whileHover={{ backgroundColor: "#f1f5f9" }}
                  className="px-4 py-2 text-gray-900 cursor-pointer"
                  onClick={() => handleSelect(item)}
                >
                  {item.label}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SelectField;