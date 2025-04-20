"use client";
import { useState } from "react";
import MyProfileInfo from "./MyProfileInfo";
import EditMyProfileDetails from "./EditMyProfileDetails";
const MyProfileDetails = () => {
  const [editMode, setEditMode] = useState<boolean>(false);

  return (
    <div className="w-full bg-white p-6 rounded-2xl">
      {/* Header with Title and Edit Button */}
      {editMode ? (
        <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Edit Personal Information
          </h2>
          <button
            onClick={() => setEditMode(false)}
            className="px-7 py-2.5 border cursor-pointer border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900"
          >
            <span className="font-medium">View Profile</span>
          </button>
        </div>
      ) : (
        <div className="flex justify-between mb-4 border-b border-[#B5B7C5] pb-4">
          <h2 className="text-lg font-semibold text-gray-800">Details</h2>
          <button
            onClick={() => setEditMode(true)}
            className="px-7 py-2.5 border cursor-pointer border-[#B5B7C5] rounded-xl font-semibold text-sm flex items-center gap-2 text-gray-900"
          >
            <span className="font-medium">Edit</span>
          </button>
        </div>
      )}
      {editMode ? <EditMyProfileDetails /> : <MyProfileInfo />}
    </div>
  );
};

export default MyProfileDetails;
