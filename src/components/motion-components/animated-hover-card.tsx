'use client'
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface AnimatedHoverCardProps {
  trigger: ReactNode;
  children: ReactNode;
  className?: string;
  triggerClassName?: string;
  hoverAnimation?: "scale" | "glow" | "flip" | "rotate";
}

const AnimatedHoverCard = ({
  trigger,
  children,
  className = "",
  triggerClassName = "",
  hoverAnimation = "scale",
}: AnimatedHoverCardProps) => {
  const getHoverAnimation = () => {
    switch (hoverAnimation) {
      case "scale":
        return { scale: 1.05, transition: { duration: 0.3 } };
      case "glow":
        return { boxShadow: "0 0 20px rgba(79, 70, 229, 0.6)", transition: { duration: 0.2 } };
      case "flip":
        return { rotateY: 10, transition: { duration: 0.4 } };
      case "rotate":
        return { rotate: 5, transition: { duration: 0.3 } };
      default:
        return { scale: 1.05, transition: { duration: 0.3 } };
    }
  };

  return (
    <HoverCard>
      <HoverCardTrigger className={triggerClassName}>
        <motion.div whileHover={getHoverAnimation()}>
          {trigger}
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className={`origin-top transition-all duration-300 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  );
};

export default AnimatedHoverCard;