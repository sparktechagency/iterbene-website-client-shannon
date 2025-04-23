import Image from "next/image";
import { PiUserBold } from "react-icons/pi";
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
  members: string;
}

interface InvitedEventCardProps {
  event: IEvent;
}

const InvitedEventCard: React.FC<InvitedEventCardProps> = ({ event }) => {
  return (
    <div className="w-full bg-white rounded-2xl  p-4 flex flex-col items-center">
      {/* Group Image */}
      <div className="w-full h-[350px] bg-gray-200 rounded-xl mb-4 relative">
        <Image
          src={event.image.imageUrl}
          alt={event.title}
          width={350}
          height={350}
          className="w-full h-full object-cover rounded-2xl mb-4"
        />
        <div className="absolute px-4 py-5 rounded-xl top-0 left-0 right-0 bottom-0 bg-gray-950/20">
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex  justify-between items-center">
              <Image
                src={event?.author?.profileImage?.imageUrl || ""}
                alt={event.author.fullName}
                width={60}
                height={60}
                className="size-[60px] rounded-full object-cover mr-3 "
              />
              <div className="bg-white rounded-full px-4 py-2 flex items-center gap-1">
                <PiUserBold size={24} className="text-secondary" />
                <span className="text-sm font-semibold text-gray-800">
                  {event.members}
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-[32px] font-semibold text-white">
              {event.title}
            </h2>
          </div>
        </div>
      </div>
      {/* Buttons */}
      <div className="flex flex-col gap-3 w-full">
        <button className="bg-secondary hover:bg-[#FEEFE8] hover:text-secondary text-white  px-5 py-3.5 rounded-xl border border-secondary transition cursor-pointer">
          Accept
        </button>
        <button className="border border-[#9EA1B3] text-gray-900 px-5 py-3.5   rounded-xl hover:bg-gray-100 transition cursor-pointer">
          Decline
        </button>
      </div>
    </div>
  );
};

export default InvitedEventCard;
