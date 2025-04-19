import React from "react";

interface TButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "default" | "outline";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}
const CustomButton = ({
  children,
  className = "",
  onClick,
  type = "submit",
  variant = "default",
  loading,
  disabled,
  fullWidth,
}: TButtonProps) => {
  const baseClasses = `py-2 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
    fullWidth ? "w-full" : "w-auto"
  }`;

  const variantClasses = {
    default: " border border-[#E2AD96] bg-secondary hover:bg-secondary text-white ",
    outline: "border border-[#9194A9] text-gray-950",
  };

  const disabledClasses = "opacity-60 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${
        disabled || loading ? disabledClasses : "cursor-pointer"
      } ${className}`}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-5 w-5 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default CustomButton;
