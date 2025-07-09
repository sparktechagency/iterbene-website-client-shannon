"use client";
import Skeleton from "@/components/custom/custom-skeleton";
import React from "react";
import { BiMessageSquareDetail } from "react-icons/bi";

const ContactListCardSkeleton = () => {
  return (
    <div className="w-full flex items-center justify-between p-4 rounded-2xl bg-white">
      <div className="flex items-center">
        <Skeleton
          width="60px"
          height="60px"
          className="rounded-full ring ring-primary mr-4"
        />
        <div>
          <Skeleton width="120px" height="1rem" className="rounded-md" />
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <BiMessageSquareDetail size={25} className="cursor-pointer" />
      </div>
    </div>
  );
};

export default ContactListCardSkeleton;
