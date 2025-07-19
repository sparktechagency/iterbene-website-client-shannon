import React, { useState } from "react";
import { GoQuestion } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";

const MyMapHeader = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Tooltip animation variants for smooth scaling
  const tooltipVariants = {
    hidden: { opacity: 0, y: -10, scale: 0.85 }, // Start smaller for scale-in effect
    visible: { opacity: 1, y: 0, scale: 1 }, // Scale to full size
    exit: { opacity: 0, y: -10, scale: 0.85 }, // Scale down on exit
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between items-center border-b border-[#B5B7C5] pb-5">
        <h1 className="text-xl md:text-2xl font-semibold text-gray-800">
          Travel History
        </h1>
        
        <div className="relative">
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <GoQuestion 
              size={24} 
              className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors"
              onClick={() => setShowTooltip(!showTooltip)}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            />
          </motion.div>
          
          <AnimatePresence>
            {showTooltip && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ 
                  type: "spring", 
                  stiffness: 300, 
                  damping: 25, 
                  mass: 0.8, // Slightly lower mass for smoother scaling
                  duration: 0.3 // Slightly longer for noticeable scale effect
                }}
                className="absolute right-0 top-8 w-80 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-[9999]"
              >
                <motion.h3 
                  className="font-semibold text-gray-900 mb-3"
                >
                  How Map Section Works
                </motion.h3>
                
                <div className="space-y-3 text-sm text-gray-700">
                  <motion.div
                  >
                    <span className="font-medium text-blue-600">📍 Current Location:</span>
                    <p className="mt-1">Your current location is automatically added to the map by default.</p>
                  </motion.div>
                  
                  <motion.div
                  >
                    <span className="font-medium text-green-600">🗺️ Visited Locations:</span>
                    <p className="mt-1">When you add a visited location to your post, it will automatically appear on the map section.</p>
                  </motion.div>
                  
                  <motion.div
                  >
                    <span className="font-medium text-purple-600">🎯 Interested Locations:</span>
                    <p className="mt-1">When you show interest in an event or accept an event invitation, that location will be added to your map as an interested location.</p>
                  </motion.div>
                </div>
                
                <motion.div 
                  className="mt-4 pt-3 border-t border-gray-200"
                >
                  <p className="text-xs text-gray-500">
                    All locations help build your travel history and discover new places to explore!
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyMapHeader;