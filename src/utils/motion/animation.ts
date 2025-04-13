
import { Variants } from "framer-motion";

// Slide animations with configurable delay
export function slideInFromLeft(delay: number = 0.2): Variants {
  return {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
}

export function slideInFromRight(delay: number = 0.2): Variants {
  return {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
}

export function slideInFromTop(delay: number = 0.2): Variants {
  return {
    hidden: { y: -100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.5,
      },
    },
  };
}

export function slideInFromBottom(delay: number = 0.2): Variants {
  return {
    hidden: { y: 100, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        delay: delay,
        duration: 0.3,
      },
    },
  };
}

// Fade animations
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

// Scale animations
export const scaleUp: Variants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export const scaleDown: Variants = {
  hidden: { scale: 1.2, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Rotate animations
export const rotateIn: Variants = {
  hidden: { rotate: -15, opacity: 0 },
  visible: {
    rotate: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

// Staggered children animation
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

// Bounce animation
export const bounce: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -20, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse",
    },
  },
};

// Pulse animation
export const pulse: Variants = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

// New advanced animations
export const flipIn: Variants = {
  hidden: { opacity: 0, rotateX: 90 },
  visible: {
    opacity: 1,
    rotateX: 0,
    transition: { 
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

export const swoopIn: Variants = {
  hidden: { opacity: 0, scale: 0, rotate: 45 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

export const elasticScale: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

// Three-dimensional effects
export const flipCard: Variants = {
  hidden: { rotateY: 180, opacity: 0 },
  visible: {
    rotateY: 0,
    opacity: 1,
    transition: {
      duration: 0.8
    }
  }
};

// Blur effect
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(20px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.6 }
  }
};

// Float animation
export const float: Variants = {
  hidden: { y: 0 },
  visible: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      repeatType: "reverse",
      ease: "easeInOut"
    }
  }
};

// Typing animation
export const typingContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

export const typingCharacter: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 200
    }
  }
};

// 3D Tilt effect
export const tilt: Variants = {
  hover: {
    rotateX: 10,
    rotateY: 10,
    transition: {
      duration: 0.2
    }
  }
};

// Perspective flip
export const perspectiveFlip: Variants = {
  hidden: { 
    opacity: 0,
    rotateY: 90,
    perspective: "1000px"
  },
  visible: {
    opacity: 1,
    rotateY: 0,
    perspective: "1000px",
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

// Ripple effect
export const ripple: Variants = {
  hover: {
    scale: [1, 1.05, 1.1, 1.05, 1],
    boxShadow: [
      "0px 0px 0px rgba(79, 70, 229, 0)",
      "0px 0px 15px rgba(79, 70, 229, 0.1)",
      "0px 0px 30px rgba(79, 70, 229, 0.2)",
      "0px 0px 15px rgba(79, 70, 229, 0.1)",
      "0px 0px 0px rgba(79, 70, 229, 0)"
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity
    }
  }
};