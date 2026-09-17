"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  /** Vertical offset in px before the element settles. */
  y?: number;
  className?: string;
  once?: boolean;
}

/**
 * Subtle fade-and-rise on scroll. Reduced-motion is honoured by the
 * <MotionConfig reducedMotion="user"> in Providers, which drops the transform
 * and keeps only the fade — no render-time branching, so server and client
 * markup always match.
 */
export function Reveal({ children, delay = 0, y = 18, className, once = true }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px -8% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
