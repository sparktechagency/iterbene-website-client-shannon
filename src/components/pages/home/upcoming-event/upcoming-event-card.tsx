"use client";
import Image from "next/image";

interface IAuthor {
  fullName: string;
  profileImage: {
    imageUrl: string;
  };
}

interface IEvent {
  id: number;
  title: string;
  author: IAuthor;
  image: {
    imageUrl: string;
  };
}

interface UpcomingEventCardProps {
  event: IEvent;
}

const UpcomingEventCard: React.FC<UpcomingEventCardProps> = ({ event }) => {
  return (
    <div className="w-full relative border rounded-lg cursor-pointer">
      <div className="relative w-full h-[382px] rounded-lg">
        <Image
          src={event?.image?.imageUrl || ""}
          alt={event.title}
          width={500}
          height={500}
          className="w-full h-full object-cover rounded-lg"
        />
      </div>
      <div className="absolute p-4 rounded-lg top-0 left-0 right-0 bottom-0 bg-gray-950/30 ">
        <div className="w-full h-full flex flex-col justify-between">
          <Image
            src={event?.author?.profileImage?.imageUrl || ""}
            alt={event.author.fullName}
            width={60}
            height={60}
            className="size-[60px] rounded-full object-cover mr-3 ring-2 ring-[#40E0D0]"
          />
          <h2 className="text-xl md:text-2xl font-semibold text-white">
            {event.title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventCard;
