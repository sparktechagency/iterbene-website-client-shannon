'use client';
import React, { ReactNode, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownItem {
  label: string;
  onClick?: () => void;
}

interface AnimatedDropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  animation?: "fade" | "scale" | "slide" | "flip";
  className?: string;
  triggerClassName?: string;
}

const AnimatedDropdown = ({
  trigger,
  items,
  animation = "scale",
  className = "",
  triggerClassName = "",
}: AnimatedDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const getAnimation = () => {
    switch (animation) {
      case "fade":
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.15 },
        };
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.95, transformOrigin: "top" },
          animate: { opacity: 1, scale: 1, transformOrigin: "top" },
          exit: { opacity: 0, scale: 0.95, transformOrigin: "top" },
          transition: { duration: 0.15 },
        };
      case "slide":
        return {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2 },
        };
      case "flip":
        return {
          initial: { opacity: 0, rotateX: -15, transformOrigin: "top" },
          animate: { opacity: 1, rotateX: 0, transformOrigin: "top" },
          exit: { opacity: 0, rotateX: -15, transformOrigin: "top" },
          transition: { duration: 0.2 },
        };
      default:
        return {
          initial: { opacity: 0, scale: 0.95 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.15 },
        };
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.2,
      },
    }),
  };

  const animationProps = getAnimation();

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <motion.div
          className={`cursor-pointer ${triggerClassName}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {trigger}
        </motion.div>
      </DropdownMenuTrigger>
      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            forceMount
            className={`origin-top z-50 ${className}`}
            asChild
          >
            <motion.div
              initial={animationProps.initial}
              animate={animationProps.animate}
              exit={animationProps.exit}
              transition={animationProps.transition}
            >
              {items.map((item, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <DropdownMenuItem
                    onClick={item.onClick}
                    className="cursor-pointer"
                  >
                    {item.label}
                  </DropdownMenuItem>
                </motion.div>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
};

export default AnimatedDropdown;