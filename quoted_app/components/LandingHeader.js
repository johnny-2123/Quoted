import React from "react";
import { motion } from "framer-motion";
import AnimatedText from "./AnimatedText";

const LandingHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center mt-2">
      <h1 className="text-4xl font-normal text-center xs:!my-[1.75rem] lg:!mb-[1.5rem]">
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
        className="text-xl font-normal text-center xs:!mb-[1.2rem] lg:!mb-[.5rem]"
      />
    </div>
  );
};

export default LandingHeader;
