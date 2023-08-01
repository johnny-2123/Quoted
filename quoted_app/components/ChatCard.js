import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const ChatCard = ({ text, createdAt, sender }) => {
  const defaultProfilePicture = "";

  return (
    <motion.div className="flex flex-row items-center justify-between">
      <div className="flex flex-col">
        <p className="text-sm text-slate-900">{text}</p>
        <p className="text-xs text-slate-900">{createdAt}</p>
      </div>
      <div>
        <img
          src={`${sender?.profilePicture || defaultProfilePicture}`}
          className="rounded-full object-cover w-[3rem] h-[3rem]"
          alt="profile picture"
        />
      </div>
    </motion.div>
  );
};
