'use client';
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/components/ui/drawer";

interface AnimatedDrawerProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  animation?: "bounce" | "elastic";
  className?: string;
}

const AnimatedDrawer = ({
  trigger,
  title,
  description,
  children,
  footer,
  animation = "bounce",
  className = "",
}: AnimatedDrawerProps) => {
  const getAnimation = () => {
    switch (animation) {
      case "bounce":
        return {
          initial: { opacity: 0, y: 20 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 25,
              stiffness: 300,
            },
          },
          exit: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3 },
          },
        };
      case "elastic":
        return {
          initial: { opacity: 0, y: 20 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 8,
              stiffness: 200,
            },
          },
          exit: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3 },
          },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: {
            opacity: 1,
            y: 0,
            transition: {
              type: "spring",
              damping: 25,
              stiffness: 300,
            },
          },
          exit: {
            opacity: 0,
            y: 20,
            transition: { duration: 0.3 },
          },
        };
    }
  };

  const animationProps = getAnimation();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="cursor-pointer"
        >
          {trigger}
        </motion.div>
      </DrawerTrigger>
      <DrawerContent className={className}>
        <div className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
        <motion.div
          initial={animationProps.initial}
          animate={animationProps.animate}
          exit={animationProps.exit}
          className="p-4"
        >
          {title && (
            <DrawerHeader>
              <DrawerTitle>{title}</DrawerTitle>
              {description && (
                <DrawerDescription>{description}</DrawerDescription>
              )}
            </DrawerHeader>
          )}
          {children}
          {footer && <DrawerFooter>{footer}</DrawerFooter>}
        </motion.div>
      </DrawerContent>
    </Drawer>
  );
};

export default AnimatedDrawer;
