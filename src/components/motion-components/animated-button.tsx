'use client'
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  animation?: "scale" | "pulse" | "bounce" | "ripple" | "glow" | "none";
  onClick?: () => void;
  disabled?: boolean;
}

const AnimatedButton = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  animation = "scale",
  onClick,
  disabled = false,
}: AnimatedButtonProps) => {
  const getHoverAnimation = () => {
    if (disabled) return {};
    
    switch (animation) {
      case "scale":
        return { scale: 1.05, transition: { duration: 0.2 } };
      case "pulse":
        return { 
          scale: [1, 1.05, 1],
          transition: { 
            duration: 0.6, 
            repeat: Infinity,
            repeatType: "reverse" as const
          }
        };
      case "bounce":
        return { y: -5, transition: { duration: 0.2 } };
      case "ripple":
        return {
          boxShadow: "0 0 15px rgba(79, 70, 229, 0.6)",
          transition: { duration: 0.3 },
        };
      case "glow":
        return {
          boxShadow: "0 0 20px var(--primary)",
          transition: { duration: 0.3 },
        };
      case "none":
      default:
        return {};
    }
  };

  const getTapAnimation = () => {
    if (disabled) return {};
    
    switch (animation) {
      case "scale":
      case "pulse":
        return { scale: 0.95, transition: { duration: 0.1 } };
      case "bounce":
        return { y: 2, transition: { duration: 0.1 } };
      case "ripple":
      case "glow":
        return { scale: 0.98, transition: { duration: 0.1 } };
      case "none":
      default:
        return {};
    }
  };

  return (
    <motion.div
      className="inline-block"
      whileHover={getHoverAnimation()}
      whileTap={getTapAnimation()}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Button
        className={cn(className)}
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton;
