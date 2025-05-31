import { Controller, useFormContext } from "react-hook-form";
import { useState } from "react";

type TCustomRatingProps = {
  name: string;
  label?: string;
  required?: boolean;
};

const CustomRating = ({
  name,
  label,
  required = false,
}: TCustomRatingProps) => {
  const { control } = useFormContext();
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block text-gray-950 mb-2 text-[15px]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => field.onChange(star)} // Set rating on click
                  onMouseEnter={() => setHoverValue(star)} // Highlight on hover
                  onMouseLeave={() => setHoverValue(null)} // Reset hover
                  className="focus:outline-none cursor-pointer"
                >
                  <span
                    className={`text-2xl ${
                      star <= (hoverValue || field.value || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                  >
                    ★
                  </span>
                </button>
              ))}
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

export default CustomRating;
