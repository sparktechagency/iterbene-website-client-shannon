import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import type { FieldError, UseFormRegisterReturn } from "react-hook-form";

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
  register?: UseFormRegisterReturn;
  error?: FieldError;
};

const CustomInput = ({
  name,
  fullWidth = true,
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
  register,
  error,
}: TInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Size classes
  const inputSizeClass = {
    sm: "py-2 pl-2  pr-3 text-sm",
    md: "py-2.5 pl-2  pr-3 text-base",
    lg: "py-2.5 pl-2  pr-3 text-lg",
  }[size];

  const textareaSizeClass = {
    sm: "py-2 pl-2  pr-3 text-sm min-h-[80px]",
    md: "py-2.5 pl-2  pr-3 text-base min-h-[100px]",
    lg: "py-2.5 pl-2  pr-3 text-lg min-h-[120px]",
  }[size];

  // Determine input type for password toggle
  const inputType = type === "password" && showPassword ? "text" : type;

  // Base styles for input container
  const containerClasses = `
    ${fullWidth ? "w-full" : "w-auto"}
    flex justify-between items-center relative
    ${
      variant === "outline"
        ? "bg-transparent border-b border-primary rounded-none"
        : "border rounded-lg bg-white"
    }
    ${
      error
        ? "border-red-500 focus-within:border-red-500"
        : "border-gray-300 focus-within:border-orange-500"
    }
    transition-colors duration-200
  `;

  return (
    <div className="w-full space-y-1">
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
      <div className={containerClasses}>
        {/* Left Icon */}
        {icon && (
          <div
            className={`flex-shrink-0 ${
              isTextarea ? "self-center pl-3" : "self-center pl-3"
            }`}
          >
            {icon}
          </div>
        )}

        {/* Input/Textarea */}
        {isTextarea ? (
          <textarea
            {...register}
            id={name}
            placeholder={placeholder}
            maxLength={maxLength}
            onChange={(e) => {
              register.onChange(e);
              onChange?.(e);
            }}
            onClick={onClick}
            className={`
              flex-1 ${textareaSizeClass} 
              outline-none text-gray-900 
              resize-none bg-transparent
              placeholder:text-gray-500
            `}
            autoComplete="off"
          />
        ) : (
          <input
            {...register}
            id={name}
            type={inputType}
            maxLength={maxLength}
            placeholder={placeholder}
            onChange={(e) => {
              register.onChange(e);
              onChange?.(e);
            }}
            onClick={onClick}
            className={`
              flex-1 ${inputSizeClass}
              outline-none text-gray-900 
              bg-transparent
              placeholder:text-gray-500
            `}
            autoComplete="off"
          />
        )}

        {/* Password Toggle */}
        {!isTextarea && type === "password" && (
          <button
            type="button"
            onClick={togglePassword}
            className="flex-shrink-0 p-2 absolute right-0 cursor-pointer text-gray-500 hover:text-gray-700 self-center"
            tabIndex={-1}
          >
            {showPassword ? <EyeIcon size={20} /> : <EyeOff size={20} />}
          </button>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm">{error.message}</p>}
    </div>
  );
};

export default CustomInput;
