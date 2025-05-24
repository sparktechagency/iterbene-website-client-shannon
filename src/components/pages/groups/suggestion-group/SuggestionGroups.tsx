"use client";
import {useGetSuggestionsGroupsQuery } from "@/redux/features/group/groupApi";
import { IGroup } from "@/types/group.types";
import SuggestionGroupCard from "./SuggestionGroupCard";
const SuggestionGroups = () => {
  const { data: responseData, isLoading } =
    useGetSuggestionsGroupsQuery(undefined);
  const groupsData = responseData?.data?.attributes?.results;
  let content = null;
  if (isLoading) {
    content = <p>Loading...</p>;
  }
  if (groupsData?.length === 0) {
    content = <p className="text-xl">No suggestions groups found</p>;
  } else if (groupsData?.length > 0) {
    content = (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {groupsData?.map((group: IGroup) => (
          <SuggestionGroupCard key={group?._id} group={group} />
        ))}
      </div>
    );
  }
  return (
    <section className="w-full pt-2 pb-7 mt-7">
      {/* Header Section */}
      <div className="w-full flex items-center justify-between mb-6">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          You Might Like
        </h1>
        <button className="text-primary hover:underline">Show more</button>
      </div>

      {/* Content Section */}
      {content}
    </section>
  );
};

export default SuggestionGroups;
