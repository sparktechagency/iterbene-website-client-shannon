import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the shape of each item in the list
interface ISelectItem {
  value: string;
  label: string;
}

interface ITextField {
  name: string;
  label?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  items: ISelectItem[];
  value?: string; // Add value prop to control the selected value
}

const CustomSelectField = ({
  name,
  label,
  variant = "default",
  size = "md",
  required = false,
  icon,
  placeholder,
  items,
  fullWidth,
  onClick,
  onChange,
  value, // Controlled value prop
}: ITextField) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null); // Store the display label

  const inputSizeClass = {
    sm: "py-1 px-1.5 text-sm",
    md: "py-[5px] px-1.5 text-base",
    lg: "py-2 px-1.5 text-lg",
  }[size];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (onClick) onClick();
  };

  const handleSelect = (item: ISelectItem) => {
    setSelectedItem(item.label); // Display the label to the user
    if (onChange) {
      const event = {
        target: { value: item.value, name },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(event); // Trigger onChange with the value
    }
    setIsOpen(false);
  };

  // Determine the display label based on the controlled value or placeholder
  const selectedDisplayLabel =
    selectedItem ||
    items.find((item) => item.value === value)?.label ||
    placeholder;

  return (
    <div className={`w-full relative`}>
      {label && (
        <label htmlFor={name} className="block text-gray-950 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        {/* Dropdown Trigger */}
        <div
          className={`${
            fullWidth ? "w-full" : "w-auto"
          } flex items-center ${
            variant === "outline"
              ? "bg-transparent border-b rounded-none"
              : "border rounded-lg"
          } border-[#DDDDDD] ${inputSizeClass}`}
          onClick={toggleDropdown}
        >
          {icon && <div className="pl-2">{icon}</div>}
          <button
            type="button"
            className={`w-full text-left outline-none cursor-pointer ${
              placeholder && !value ? "text-gray-500" : "text-gray-900"
            } ${inputSizeClass}`}
          >
            {selectedDisplayLabel}
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
        </div>

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

export default CustomSelectField;