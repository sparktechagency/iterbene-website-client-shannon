"use client";
import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

interface AnimatedDialogProps {
  trigger: ReactNode;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  animation?: "scale" | "slide" | "rotate" | "bounce";
  className?: string;
}

const AnimatedDialog = ({
  trigger,
  title,
  description,
  children,
  footer,
  animation = "scale",
  className = "",
}: AnimatedDialogProps) => {
  const getAnimation = () => {
    switch (animation) {
      case "scale":
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.3 },
        };
      case "slide":
        return {
          initial: { opacity: 0, y: -20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 20 },
          transition: { duration: 0.3 },
        };
      case "rotate":
        return {
          initial: { opacity: 0, rotateX: -10 },
          animate: { opacity: 1, rotateX: 0 },
          exit: { opacity: 0, rotateX: 10 },
          transition: { duration: 0.4 },
        };
      case "bounce":
        return {
          initial: { opacity: 0, scale: 0.8 },
          animate: {
            opacity: 1,
            scale: 1,
            transition: {
              type: "spring",
              damping: 12,
              stiffness: 200,
            },
          },
          exit: {
            opacity: 0,
            scale: 0.9,
            transition: { duration: 0.2 },
          },
        };
      default:
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
          exit: { opacity: 0, scale: 0.95 },
          transition: { duration: 0.3 },
        };
    }
  };

  const animationProps = getAnimation();

  return (
    <motion.div
      initial={animationProps.initial}
      animate={animationProps.animate}
      exit={animationProps.exit}
      transition={animationProps.transition}
    >
      <Dialog>
        <DialogTrigger asChild>
          <motion.div className="cursor-pointer">{trigger}</motion.div>
        </DialogTrigger>
        <DialogContent className={className}>
          <motion.div>
            {title && (
              <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && (
                  <DialogDescription>{description}</DialogDescription>
                )}
              </DialogHeader>
            )}
            {children}
            {footer && <DialogFooter>{footer}</DialogFooter>}
          </motion.div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default AnimatedDialog;
