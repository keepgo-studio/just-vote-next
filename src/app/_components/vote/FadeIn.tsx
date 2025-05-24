"use client"

import React from 'react'
import { AnimatePresence, motion } from "motion/react"

export default function FadeIn({
  children,
  showing,
  delay = 0
}: {
  children: React.ReactNode;
  showing?: boolean;
  delay?: number;
}) {
  return (
    <AnimatePresence mode="wait">
      {showing && (
        <motion.div
          key="fade-in-block"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3, delay: showing ? delay : 0.1 }}
        >{children}</motion.div>
      )}
    </AnimatePresence>
  )
}
