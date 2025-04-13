"use client";
import CustomButton from "@/components/custom/custom-button";
import Image from "next/image";

// Define types for the props
interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IInvitation {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
  type: string; // Assuming this could be something like "event", "trip", etc.
}

interface InvitationCardProps {
  invitation: IInvitation;
}

const InvitationCard: React.FC<InvitationCardProps> = ({ invitation }) => {
  return (
    <div>
      <div className="w-full relative border rounded-lg cursor-pointer">
        <div className="relative w-full h-[382px] rounded-lg">
          <Image
            src={invitation?.image?.imageUrl || ""}
            alt={invitation.title}
            width={500}
            height={500}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>
        <div className="absolute p-4 rounded-lg top-0 left-0 right-0 bottom-0 bg-gray-950/30">
          <div className="w-full h-full flex flex-col justify-between">
            <Image
              src={invitation?.author?.profileImage?.imageUrl || ""}
              alt={invitation.author.fullName}
              width={60}
              height={60}
              className="size-[60px] rounded-full object-cover mr-3 ring-2 ring-primary"
            />
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {invitation.title}
            </h2>
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-between gap-8 items-center">
        <CustomButton variant="default" className="px-9 py-3" fullWidth>
          Accept
        </CustomButton>
        <CustomButton variant="outline" className="px-9 py-3" fullWidth>
          Decline
        </CustomButton>
      </div>
    </div>
  );
};

export default InvitationCard;
