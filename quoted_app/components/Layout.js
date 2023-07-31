import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { motion, AnimatePresence } from "framer-motion";

export default function Layout(props) {
  const { children } = props;

  return (
    <AnimatePresence mode="wait">
      <div className="flex flex-row-reverse md:flex-col min-h-screen max-h-screen relative bg-background ">
        <motion.main
          className="flex-1 flex flex-col overflow-hidden p-0 text-slate-900 "
          // initial={{ opacity: 0, y: 15 }}
          // animate={{ opacity: 1, y: 0 }}
          // exit={{ opacity: 0, y: 15 }}
          // transition={{ delay: 0.2, duration: 0.5 }}
        >
          {children}
        </motion.main>
        <Footer />
      </div>
    </AnimatePresence>
  );
}
