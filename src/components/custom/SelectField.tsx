import React, { useState, useEffect, useRef } from "react";
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
  onChange?: (event: { target: { value: string } }) => void;
  items: ISelectItem[];
  value?: string;
  disabled?: boolean;
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
  disabled = false,
}: ISelectField) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const inputSizeClass = {
    sm: "py-1 px-1.5 text-sm",
    md: "py-[5px] px-1.5 text-base",
    lg: "py-2 px-1.5 text-lg",
  }[size];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Close dropdown when component unmounts or value changes externally
  useEffect(() => {
    setIsOpen(false);
  }, [value]);

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (item: ISelectItem) => {
    if (disabled) return;
    
    if (onChange) {
      // Mimic event object for compatibility
      onChange({ target: { value: item.value } });
    }
    setIsOpen(false);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();
        toggleDropdown();
        break;
      case "Escape":
        setIsOpen(false);
        break;
      case "ArrowDown":
        event.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  // Find the selected item for display
  const selectedItem = items.find((item) => item.value === value);
  const displayLabel = selectedItem?.label || placeholder;

  return (
    <div className={`w-full relative`} ref={dropdownRef}>
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
          } border-[#DDDDDD] ${inputSizeClass} ${
            disabled ? "bg-gray-100 cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
          whileFocus={{ scale: disabled ? 1 : 1.02 }}
          transition={{ duration: 0.2 }}
        >
          {icon && <div className="pl-2">{icon}</div>}
          <button
            type="button"
            className={`w-full text-left outline-none ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            } ${
              !value ? "text-gray-500" : "text-gray-900"
            } ${inputSizeClass}`}
            onClick={toggleDropdown}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label={label || name}
          >
            {displayLabel}
          </button>
          <div className="pr-2">
            <svg
              className={`w-4 h-4 transform transition-transform ${
                isOpen ? "rotate-180" : ""
              } ${disabled ? "text-gray-400" : "text-gray-600"}`}
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
          {isOpen && !disabled && (
            <motion.ul
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className={`absolute z-50 w-full mt-1 bg-white border border-[#DDDDDD] rounded-lg shadow-lg max-h-60 overflow-auto ${
                variant === "outline" ? "border-b" : ""
              }`}
              role="listbox"
              aria-label={`${label || name} options`}
            >
              {items.length === 0 ? (
                <li className="px-4 py-2 text-gray-500 text-center">
                  No options available
                </li>
              ) : (
                items.map((item) => (
                  <motion.li
                    key={item.value}
                    whileHover={{ backgroundColor: "#f1f5f9" }}
                    className={`px-4 py-2 cursor-pointer text-gray-900 ${
                      value === item.value
                        ? "bg-blue-50"
                        : ""
                    }`}
                    onClick={() => handleSelect(item)}
                    role="option"
                    aria-selected={value === item.value}
                  >
                    {item.label}
                  </motion.li>
                ))
              )}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SelectField;