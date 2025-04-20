import { EyeIcon, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  variant?: "default" | "outline";
  size?: "sm" | "md" | "lg";
  required?: boolean;
  fullWidth?: boolean;
  placeholder?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const CustomInput = ({
  name,
  label,
  type = "text",
  size = "md",
  variant = "default",
  required = false,
  placeholder = "Enter value",
  icon,
  onClick,
  onChange,
}: TInputProps) => {
  const { control } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePassword = () => setShowPassword((prev) => !prev);

  // Input size class based on the prop
  const inputSizeClass = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-3 text-base",
    lg: "py-4 px-3 text-lg",
  }[size];

  const inputType = type === "password" && showPassword ? "text" : type; // Toggle password type

  return (
    <div className={`w-full relative`}>
      {label && (
        <label htmlFor={name} className="block text-gray-950 mb-2 font-medium text-[16px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <div
              className={`flex items-center ${variant === "outline"
                  ? "bg-transparent border-b rounded-none"
                  : "border rounded-xl"
                } ${error ? "border-red-500" : "border-[#9194A9]"}`}
            >
              {/* Icon in front of the input */}
              {icon && <div className="pl-2">{icon}</div>}
              <input
                {...field}
                value={field.value || ""} // Ensure the input is controlled
                type={inputType}
                placeholder={placeholder}
                required={required}
                onChange={(e) => {
                  field.onChange(e); // Call react-hook-form's onChange
                  if (onChange) onChange(e); // Call custom onChange if provided
                }}
                onClick={onClick}
                className={`w-full ${inputSizeClass} outline-none font-medium text-gray-900`}
              />
              {/* Password visibility toggle icon */}
              {type === "password" && (
                <button
                  type="button"
                  onClick={togglePassword}
                  className="text-gray-500 p-2 cursor-pointer"
                >
                  {showPassword ? <EyeIcon size={24} /> : <EyeOff size={24} />}
                </button>
              )}
            </div>
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