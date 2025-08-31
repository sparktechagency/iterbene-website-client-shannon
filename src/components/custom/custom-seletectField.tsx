import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

// Define the shape of each item in the list
interface ISelectItem {
  value: string;
  label: string;
}

interface CustomSelectFieldProps {
  name: string;
  label?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  onChange?: (value: string) => void;
  items: ISelectItem[];
  register: UseFormRegisterReturn;
  error?: FieldError;
  disabled?: boolean;
  defaultValue?: string; // 🔥 Simple approach - just pass defaultValue
}

const CustomSelectField = ({
  name,
  label,
  variant = "default",
  size = "md",
  required = false,
  icon,
  placeholder = "Select an option",
  items,
  fullWidth = true,
  onClick,
  onChange,
  register,
  error,
  disabled = false,
  defaultValue = "", // 🔥 Default value prop
}: CustomSelectFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // 🔥 Simple fix: Initialize with defaultValue, no useWatch needed
  const [selectedValue, setSelectedValue] = useState<string>(defaultValue);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // 🔥 Only sync on defaultValue change (component re-render)
  useEffect(() => {
    if (defaultValue && defaultValue !== selectedValue) {
      setSelectedValue(defaultValue);
    }
  }, [defaultValue, selectedValue]);

  // Size classes
  const inputSizeClass = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-2.5 px-3 text-base",
    lg: "py-3 px-4 text-lg",
  }[size];

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Toggle dropdown
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      onClick?.();
    }
  };

  // Handle item selection
  const handleSelect = (item: ISelectItem) => {
    setSelectedValue(item.value);

    // Update form state
    register.onChange({
      target: { value: item.value, name },
    });

    // Call onChange callback
    onChange?.(item.value);

    setIsOpen(false);
  };

  // Get selected item label
  const getSelectedLabel = () => {
    const selectedItem = items.find((item) => item.value === selectedValue);
    return selectedItem?.label || "";
  };

  // Base styles for container
  const containerClasses = `
    ${fullWidth ? "w-full" : "w-auto"}
    flex items-center relative
    ${
      variant === "outline"
        ? "bg-transparent border-b border-primary rounded-none"
        : "border rounded-lg bg-white"
    }
    ${
      error
        ? "border-red-500"
        : disabled
        ? "border-gray-200 bg-gray-50"
        : "border-gray-300 hover:border-orange-400 focus-within:border-orange-500"
    }
    transition-colors duration-200
    ${disabled ? "cursor-not-allowed" : "cursor-pointer"}
  `;

  return (
    <div className="w-full space-y-1" ref={dropdownRef}>
      {/* Label */}
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-950 text-[15px] font-medium"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Hidden input for form registration */}
        <input {...register} type="hidden" value={selectedValue} />

        {/* Select Trigger */}
        <div className={containerClasses} onClick={toggleDropdown}>
          {/* Left Icon */}
          {icon && <div className="flex-shrink-0 pl-3">{icon}</div>}

          {/* Display Value */}
          <div
            className={`flex-1 ${inputSizeClass} ${
              disabled ? "text-gray-400" : "text-gray-900"
            }`}
          >
            <span className={selectedValue ? "text-gray-900" : "text-gray-500"}>
              {getSelectedLabel() || placeholder}
            </span>
          </div>

          {/* Chevron Icon */}
          <div className="flex-shrink-0 pr-3">
            <ChevronDown
              size={20}
              className={`
                transition-transform duration-200
                ${isOpen ? "rotate-180" : ""}
                ${disabled ? "text-gray-300" : "text-gray-500"}
              `}
            />
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && !disabled && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-[9999]"
            >
              {items.length === 0 ? (
                <div className="px-4 py-3 text-gray-500 text-sm">
                  No options available
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={item.value}
                    onClick={() => handleSelect(item)}
                    className={`
                      px-4 py-3 cursor-pointer transition-colors
                      hover:bg-orange-50 border-b border-gray-100 last:border-b-0
                      ${
                        selectedValue === item.value
                          ? "bg-orange-50 text-orange-700 font-medium"
                          : "text-gray-900"
                      }
                    `}
                  >
                    {item.label}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomSelectField;
