"use client";
import { useState, useEffect } from "react";
import {
  useGetMyJoinedGroupsQuery,
  useGetMyInvitedGroupsQuery,
} from "@/redux/features/group/groupApi";
import MyJoinedGroups from "./MyJoinedGroups/MyJoinedGroups";
import MyInvitationsGroups from "./MyInvitationsGroup/MyInvitationsGroups";
import { IGroup, IGroupInvite } from "@/types/group.types";
import SelectField from "@/components/custom/SelectField";

const MyGroupsPage = () => {
  const [activeTab, setActiveTab] = useState<"myGroups" | "invitations">(
    "myGroups"
  );
  // Separate sortBy states for each tab
  const [joinedSortBy, setJoinedSortBy] = useState<string>("createdAt");
  const [invitedSortBy, setInvitedSortBy] = useState<string>("createdAt");
  // Data states
  const [joinedGroups, setJoinedGroups] = useState<IGroup[]>([]);
  const [invitedGroups, setInvitedGroups] = useState<IGroupInvite[]>([]);
  // Pagination states
  const [joinedPage, setJoinedPage] = useState<number>(1);
  const [invitedPage, setInvitedPage] = useState<number>(1);
  const [hasMoreJoined, setHasMoreJoined] = useState<boolean>(true);
  const [hasMoreInvited, setHasMoreInvited] = useState<boolean>(true);
  // Loading flags
  const [joinedDataLoaded, setJoinedDataLoaded] = useState<boolean>(false);
  const [invitedDataLoaded, setInvitedDataLoaded] = useState<boolean>(false);

  // API query parameters
  const joinedQueryParams = [
    { key: "page", value: joinedPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: joinedSortBy },
  ];

  const invitedQueryParams = [
    { key: "page", value: invitedPage.toString() },
    { key: "limit", value: "9" },
    { key: "sortBy", value: invitedSortBy },
  ];

  const {
    data: joinedData,
    isLoading: joinedLoading,
    refetch: refetchJoined,
  } = useGetMyJoinedGroupsQuery(joinedQueryParams, {
    skip: activeTab !== "myGroups",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  const {
    data: invitedData,
    isLoading: invitedLoading,
    refetch: refetchInvited,
  } = useGetMyInvitedGroupsQuery(invitedQueryParams, {
    skip: activeTab !== "invitations",
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // Handle joined groups data
  useEffect(() => {
    const groups = joinedData?.data?.attributes?.results || [];
    if (groups?.length > 0) {
      setJoinedGroups((prev) => {
        const existingIds = new Set(prev.map((group) => group._id));
        const newGroups = groups.filter(
          (group: IGroup) => !existingIds.has(group._id)
        );

        if (joinedPage === 1) {
          setJoinedDataLoaded(true);
          return groups;
        } else {
          return [...prev, ...newGroups];
        }
      });
      setHasMoreJoined(
        joinedPage < (joinedData?.data?.attributes?.totalPages || 0)
      );
    } else if (joinedPage === 1 && !joinedDataLoaded) {
      setJoinedDataLoaded(true);
      setJoinedGroups([]);
    }
  }, [joinedData, joinedPage, joinedDataLoaded]);

  // Handle invited groups data
  useEffect(() => {
    const groups = invitedData?.data?.attributes?.results || [];
    if (groups?.length > 0) {
      setInvitedGroups((prev) => {
        const existingIds = new Set(prev.map((group) => group._id));
        const newGroups = groups.filter(
          (group: IGroupInvite) => !existingIds.has(group._id)
        );

        if (invitedPage === 1) {
          setInvitedDataLoaded(true);
          return groups;
        } else {
          return [...prev, ...newGroups];
        }
      });
      setHasMoreInvited(
        invitedPage < (invitedData?.data?.attributes?.totalPages || 0)
      );
    } else if (invitedPage === 1 && !invitedDataLoaded) {
      setInvitedDataLoaded(true);
      setInvitedGroups([]);
    }
  }, [invitedData, invitedPage, invitedDataLoaded]);

  // Handle real-time updates for joined groups
  useEffect(() => {
    if (joinedData?.data?.attributes?.results && joinedGroups.length > 0) {
      setJoinedGroups((prev) => {
        const updatedGroups = joinedData.data.attributes.results as IGroup[];
        const existingIds = new Set(updatedGroups.map((group) => group._id));
        return prev
          .filter((group) => existingIds.has(group._id))
          .map((existingGroup) => {
            const updatedGroup = updatedGroups.find(
              (g) => g._id === existingGroup._id
            );
            return updatedGroup || existingGroup;
          });
      });
    }
  }, [joinedData, joinedGroups.length]);

  // Handle real-time updates for invited groups
  useEffect(() => {
    if (invitedData?.data?.attributes?.results && invitedGroups.length > 0) {
      setInvitedGroups((prev) => {
        const updatedInvitations = invitedData.data.attributes
          .results as IGroupInvite[];
        const existingIds = new Set(updatedInvitations.map((inv) => inv._id));
        return prev
          .filter((inv) => existingIds.has(inv._id))
          .map((existingInvitation) => {
            const updatedInvitation = updatedInvitations.find(
              (e) => e._id === existingInvitation._id
            );
            return updatedInvitation || existingInvitation;
          });
      });
    }
  }, [invitedData, invitedGroups.length]);

  // Handle sort change
  const handleSortChange = (sortValue: string) => {
    if (activeTab === "myGroups") {
      setJoinedSortBy(sortValue);
      setJoinedPage(1); // Reset to first page on sort change
      setJoinedDataLoaded(false);
      refetchJoined();
    } else {
      setInvitedSortBy(sortValue);
      setInvitedPage(1); // Reset to first page on sort change
      setInvitedDataLoaded(false);
      refetchInvited();
    }
  };

  // Handle tab change
  const handleTabChange = (tab: "myGroups" | "invitations") => {
    setActiveTab(tab);
    if (tab === "myGroups" && !joinedDataLoaded) {
      refetchJoined();
    } else if (tab === "invitations" && !invitedDataLoaded) {
      refetchInvited();
    }
  };

  return (
    <section className="w-full pb-20">
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-5 gap-5">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="flex space-x-4">
            <button
              onClick={() => handleTabChange("myGroups")}
              className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "myGroups" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              My Group
            </button>
            <button
              onClick={() => handleTabChange("invitations")}
              className={`px-9 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                activeTab === "invitations" &&
                "bg-[#E9F8F9] border border-primary text-primary"
              }`}
            >
              Invitations
            </button>
          </div>
        </div>

        <div className="w-full max-w-40">
          <SelectField
            items={[
              { label: "Recently", value: "createdAt" },
              { label: "Name (A-Z)", value: "nameAsc" },
              { label: "Name (Z-A)", value: "nameDesc" },
              { label: "Oldest First", value: "-createdAt" },
            ]}
            name="sortBy"
            fullWidth
            placeholder="Sort By"
            value={activeTab === "myGroups" ? joinedSortBy : invitedSortBy}
            onChange={(e) => handleSortChange(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      <div className="w-full">
        <div className={activeTab === "myGroups" ? "block" : "hidden"}>
          <MyJoinedGroups
            joinedGroups={joinedGroups}
            setJoinedGroups={setJoinedGroups}
            currentPage={joinedPage}
            setCurrentPage={setJoinedPage}
            hasMore={hasMoreJoined}
            setHasMore={setHasMoreJoined}
            dataLoaded={joinedDataLoaded}
            setDataLoaded={setJoinedDataLoaded}
            isLoading={joinedLoading}
          />
        </div>
        <div className={activeTab === "invitations" ? "block" : "hidden"}>
          <MyInvitationsGroups
            invitedGroups={invitedGroups}
            setInvitedGroups={setInvitedGroups}
            currentPage={invitedPage}
            setCurrentPage={setInvitedPage}
            hasMore={hasMoreInvited}
            setHasMore={setHasMoreInvited}
            dataLoaded={invitedDataLoaded}
            setDataLoaded={setInvitedDataLoaded}
            isLoading={invitedLoading}
            
          />
        </div>
      </div>
    </section>
  );
};

export default MyGroupsPage;
