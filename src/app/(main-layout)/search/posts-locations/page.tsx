import PostsLocationsSearch from "@/components/pages/search/PostsLocationsSearch";
import { Loader2 } from "lucide-react";
import React, { Suspense } from "react";

const page = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      }
    >
      <PostsLocationsSearch />
    </Suspense>
  );
};

export default page;
