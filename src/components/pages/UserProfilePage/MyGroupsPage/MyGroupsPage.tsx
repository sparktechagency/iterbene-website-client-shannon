"use client";
import { useState } from "react";
import MyJoinedGroups from "./MyJoinedGroups/MyJoinedGroups";
import MyInvitationsGroups from "./MyInvitationsGroup/MyInvitationsGroups";
import { IGroup, IGroupInvite } from "@/types/group.types";

const MyGroupsPage = () => {
  const [activeTab, setActiveTab] = useState<string>("myGroups");
  const [joinedGroups, setJoinedGroups] = useState<IGroup[]>([]);
  const [invitedGroups, setInvitedGroups] = useState<IGroupInvite[]>([]);
  const [joinedPage, setJoinedPage] = useState<number>(1);
  const [invitedPage, setInvitedPage] = useState<number>(1);
  const [hasMoreJoined, setHasMoreJoined] = useState<boolean>(true);
  const [hasMoreInvited, setHasMoreInvited] = useState<boolean>(true);

  return (
    <section className="w-full pb-20">
      {/* Tabs */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex space-x-4">
          <button
            onClick={() => setActiveTab("myGroups")}
            className={`px-9 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === "myGroups" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            My Group
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`px-9 py-1.5 rounded-xl font-medium transition-colors cursor-pointer ${
              activeTab === "invitations" &&
              "bg-[#E9F8F9] border border-primary text-primary"
            }`}
          >
            Invitations
          </button>
        </div>
      </div>
      {/* Content */}
      <div className="w-full">
        {activeTab === "myGroups" ? (
          <MyJoinedGroups
            joinedGroups={joinedGroups}
            setJoinedGroups={setJoinedGroups}
            currentPage={joinedPage}
            setCurrentPage={setJoinedPage}
            hasMore={hasMoreJoined}
            setHasMore={setHasMoreJoined}
          />
        ) : (
          <MyInvitationsGroups
            invitedGroups={invitedGroups}
            setInvitedGroups={setInvitedGroups}
            currentPage={invitedPage}
            setCurrentPage={setInvitedPage}
            hasMore={hasMoreInvited}
            setHasMore={setHasMoreInvited}
          />
        )}
      </div>
    </section>
  );
};

export default MyGroupsPage;
