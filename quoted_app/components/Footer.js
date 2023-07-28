import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Slide, toast } from "react-toastify";
import { motion } from "framer-motion";

export default function Footer() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const notifyComingSoon = () => {
    toast.info("Feature coming soon!", {
      transition: Slide,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <div className="flex flex-col-reverse py-[5rem] md:py-3 md:flex-row justify-between items-center gap-8 px-[1rem] md:px-[1.5rem] mx-0 text-2xl xxs:px-[1rem] xxs:gap-2 xxs:justify-between">
      <Link
        href={{
          pathname: "/friends",
        }}
        className="duration-300 hover:opacity-60 cursor-pointer"
      >
        <motion.i
          className="fa-solid fa-users duration-300 hover:none cursor-pointer text-light"
          whileTap={{ scale: 0.9 }}
        ></motion.i>
      </Link>
      <Link href={""} onClick={notifyComingSoon}>
        <motion.i className="fa-regular fa-heart duration-300 hover:opacity-60 cursor-not-allowed text-light"></motion.i>
      </Link>
      <Link
        href={{
          pathname: "/",
        }}
        className="duration-300 hover:opacity-60 cursor-pointer"
        title="All Quotes"
      >
        <motion.div whileTap={{ scale: 0.9 }}>
          <i className="fa-solid fa-quote-left   text-light mr-1"></i>
          <i className="fa-solid fa-quote-right  text-light"></i>
        </motion.div>
      </Link>
      <Link
        href={{
          pathname: "/favorites",
        }}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
      >
        <motion.i
          className="fa-regular fa-star"
          whileTap={{ scale: 0.9 }}
        ></motion.i>
      </Link>
      <Link
        href={"/user"}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
        title="Profile"
      >
        <motion.i
          className="fa-solid fa-user"
          whileTap={{ scale: 0.9 }}
        ></motion.i>
      </Link>
    </div>
  );
}
