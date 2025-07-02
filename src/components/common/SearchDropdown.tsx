import { IHashtag, ISearchResult, TUser } from "@/types/search.types";
import { motion } from "framer-motion";
import { Search, Loader2 } from "lucide-react";
import Image from "next/image"
import { FaRegUserCircle } from "react-icons/fa";

type SearchDropdownProps = {
  isOpen: boolean;
  searchValue: string;
  searchResults: ISearchResult;
  loading: boolean;
  onResultClick: (result: TUser | IHashtag, type: string) => void;
  onSearchPosts: (query: string) => void;
};

const SearchDropdown: React.FC<SearchDropdownProps> = ({
  isOpen,
  searchValue,
  searchResults,
  loading,
  onResultClick,
  onSearchPosts,
}) => {
  if (!isOpen) return null;

  const hasResults =
    searchResults.users.length > 0 || searchResults.hashtags.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50"
    >
      <div className="p-4">
        {loading ? (
          // Loading state
          <div className="flex items-center justify-center py-8">
            <Loader2 className="animate-spin text-primary" size={28} />
          </div>
        ) : hasResults || searchValue ? (
          <div className="space-y-1">
            {/* Always show "Search in posts" option when there are results */}
            {searchValue && (
              <div
                className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                onClick={() => onSearchPosts(searchValue)}
              >
                <div className="flex-shrink-0">
                  <div className="size-8 rounded-full flex items-center justify-center">
                    <Search size={20} />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {searchValue}
                  </p>
                </div>
              </div>
            )}
            {/* Users Section */}
            {searchResults?.users?.length > 0 && (
              <div className="space-y-1">
                {searchResults?.users?.map((user, index) => (
                  <div
                    key={`user-${user?._id || index}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onResultClick(user, "user")}
                  >
                    <div className="flex-shrink-0">
                      {user.profileImage ? (
                        <Image
                          src={user?.profileImage}
                          width={32}
                          height={32}
                          className="size-8 rounded-full object-cover"
                          alt="user"
                        />
                      ) : (
                        <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center">
                          <FaRegUserCircle
                            size={16}
                            className="text-gray-500"
                          />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.fullName || user?.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{user?.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Hashtags Section */}
            {searchResults?.hashtags?.length > 0 && (
              <div className="space-y-1">
                {searchResults.hashtags.map((hashtag, index) => (
                  <div
                    key={`hashtag-${hashtag?.name || index}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    onClick={() => onResultClick(hashtag, "hashtag")}
                  >
                    <div className="flex-shrink-0">
                      <div className="size-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">
                          #
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        #{hashtag?.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {hashtag?.postsCount || 0} Posts
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Empty state
          <div className="text-center py-8 text-gray-500">
            <Search size={24} className="mx-auto mb-2 text-gray-300" />
            <p className="text-sm">Start typing to search...</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SearchDropdown;
