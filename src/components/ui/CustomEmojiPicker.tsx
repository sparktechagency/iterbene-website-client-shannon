"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Search, X } from "lucide-react";
import {
  emojiService,
  EmojiData,
  EmojiCategory,
} from "@/services/emojiService";

interface CustomEmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  onClose: () => void;
  position?: "top" | "bottom";
  className?: string;
}

const CustomEmojiPicker = memo(
  ({
    onEmojiSelect,
    onClose,
    position = "bottom",
    className = "",
  }: CustomEmojiPickerProps) => {
    const [categories, setCategories] = useState<EmojiCategory[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<EmojiData[]>([]);
    const [frequentEmojis, setFrequentEmojis] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const emojiGridRef = useRef<HTMLDivElement>(null);
    const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

    // Load emojis on mount
    useEffect(() => {
      const loadData = async () => {
        setIsLoading(true);
        await emojiService.loadEmojis();
        const cats = emojiService.getCategories();
        setCategories(cats);
        setActiveCategory(cats[0]?.name || "");
        setFrequentEmojis(emojiService.getFrequentlyUsed());
        setIsLoading(false);
      };

      loadData();
    }, []);

    // Handle search
    useEffect(() => {
      if (searchQuery.trim()) {
        const results = emojiService.searchEmojis(searchQuery);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    }, [searchQuery]);

    // Handle emoji selection
    const handleEmojiClick = (emoji: string) => {
      emojiService.addToFrequentlyUsed(emoji);
      setFrequentEmojis(emojiService.getFrequentlyUsed());
      onEmojiSelect(emoji);
    };

    // Scroll to category
    const scrollToCategory = (categoryName: string) => {
      const element = categoryRefs.current[categoryName];
      if (element && emojiGridRef.current) {
        const container = emojiGridRef.current;
        const elementTop = element.offsetTop - container.offsetTop;
        container.scrollTop = elementTop - 10;
      }
      setActiveCategory(categoryName);
    };

    // Handle scroll to update active category
    const handleScroll = () => {
      if (!emojiGridRef.current) return;

      const container = emojiGridRef.current;
      const scrollTop = container.scrollTop;

      for (const category of categories) {
        const element = categoryRefs.current[category.name];
        if (element) {
          const elementTop = element.offsetTop - container.offsetTop;
          const elementBottom = elementTop + element.offsetHeight;

          if (scrollTop >= elementTop - 50 && scrollTop < elementBottom - 50) {
            setActiveCategory(category.name);
            break;
          }
        }
      }
    };

    // Get container classes based on screen size
    const getPickerClasses = () => {
      const baseClasses = `
      bg-white border border-gray-200 rounded-2xl shadow-xl h-56 overflow-y-auto 
      ${position === "top" ? "mb-2" : "mt-2"}
      ${className}
    `;

      return `${baseClasses} w-80 h-96 md:w-96 md:h-[420px] max-w-[calc(100vw-2rem)]`;
    };

    if (isLoading) {
      return (
        <div className={getPickerClasses()}>
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin w-6 h-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        </div>
      );
    }

    return (
      <div className={getPickerClasses()}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <h3 className="text-sm font-medium text-gray-800">Choose an emoji</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Categories Tab */}
        {!searchQuery && (
          <div className="flex overflow-x-auto px-2 py-2 border-b border-gray-100 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => scrollToCategory(category.name)}
                className={`
                flex-shrink-0 p-2 mx-1 rounded-lg transition-colors text-lg emoji-font
                ${
                  activeCategory === category.name
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-gray-100"
                }
              `}
                title={category.name}
              >
                {category.icon}
              </button>
            ))}
          </div>
        )}

        {/* Emoji Grid */}
        <div
          ref={emojiGridRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto p-2"
        >
          {searchQuery ? (
            // Search Results
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">
                Search Results ({searchResults.length})
              </h4>
              <div className="grid grid-cols-8 gap-1">
                {searchResults.map((emoji, index) => (
                  <button
                    key={`search-${index}`}
                    onClick={() => handleEmojiClick(emoji.character)}
                    className="aspect-square flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors emoji-font active:scale-95"
                    title={emoji.name}
                  >
                    {emoji.character}
                  </button>
                ))}
              </div>
              {searchResults.length === 0 && (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No emojis found for {searchQuery}
                </div>
              )}
            </div>
          ) : (
            // Categories with Emojis
            <div>
              {/* Frequently Used */}
              {frequentEmojis.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-xs font-medium text-gray-600 mb-2 px-1">
                    Frequently Used
                  </h4>
                  <div className="grid grid-cols-8 gap-1 mb-4">
                    {frequentEmojis.slice(0, 16).map((emoji, index) => (
                      <button
                        key={`frequent-${index}`}
                        onClick={() => handleEmojiClick(emoji)}
                        className="aspect-square flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors emoji-font active:scale-95"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Category Sections */}
              {categories.map((category) => (
                <div
                  key={category.name}
                  ref={(el: HTMLDivElement | null) => {
                    categoryRefs.current[category.name] = el;
                    return void 0; // Add this line
                  }}
                  className="mb-4"
                >
                  <h4 className="text-xs font-medium text-gray-600 mb-2 px-1 sticky top-0 bg-white py-1">
                    {category.name}
                  </h4>
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, index) => (
                      <button
                        key={`${category.name}-${index}`}
                        onClick={() => handleEmojiClick(emoji.character)}
                        className="aspect-square flex items-center justify-center text-xl hover:bg-gray-100 rounded-lg transition-colors emoji-font active:scale-95 hover:scale-105"
                        title={emoji.name}
                      >
                        {emoji.character}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-3 py-2 border-t border-gray-100 text-xs text-gray-500 text-center">
          Tap an emoji to use it
        </div>
      </div>
    );
  }
);

CustomEmojiPicker.displayName = "CustomEmojiPicker";

export default CustomEmojiPicker;
