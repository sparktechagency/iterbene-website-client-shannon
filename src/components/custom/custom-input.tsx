import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { motion } from "framer-motion";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  fullWidth?: boolean;
  maxLength?: number;
  placeholder?: string;
  isTextarea?: boolean;
  icon?: React.ReactNode;
  onClick?: () => void;
  onChange?: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
};

const CustomInput = ({
  name,
  fullWidth,
  label,
  type = "text",
  size = "md",
  variant = "default",
  maxLength,
  required = false,
  placeholder = "Enter value",
  icon,
  isTextarea = false,
  onClick,
  onChange,
}: TInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Input/Textarea size class based on the prop
  const inputSizeClass = {
    sm: "py-1.5 px-3 text-sm",
    md: "py-1.5 px-3 text-base",
    lg: "py-1.5 px-3 text-base",
  }[size];

  // Textarea-specific styles
  const textareaSizeClass = {
    sm: "py-2 px-3 text-sm min-h-[80px]",
    md: "pt-2.5 px-3 text-base min-h-[100px]",
    lg: "py-3 px-3 text-lg min-h-[120px]",
  }[size];

  // Determine input type for password toggle
  const inputType = type === "password" && showPassword ? "text" : type;

  // Handle keyboard events to ensure space and other keys work properly
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Prevent event propagation for important keys
    if (e.key === ' ' || e.key === 'Enter' || e.key === 'Tab') {
      e.stopPropagation();
    }
  };

  // Handle focus events
  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.stopPropagation();
    // Ensure input is selectable
    e.target.style.userSelect = 'text';
    e.target.style.webkitUserSelect = 'text';
  };

  return (
    <div className={`w-full relative`}>
      {label && (
        <label htmlFor={name} className="block text-gray-950 text-[15px] ">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <motion.div
              className={`${
                fullWidth ? "w-full" : "w-auto"
              } flex items-center ${
                variant === "outline"
                  ? "bg-transparent border-b border-primary rounded-none"
                  : "border rounded-lg bg-white"
              } ${error ? "border-red-500" : "border-[#DDDDDD]"}`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Icon in front of the input/textarea */}
              {icon && <div className="pl-2 self-start pt-[6px]">{icon}</div>}
              {isTextarea ? (
                <textarea
                  {...field}
                  id={name}
                  value={field.value || ""}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) onChange(e);
                  }}
                  onClick={onClick}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  className={`w-full ${textareaSizeClass} outline-none text-gray-900 resize-none bg-transparent`}
                  style={{
                    pointerEvents: 'auto',
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                    zIndex: 10001
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              ) : (
                <input
                  {...field}
                  id={name}
                  value={field.value || ""}
                  type={inputType}
                  maxLength={maxLength}
                  placeholder={placeholder}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) onChange(e);
                  }}
                  onClick={onClick}
                  onKeyDown={handleKeyDown}
                  onFocus={handleFocus}
                  className={`w-full ${inputSizeClass} outline-none text-gray-900 bg-transparent`}
                  style={{
                    pointerEvents: 'auto',
                    userSelect: 'text',
                    WebkitUserSelect: 'text',
                    zIndex: 10001
                  }}
                  autoComplete="off"
                  spellCheck="false"
                />
              )}
              {/* Password visibility toggle icon (only for input with type="password") */}
              {!isTextarea && type === "password" && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-gray-500 p-2 cursor-pointer flex-shrink-0"
                  style={{ pointerEvents: 'auto' }}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
                </button>
              )}
            </motion.div>
            {error && (
              <span id={`${name}-error`} className="text-red-500 text-sm mt-1 block">
                {error.message}
              </span>
            )}
          </div>
        )}
      />
    </div>
  );
};

export default CustomInput;