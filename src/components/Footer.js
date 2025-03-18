"use client";

import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-[#12011c] text-gray-300 py-6 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <p>© {new Date().getFullYear()} Fiorano API Docs. All rights reserved.</p>
    </motion.footer>
  );
}
