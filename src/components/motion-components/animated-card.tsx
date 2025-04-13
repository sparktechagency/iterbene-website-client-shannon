'use client';
import React, { ReactNode } from "react";
import { motion } from "framer-motion";

interface AnimatedCardProps {
    children: ReactNode;
    className?: string;
    hoverEffect?: "scale" | "lift" | "glow" | "rotate" | "none";
}

const AnimatedCard = ({
    children,
    className = "",
    hoverEffect = "scale",
}: AnimatedCardProps) => {
    const getHoverAnimation = () => {
        switch (hoverEffect) {
            case "scale":
                return { scale: 1.05, transition: { duration: 0.3 } };
            case "lift":
                return { y: -10, transition: { duration: 0.3 } };
            case "glow":
                return { boxShadow: "0 0 20px rgba(79, 70, 229, 0.4)", transition: { duration: 0.3 } };
            case "rotate":
                return { rotate: 3, transition: { duration: 0.3 } };
            case "none":
            default:
                return {};
        }
    };

    return (
        <motion.div
            className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            whileHover={getHoverAnimation()}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedCard;
