'use client'
import React, { ReactNode, useEffect } from "react";
import { motion, Variants, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

interface MotionWrapperProps {
  children: ReactNode;
  variants: Variants;
  className?: string;
  once?: boolean;
  amount?: number;
  delay?: number;
}

const MotionWrapper = ({
  children,
  variants,
  className = "",
  once = false,
  amount = 0.3,
  delay = 0,
}: MotionWrapperProps) => {
  const controls = useAnimation();
  const [ref, isInView] = useInView({
    triggerOnce: once,
    threshold: amount,
  });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else if (!once) {
      controls.start("hidden");
    }
  }, [controls, isInView, once]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className={className}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  );
};

export default MotionWrapper;
