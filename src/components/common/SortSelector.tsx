import React from 'react';
import SelectField from '../custom/SelectField';

export interface SortOption {
  label: string;
  value: string;
}

interface SortSelectorProps {
  options: SortOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  fullWidth?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Standardized sort selector component using SelectField
 * Provides consistent sorting UI across all components
 */
const SortSelector: React.FC<SortSelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Sort By",
  label,
  fullWidth = true,
  size = "md"
}) => {
  const handleChange = (event: { target: { value: string } }) => {
    onChange(event.target.value);
  };

  return (
    <div className="w-full max-w-40">
      <SelectField
        name="sortBy"
        label={label}
        items={options}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        fullWidth={fullWidth}
        size={size}
      />
    </div>
  );
};

// Common sort options for reuse across components
export const COMMON_SORT_OPTIONS = {
  timeline: [
    { label: "Recently Added", value: "createdAt" },
    { label: "Oldest First", value: "-createdAt" },
    { label: "Name (A-Z)", value: "fullName" },
    { label: "Name (Z-A)", value: "-fullName" },
  ],
  connections: [
    { label: "Recently Added", value: "createdAt" },
    { label: "Oldest First", value: "-createdAt" },
    { label: "Name (A-Z)", value: "fullName" },
    { label: "Name (Z-A)", value: "-fullName" },
  ],
  groups: [
    { label: "Recently", value: "createdAt" },
    { label: "Name (A-Z)", value: "nameAsc" },
    { label: "Name (Z-A)", value: "nameDesc" },
    { label: "Oldest First", value: "-createdAt" },
  ],
  invitations: [
    { label: "Recently", value: "createdAt" },
    { label: "Name (A-Z)", value: "nameAsc" },
    { label: "Name (Z-A)", value: "nameDesc" },
    { label: "Oldest First", value: "-createdAt" },
  ],
  itinerary: [
    { label: "Recently Added", value: "createdAt" },
    { label: "Oldest First", value: "-createdAt" },
    { label: "Title (A-Z)", value: "title" },
    { label: "Title (Z-A)", value: "-title" },
    { label: "Duration", value: "duration" },
  ]
};

export default SortSelector;