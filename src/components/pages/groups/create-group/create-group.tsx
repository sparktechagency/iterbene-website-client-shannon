'use client';
import React, { useState } from "react";
import { PiPlus } from "react-icons/pi";
import CreateGroupModal from "./create-group-modal";

const CreateGroup: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <section className="w-full mb-8">
      <button
        onClick={openModal}
        className="w-full bg-[#FEEFE8] text-secondary flex justify-center items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer"
      >
        <PiPlus size={24} />
        <span>Create New Group</span>
      </button>

      {/* Render the Modal */}
      <CreateGroupModal isOpen={isModalOpen} onClose={closeModal} />
    </section>
  );
};

export default CreateGroup;
