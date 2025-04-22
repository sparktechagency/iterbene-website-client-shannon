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
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-3 text-base",
    lg: "py-4 px-3 text-lg",
  }[size];

  // Textarea-specific styles
  const textareaSizeClass = {
    sm: "py-2 px-3 text-sm min-h-[80px]",
    md: "py-3 px-3 text-base min-h-[100px]",
    lg: "py-4 px-3 text-lg min-h-[120px]",
  }[size];

  // Determine input type for password toggle
  const inputType = type === "password" && showPassword ? "text" : type;

  return (
    <div className={`w-full relative`}>
      {label && (
        <label
          htmlFor={name}
          className="block text-gray-950 mb-2 font-medium text-[16px]"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <motion.div
              className={`${fullWidth ? "w-full" : "w-auto"} flex items-center ${
                variant === "outline"
                  ? "bg-transparent border-b rounded-none"
                  : "border rounded-xl"
              } ${error ? "border-red-500" : "border-[#9EA1B3]"}`}
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              {/* Icon in front of the input/textarea */}
              {icon && <div className="pl-2 self-start pt-3">{icon}</div>}
              {isTextarea ? (
                <textarea
                  {...field}
                  value={field.value || ""}
                  placeholder={placeholder}
                  required={required}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) onChange(e);
                  }}
                  onClick={onClick}
                  className={`w-full ${textareaSizeClass} outline-none font-medium text-gray-900 resize-y`}
                />
              ) : (
                <input
                  {...field}
                  value={field.value || ""}
                  type={inputType}
                  placeholder={placeholder}
                  required={required}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onChange) onChange(e);
                  }}
                  onClick={onClick}
                  className={`w-full ${inputSizeClass} outline-none font-medium text-gray-900`}
                />
              )}
              {/* Password visibility toggle icon (only for input with type="password") */}
              {!isTextarea && type === "password" && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-gray-500 p-2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon size={24} /> : <EyeOff size={24} />}
                </button>
              )}
            </motion.div>
            {error && (
              <span id={`${name}-error`} className="text-red-500 text-sm mt-1">
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