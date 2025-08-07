"use client";

import { useState, useEffect, useRef, memo } from "react";
import { Search, Heart, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const searchInputRef = useRef<HTMLInputElement>(null);

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
        
        // Focus search input
        setTimeout(() => searchInputRef.current?.focus(), 100);
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

    // Handle emoji selection with animation
    const handleEmojiClick = (emoji: string) => {
      emojiService.addToFrequentlyUsed(emoji);
      setFrequentEmojis(emojiService.getFrequentlyUsed());
      onEmojiSelect(emoji);
      
    };

    // Scroll to category with smooth animation
    const scrollToCategory = (categoryName: string) => {
      const element = categoryRefs.current[categoryName];
      if (element && emojiGridRef.current) {
        const container = emojiGridRef.current;
        const elementTop = element.offsetTop - container.offsetTop;
        container.scrollTo({
          top: elementTop - 10,
          behavior: 'smooth'
        });
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

    // Get container classes with gorgeous styling
    const getPickerClasses = () => {
      const baseClasses = `
        relative bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-3xl 
        shadow-2xl shadow-purple-500/10 overflow-hidden scrollbar-hide   ${className}`;
      return `${baseClasses} w-96 h-[420px] overflow-y-auto max-w-[calc(100vw-2rem)]`;
    };

    // Loading state with beautiful spinner
    if (isLoading) {
      return (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={getPickerClasses()}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 border-4 border-gradient-to-r from-purple-500 to-pink-500 border-t-transparent rounded-full"
              />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full opacity-20"
              />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 text-sm text-gray-500 font-medium"
            >
              Loading emojis...
            </motion.p>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div 
        initial={{ opacity: 0, y: position === "top" ? -20 : 20 }}
        animate={{ opacity: 1,  y: 0 }}
        exit={{ opacity: 0, y: position === "top" ? -20 : 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={getPickerClasses()}
      >
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 p-4 border-b border-gray-200/50">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search emojis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none  focus:ring-purple-500/20 focus:border-purple-400/50 transition-all duration-200 hover:bg-white/90"
            />
            {searchQuery && (
              <motion.button
                initial={{ scale: 0, rotate: 180 }}
                animate={{ scale: 1, rotate: 0 }}
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 cursor-pointer transform -translate-y-1/2 px-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>

        {/* Categories Tab */}
        <AnimatePresence>
          {!searchQuery && (
            <motion.div
              // initial={{ opacity: 0, y: -20 }}
              // animate={{ opacity: 1, y: 0 }}
              // exit={{ opacity: 0, y: -20 }}
              className="flex overflow-x-auto px-3 py-3 border-b border-gray-200/50 bg-gray-50/30 scrollbar-hide"
            >
              {categories?.map((category, index) => (
                <motion.button
                  key={category.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => scrollToCategory(category.name)}
                  className={`relative px-0.5 py-1  mx-1 rounded-2xl transition-all duration-300 text-2xl cursor-pointer group hover:scale-125 `}
                >
                  <span className={`transition-all duration-200 ${
                    activeCategory === category.name ? 'filter drop-shadow-sm' : ''
                  }`}>
                    {category.icon}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Emoji Grid */}
        <div
          ref={emojiGridRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar"
          style={{
            scrollbarWidth: 'thin',
            scrollbarColor: '#8b5cf6 transparent'
          }}
        >
          {searchQuery ? (
            // Search Results
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-3 px-1">
                <Search className="w-4 h-4 text-purple-500" />
                <h4 className="text-sm font-semibold text-gray-700">
                  Search Results ({searchResults.length})
                </h4>
              </div>
              
              <div className="grid grid-cols-8 gap-1">
                {searchResults?.map((emoji, index) => (
                  <motion.button
                    key={`search-${index}`}
                    // initial={{ opacity: 0, scale: 0.5 }}
                    // animate={{ opacity: 1, scale: 1 }}
                    // transition={{ delay: index * 0.02, type: "spring" }}
                    onClick={() => handleEmojiClick(emoji.character)}
                    className="relative aspect-square cursor-pointer flex items-center justify-center text-2xl  rounded-2xl transition-all duration-200 hover:scale-125 active:scale-95 "
                    title={emoji.name}
                  >
                    <span className="filter hover:drop-shadow-sm transition-all duration-200">
                      {emoji.character}
                    </span>
                    
                  </motion.button>
                ))}
              </div>
              
              {searchResults?.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="text-6xl mb-4">🔍</div>
                  <p className="text-gray-500 font-medium">
                    No emojis found for &ldquo;{searchQuery}&rdquo;
                  </p>
                  <p className="text-gray-400 text-sm mt-2">
                    Try a different search term
                  </p>
                </motion.div>
              )}
            </motion.div>
          ) : (
            // Categories with Emojis
            <div>
              {/* Frequently Used */}
              <AnimatePresence>
                {frequentEmojis.length > 0 && (
                  <motion.div
                    // initial={{ opacity: 0, y: -20 }}
                    // animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                  >
                    <div className="flex items-center gap-2 mb-3 px-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <h4 className="text-sm font-semibold text-gray-700">
                        Frequently Used
                      </h4>
                    </div>
                    <div className="grid grid-cols-8 gap-1 mb-4">
                      {frequentEmojis.slice(0, 16).map((emoji, index) => (
                        <motion.button
                          key={`frequent-${index}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: index * 0.03, type: "spring" }}
                          onClick={() => handleEmojiClick(emoji)}
                          className="aspect-square cursor-pointer flex items-center justify-center text-2xl  rounded-2xl transition-all duration-200 hover:scale-125 active:scale-95"
                        >
                          <span className="filter hover:drop-shadow-sm transition-all duration-200">
                            {emoji}
                          </span>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Category Sections */}
              {categories.map((category) => (
                <motion.div
                  key={category.name}
                  // initial={{ opacity: 0, y: 20 }}
                  // animate={{ opacity: 1, y: 0 }}
                  // transition={{ delay: categoryIndex * 0.1 }}
                  ref={(el: HTMLDivElement | null) => {
                    categoryRefs.current[category.name] = el;
                    return void 0;
                  }}
                  className="mb-6"
                >
                  <div className="sticky top-0 bg-white/95 backdrop-blur-sm py-2 mb-3 px-1 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-purple-500" />
                      <h4 className="text-sm font-semibold text-gray-700">
                        {category.name}
                      </h4>
                      <div className="flex-1 h-px bg-gradient-to-r from-purple-200 to-transparent" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-8 gap-1">
                    {category.emojis.map((emoji, index) => (
                      <motion.button
                        key={`${category.name}-${index}`}
                        // initial={{ opacity: 0, scale: 0.5 }}
                        // animate={{ opacity: 1, scale: 1 }}
                        // transition={{ 
                        //   delay: (categoryIndex * 0.05) + (index * 0.01), 
                        //   type: "spring",
                        //   stiffness: 300,
                        //   damping: 20
                        // }}
                        onClick={() => handleEmojiClick(emoji.character)}
                        className="relative aspect-square cursor-pointer flex items-center justify-center text-2xl  rounded-2xl transition-all duration-200 hover:scale-125 active:scale-95"
                        title={emoji.name}
                      >
                        <span className="filter hover:drop-shadow-sm transition-all duration-200">
                          {emoji.character}
                        </span>
                        
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </motion.div>
    );
  }
);

CustomEmojiPicker.displayName = "CustomEmojiPicker";

export default CustomEmojiPicker;