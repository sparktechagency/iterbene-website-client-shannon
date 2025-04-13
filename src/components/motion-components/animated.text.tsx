'use client'
import React from "react";
import { motion } from "framer-motion";
import { typingCharacter } from "@/utils/motion/animation";

interface AnimatedTextProps {
  text: string;
  className?: string;
  characterClassName?: string;
  delay?: number;
  type?: "typing" | "wave" | "fade" | "scale";
}

const AnimatedText = ({
  text,
  className = "",
  characterClassName = "",
  delay = 0,
  type = "typing",
}: AnimatedTextProps) => {
  const getCharacterVariants = () => {
    switch (type) {
      case "typing":
        return typingCharacter;
      case "wave":
        return {
          hidden: { y: 0, opacity: 0 },
          visible: (i: number) => ({
            y: [0, -10, 0],
            opacity: 1,
            transition: {
              delay: i * 0.05 + delay,
              y: {
                duration: 0.5,
                repeat: 0,
                ease: "easeInOut",
              },
            },
          }),
        };
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: (i: number) => ({
            opacity: 1,
            transition: {
              delay: i * 0.05 + delay,
              duration: 0.5,
            },
          }),
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0 },
          visible: (i: number) => ({
            opacity: 1,
            scale: 1,
            transition: {
              delay: i * 0.05 + delay,
              type: "spring",
              damping: 12,
              stiffness: 200,
            },
          }),
        };
      default:
        return typingCharacter;
    }
  };

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      className={`inline-flex ${className}`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {text.split("").map((char, index) => (
        <motion.span
          key={`${char}-${index}`}
          variants={getCharacterVariants()}
          custom={index}
          className={`inline-block ${characterClassName} ${char === " " ? "mr-1" : ""}`}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default AnimatedText;