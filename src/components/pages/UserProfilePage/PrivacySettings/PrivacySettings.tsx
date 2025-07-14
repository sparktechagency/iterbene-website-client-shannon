"use client";
import React, { useState, useMemo } from "react";
import {
  Globe,
  Users,
  Lock,
  User,
  Heart,
  Briefcase,
  MessageCircle,
  MapPin,
  Phone,
  ChevronDown,
  Check,
  LucideIcon,
} from "lucide-react";
import { useUpdatePrivacySettingsMutation } from "@/redux/features/users/userApi";
import { TError } from "@/types/error";
import toast from "react-hot-toast";
import useUser from "@/hooks/useUser";

// Define PrivacyVisibility enum to match backend
const PrivacyVisibility = {
  PUBLIC: "Public",
  FRIENDS: "Friends",
  ONLY_ME: "Only Me",
} as const;

type PrivacyVisibilityValue =
  (typeof PrivacyVisibility)[keyof typeof PrivacyVisibility];

// Type for individual privacy settings
interface IPrivacySettings {
  ageRange: PrivacyVisibilityValue;
  nickname: PrivacyVisibilityValue;
  gender: PrivacyVisibilityValue;
  location: PrivacyVisibilityValue;
  locationName: PrivacyVisibilityValue;
  country: PrivacyVisibilityValue;
  state: PrivacyVisibilityValue;
  city: PrivacyVisibilityValue;
  profession: PrivacyVisibilityValue;
  aboutMe: PrivacyVisibilityValue;
  phoneNumber: PrivacyVisibilityValue;
  maritalStatus: PrivacyVisibilityValue;
}

// Type for privacy options in dropdown
interface PrivacyOption {
  value: PrivacyVisibilityValue;
  label: string;
  icon: LucideIcon;
  description: string;
}

// Privacy visibility options for dropdown
const privacyOptions: PrivacyOption[] = [
  {
    value: PrivacyVisibility.PUBLIC,
    label: "Public",
    icon: Globe,
    description: "Anyone can see this",
  },
  {
    value: PrivacyVisibility.FRIENDS,
    label: "Friends",
    icon: Users,
    description: "Only your friends can see this",
  },
  {
    value: PrivacyVisibility.ONLY_ME,
    label: "Only Me",
    icon: Lock,
    description: "Only you can see this",
  },
];

// Type for settings group
interface SettingsGroup {
  title: string;
  icon: LucideIcon;
  description: string;
  settings: {
    key: keyof IPrivacySettings;
    label: string;
    icon: LucideIcon;
  }[];
}

export default function PrivacySettings() {
  const user = useUser();

  const initialPrivacySettings = useMemo(
    () => ({
      ageRange: user?.privacySettings?.ageRange || PrivacyVisibility.ONLY_ME,
      nickname: user?.privacySettings?.nickname || PrivacyVisibility.PUBLIC,
      gender: user?.privacySettings?.gender || PrivacyVisibility.ONLY_ME,
      location: user?.privacySettings?.location || PrivacyVisibility.PUBLIC,
      locationName:
        user?.privacySettings?.locationName || PrivacyVisibility.PUBLIC,
      country: user?.privacySettings?.country || PrivacyVisibility.PUBLIC,
      state: user?.privacySettings?.state || PrivacyVisibility.PUBLIC,
      city: user?.privacySettings?.city || PrivacyVisibility.PUBLIC,
      profession: user?.privacySettings?.profession || PrivacyVisibility.PUBLIC,
      aboutMe: user?.privacySettings?.aboutMe || PrivacyVisibility.PUBLIC,
      phoneNumber:
        user?.privacySettings?.phoneNumber || PrivacyVisibility.ONLY_ME,
      maritalStatus:
        user?.privacySettings?.maritalStatus || PrivacyVisibility.PUBLIC,
    }),
    [user]
  );

  const [privacySettings, setPrivacySettings] =
    useState<IPrivacySettings>(initialPrivacySettings);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [updatePrivacySettingsMutation, { isLoading }] =
    useUpdatePrivacySettingsMutation();

  const handlePrivacyChange = (
    field: keyof IPrivacySettings,
    value: PrivacyVisibilityValue
  ) => {
    setPrivacySettings((prev) => ({
      ...prev,
      [field]: value,
    }));
    setActiveDropdown(null);
  };

  const handleSaveChanges = async () => {
    try {
      await updatePrivacySettingsMutation({
        privacySettings,
      }).unwrap();
      toast.success("Privacy settings updated successfully!");
    } catch (err) {
      const error = err as TError;
      toast.error(error?.data?.message || "Something went wrong!");
    }
  };

  const handleResetToDefault = () => {
    setPrivacySettings({
      ageRange: PrivacyVisibility.ONLY_ME,
      nickname: PrivacyVisibility.PUBLIC,
      gender: PrivacyVisibility.ONLY_ME,
      location: PrivacyVisibility.PUBLIC,
      locationName: PrivacyVisibility.PUBLIC,
      country: PrivacyVisibility.PUBLIC,
      state: PrivacyVisibility.PUBLIC,
      city: PrivacyVisibility.PUBLIC,
      profession: PrivacyVisibility.PUBLIC,
      aboutMe: PrivacyVisibility.PUBLIC,
      phoneNumber: PrivacyVisibility.ONLY_ME,
      maritalStatus: PrivacyVisibility.PUBLIC,
    });
    setActiveDropdown(null);
  };

  const PrivacyDropdown = ({
    field,
    currentValue,
    options,
    onSelect,
  }: {
    field: keyof IPrivacySettings;
    currentValue: PrivacyVisibilityValue;
    options: PrivacyOption[];
    onSelect: (
      field: keyof IPrivacySettings,
      value: PrivacyVisibilityValue
    ) => void;
  }) => {
    const isActive = activeDropdown === field;
    const currentOption = options.find((opt) => opt.value === currentValue);
    const IconComponent = currentOption?.icon || Globe;

    return (
      <div className="relative">
        <button
          onClick={() => setActiveDropdown(isActive ? null : field)}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors min-w-[140px]"
        >
          <IconComponent className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {currentOption?.label}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-gray-500 transition-transform ${
              isActive ? "rotate-180" : ""
            }`}
          />
        </button>

        {isActive && (
          <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
            {options.map((option) => {
              const OptionIcon = option.icon;
              const isSelected = option.value === currentValue;

              return (
                <button
                  key={option.value}
                  onClick={() => onSelect(field, option.value)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                    isSelected ? "bg-blue-50 border-l-4 border-blue-500" : ""
                  }`}
                >
                  <OptionIcon
                    className={`h-5 w-5 ${
                      isSelected ? "text-primary" : "text-gray-500"
                    }`}
                  />
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        isSelected ? "text-primary" : "text-gray-900"
                      }`}
                    >
                      {option.label}
                    </div>
                    <div className="text-sm text-gray-500">
                      {option.description}
                    </div>
                  </div>
                  {isSelected && <Check className="h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const settingsGroups: SettingsGroup[] = [
    {
      title: "Personal Information",
      icon: User,
      description: "Control who can see your personal details",
      settings: [
        { key: "nickname", label: "Nickname", icon: User },
        { key: "ageRange", label: "Age Range", icon: User },
        { key: "gender", label: "Gender", icon: User },
        { key: "maritalStatus", label: "Marital Status", icon: Heart },
        { key: "profession", label: "Profession", icon: Briefcase },
        { key: "aboutMe", label: "About Me", icon: MessageCircle },
        { key: "phoneNumber", label: "Phone Number", icon: Phone },
      ],
    },
    {
      title: "Location Information",
      icon: MapPin,
      description: "Manage visibility of your location details",
      settings: [
        { key: "location", label: "Current Location", icon: MapPin },
        { key: "locationName", label: "Location Name", icon: MapPin },
        { key: "country", label: "Country", icon: Globe },
        { key: "state", label: "State/Province", icon: MapPin },
        { key: "city", label: "City", icon: MapPin },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Privacy Settings
              </h2>
              <p className="text-gray-600">
                Control who can see your information and how you connect with
                others
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <User className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Personal Info</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Location</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 rounded-lg transition-colors">
                  <Users className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Connections</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Privacy Settings Groups */}
            {settingsGroups.map((group) => {
              const GroupIcon = group.icon;
              return (
                <div
                  key={group.title}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <GroupIcon className="h-6 w-6 text-primary" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {group.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {group.settings.map((setting) => {
                      const SettingIcon = setting.icon;
                      return (
                        <div
                          key={setting.key}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="bg-gray-100 p-2 rounded-full">
                              <SettingIcon className="h-4 w-4 text-gray-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {setting.label}
                              </div>
                              <div className="text-sm text-gray-500">
                                {
                                  privacyOptions.find(
                                    (opt) =>
                                      opt.value ===
                                      privacySettings[setting.key]
                                  )?.description
                                }
                              </div>
                            </div>
                          </div>
                          <PrivacyDropdown
                            field={setting.key}
                            currentValue={privacySettings[setting.key]}
                            options={privacyOptions}
                            onSelect={handlePrivacyChange}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleResetToDefault}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                disabled={isLoading}
              >
                Reset to Default
              </button>
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-primary text-white rounded-xl transition-colors cursor-pointer disabled:bg-gray-400"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {activeDropdown && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
}
