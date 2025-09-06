import { useJoinGroupMutation } from "@/redux/features/group/groupApi";
import { TError } from "@/types/error";
import { IGroup } from "@/types/group.types";
import Image from "next/image";
import toast from "react-hot-toast";
import { PiUserBold } from "react-icons/pi";
import { UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
const SuggestionGroupCard = ({
  group,
  handleOptimisticUpdateUi,
}: {
  group: IGroup;
  handleOptimisticUpdateUi?: (groupId: string) => void;
}) => {
  const [joinGroup, { isLoading }] = useJoinGroupMutation();
  const router = useRouter();
  const handleJoinGroup = async () => {
    try {
      const payload = { groupId: group?._id };
      await joinGroup(payload).unwrap();
      if (handleOptimisticUpdateUi) {
        handleOptimisticUpdateUi(group?._id);
      }
      toast.success("Successfully joined the group!");
      router.push(`/groups/${group?._id}`);
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      {/* Group Image */}
      <div className="relative w-full h-48 sm:h-52 md:h-56 overflow-hidden">
        <Image
          src={group?.groupImage}
          alt={group?.name}
          width={400}
          height={300}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

        {/* Member Count Badge */}
        <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1.5 flex items-center gap-1.5">
          <PiUserBold size={14} className="text-secondary" />
          <span className="text-xs font-semibold text-gray-800">
            {group?.participantCount}
          </span>
        </div>
        {/* Group Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-lg font-bold text-white truncate mb-1">
            {group?.name}
          </h3>
          <p className="text-white/80 text-sm line-clamp-2">
            {group?.description ||
              "Discover new communities that match your interests"}
          </p>
        </div>
      </div>

      {/* Action Button */}
      <div className="p-4">
        <button
          onClick={handleJoinGroup}
          disabled={isLoading}
          className="w-full cursor-pointer bg-secondary hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <UserPlus size={16} />
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
              Joining...
            </>
          ) : (
            "Join Group"
          )}
        </button>
      </div>
    </div>
  );
};

export default SuggestionGroupCard;
