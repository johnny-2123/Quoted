import React from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

const LandingHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-[0rem] text-slate-800">
      <h1 className="text-6xl lg:text-5xl font-bold text-center !mb-[1.5rem] xs:!my-[2rem]">
        <motion.i
          className="fa-solid fa-quote-left mr-1 text-dark"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.i>
        Quoted{" "}
        <motion.i
          className="fa-solid fa-quote-right text-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        ></motion.i>
      </h1>
      <AnimatedText
        text="A social media platform for sharing quotes"
        className="text-[2rem] lg:text-[1.5rem] font-normal text-center !mb-[1rem]"
      />
    </div>
  );
};

export default LandingHeader;
