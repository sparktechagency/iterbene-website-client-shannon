import CustomButton from "@/components/custom/custom-button";
import CustomModal from "@/components/custom/custom-modal";
import { useGetMyConnectionsQuery } from "@/redux/features/connections/connectionsApi";
import { useSendGroupInviteMutation } from "@/redux/features/group/groupApi";
import { IMyConnections } from "@/types/connection.types";
import { TError } from "@/types/error";
import { IGroupDetails, IGroupMember } from "@/types/group.types";
import { Checkbox } from "antd";
import { Search, Users } from "lucide-react";
import Image from "next/image";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { IoCloseSharp } from "react-icons/io5";

interface GroupInviteModalProps {
  groupDetailsData: IGroupDetails;
  isInviteModalOpen: boolean;
  setIsInviteModalOpen: (value: boolean) => void;
  closeInviteModal: () => void;
}

const GroupInviteModal = ({
  groupDetailsData,
  isInviteModalOpen,
  setIsInviteModalOpen,
  closeInviteModal,
}: GroupInviteModalProps) => {
  const [invitedPeople, setInvitedPeople] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [allConnections, setAllConnections] = useState<IMyConnections[]>([]);
  const [hasMore, setHasMore] = useState(true);

  //send invite
  const [inviteGroup, { isLoading: isInviteLoading }] =
    useSendGroupInviteMutation();

  // Get connections with pagination
  const {
    data: responseData,
    isLoading,
    isFetching,
  } = useGetMyConnectionsQuery({
    page,
    limit: 10,
  });

  const connections = useMemo(
    () => responseData?.data?.attributes?.results || [],
    [responseData]
  );

  const totalConnections = responseData?.data?.attributes?.totalResults || 0;

  // Update connections list when new data arrives
  useEffect(() => {
    if (connections?.length > 0) {
      if (page === 1) {
        setAllConnections(connections);
      } else {
        setAllConnections((prev) => {
          const existingIds = prev.map((conn) => conn._id);
          const newConnections = connections.filter(
            (conn: IMyConnections) => !existingIds.includes(conn._id)
          );
          return [...prev, ...newConnections];
        });
      }

      const currentTotal =
        page === 1
          ? connections.length
          : allConnections.length + connections.length;
      setHasMore(currentTotal < totalConnections);
    } else if (page === 1) {
      setAllConnections([]);
      setHasMore(false);
    }
  }, [connections, page, totalConnections, allConnections.length]);

  // Filter connections to show only those not already members or pending members
  const filteredConnections = useMemo(() => {
    const memberIds =
      groupDetailsData?.members?.map((member: IGroupMember) => member._id) ||
      [];

    // Exclude members and pending members
    const eligibleConnections = allConnections.filter(
      (conn) => !memberIds.includes(conn._id)
    );

    if (!searchTerm.trim()) {
      return eligibleConnections;
    }

    const lowercaseSearchTerm = searchTerm.toLowerCase().trim();

    return eligibleConnections.filter((connection) => {
      const fullNameMatch = connection.fullName
        ?.toLowerCase()
        .includes(lowercaseSearchTerm);
      const usernameMatch = connection.username
        ?.toLowerCase()
        .includes(lowercaseSearchTerm);

      return fullNameMatch || usernameMatch;
    });
  }, [allConnections, searchTerm, groupDetailsData?.members]);

  // Infinite scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

      if (
        scrollHeight - scrollTop <= clientHeight + 100 &&
        hasMore &&
        !isFetching &&
        !isLoading
      ) {
        setPage((prev) => prev + 1);
      }
    },
    [hasMore, isFetching, isLoading]
  );

  // Handle connection selection
  const handleConnectionToggle = (connectionId: string) => {
    setInvitedPeople((prev) => {
      if (prev.includes(connectionId)) {
        return prev.filter((id) => id !== connectionId);
      } else {
        return [...prev, connectionId];
      }
    });
  };
  const handleInviteConnections = async () => {
    if (invitedPeople.length === 0) {
      toast.error("Please select at least one person to invite");
      return;
    }

    try {
      const payload = {
        groupId: groupDetailsData?._id,
        to: invitedPeople,
      };
      await inviteGroup(payload).unwrap();
      setInvitedPeople([]);
      setIsInviteModalOpen(false);
      setSearchTerm("");
      setPage(1);
      setAllConnections([]);
      toast.success(
        `Successfully invited ${invitedPeople.length} people to the group!`
      );
    } catch (error) {
      const err = error as TError;
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };
  return (
    <CustomModal
      isOpen={isInviteModalOpen}
      onClose={closeInviteModal}
      maxWidth="max-w-lg"
      maxHeight="max-h-[70vh]"
      header={
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 rounded-t-xl">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Invite friends to this group
          </h2>
          <button
            className="text-gray-600  border-gray-400 cursor-pointer size-10 bg-[#EEFDFB] rounded-full border flex justify-center items-center"
            onClick={closeInviteModal}
          >
            <IoCloseSharp size={18} />
          </button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search for friends by name or username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none"
          />
        </div>

        {invitedPeople.length > 0 && (
          <div className="text-sm text-primary font-medium">
            {invitedPeople.length} people selected
          </div>
        )}

        <div className="space-y-1">
          <h3 className="text-lg font-medium text-gray-800 mb-3">
            Suggested
            {searchTerm && (
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredConnections.length} results)
              </span>
            )}
          </h3>

          <div
            className="max-h-96 overflow-y-auto space-y-2"
            onScroll={handleScroll}
          >
            {filteredConnections?.map((connection) => {
              const isAlreadyInvited = groupDetailsData?.pendingMembers.some(
                (member) => member._id === connection._id
              );
              return (
                <>
                  {isAlreadyInvited ? (
                    <div
                      key={connection?._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={
                              connection?.profileImage || "/default-avatar.png"
                            }
                            alt={connection?.fullName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {connection?.fullName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            @{connection?.username}
                          </p>
                        </div>
                      </div>

                      <div className="text-sm text-gray-500">
                        Already invited
                      </div>
                    </div>
                  ) : (
                    <div
                      key={connection?._id}
                      className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Image
                            src={
                              connection?.profileImage || "/default-avatar.png"
                            }
                            alt={connection?.fullName}
                            width={40}
                            height={40}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {connection?.fullName}
                          </h4>
                          <p className="text-sm text-gray-500">
                            @{connection?.username}
                          </p>
                        </div>
                      </div>

                      <Checkbox
                        checked={invitedPeople.includes(connection?._id)}
                        onChange={() => handleConnectionToggle(connection?._id)}
                      />
                    </div>
                  )}
                </>
              );
            })}

            {(isLoading || isFetching) && (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {!hasMore && allConnections?.length > 0 && !searchTerm && (
              <div className="text-center py-4 text-gray-500 text-sm">
                No more connections to load
              </div>
            )}

            {!isLoading && !isFetching && filteredConnections?.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Users size={48} className="mx-auto mb-2 text-gray-300" />
                <p>No eligible connections found</p>
                {searchTerm && (
                  <p className="text-sm">Try a different search term</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={closeInviteModal}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <CustomButton
            onClick={handleInviteConnections}
            loading={isInviteLoading}
            disabled={invitedPeople.length === 0}
            className={`flex-1 px-4 py-2 rounded-lg transition-colors ${
              invitedPeople.length > 0
                ? "bg-primary text-white hover:bg-primary/90"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            Invite ({invitedPeople.length})
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default GroupInviteModal;
