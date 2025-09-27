import React, { useState } from "react";
import { GoQuestion } from "react-icons/go";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, MapPin, Navigation } from "lucide-react";

const MyMapHeader = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  // Enhanced tooltip animation variants
  const tooltipVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.8,
      rotateX: -15,
      filter: "blur(8px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      filter: "blur(0px)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
    exit: {
      opacity: 0,
      y: -15,
      scale: 0.85,
      rotateX: -10,
      filter: "blur(4px)",
      transition: {
        duration: 0.3,
      },
    },
  };

  // Stagger animation for tooltip content
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring" as const,
        stiffness: 200,
        damping: 20,
      },
    },
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
            />
          </motion.div>

          <AnimatePresence>
            {showTooltip && (
              <motion.div
                variants={tooltipVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute right-0 top-8 w-[400px] bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-[9999]"
              >
                <motion.h3 className="font-semibold text-gray-900 mb-3">
                  How Map Section Works
                </motion.h3>

                {/* Content with stagger animation */}
                <motion.div
                  className="w-full space-y-2"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* Current Location */}
                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100"
                    variants={itemVariants}
                  >
                    <div className="p-2 rounded-full bg-green-500 text-white flex-shrink-0">
                      <MapPin size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">
                        📍 Current Location
                      </h4>
                      <p className="text-sm text-green-700">
                        Your current location is automatically added to the map
                        by default.
                      </p>
                    </div>
                  </motion.div>

                  {/* Visited Locations */}
                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
                    variants={itemVariants}
                  >
                    <div className="p-2 rounded-full bg-blue-500 text-white flex-shrink-0">
                      <Navigation size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">
                        🗺️ Visited Locations
                      </h4>
                      <p className="text-sm text-blue-700">
                        When you add a visited location to your post, it will
                        automatically appear on the map section.
                      </p>
                    </div>
                  </motion.div>

                  {/* Interested Locations */}
                  <motion.div
                    className="flex items-start space-x-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100"
                    variants={itemVariants}
                  >
                    <div className="p-2 rounded-full bg-purple-500 text-white flex-shrink-0">
                      <Heart size={16} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-1">
                        🎯 Interested Locations
                      </h4>
                      <p className="text-sm text-purple-700">
                        When you show interest in an event or accept an event
                        invitation, that location will be added to your map as
                        an interested location.
                      </p>
                    </div>
                  </motion.div>
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
