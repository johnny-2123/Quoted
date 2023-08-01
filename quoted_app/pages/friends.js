import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/QuoteCard";
import useGetFriendData from "@/hooks/useGetFriendData";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import Followers from "@/components/followers";
import Following from "@/components/following";
import { motion, AnimatePresence } from "framer-motion";

const FollowingQuotesFeed = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser?.uid);
  const { quotes, followerUserUIDs, folllowingUserUIDs } = useGetFriendData();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);


  const openFollowingModal = () => {
    setModalContent("following");
    setOpenModal(true);
  };

  const openFollowersModal = () => {
    setModalContent("followers");
    setOpenModal(true);
  };

  const closeModal = () => {
    setModalContent("");
    setOpenModal(false);
  };

  const quoteCards = quotes.map((quote) => (
    <QuoteCard
      id={quote.id}
      key={quote.id}
      author={quote.author}
      text={quote.text}
      timestamp={quote.timestamp}
      usersLiked={quote.likes}
      currentUser={currentUser}
      openEditModal={null}
    />
  ));

  return (
    <div className="flex flex-col h-full overflow-auto py-4 px-2">
      <div className="w-full flex flex-col items-start mb-[.3rem]">
        <h1 className={`text-3xl py-2 transition-all duration-300 `}>
          Friends <i className="fa-solid fa-quote-left text-dark mr-1"></i>
          <i className="fa-solid fa-quote-right text-light"></i>
        </h1>
        <div className="mr-[2rem] flex flex-row">
          <h2 className="mr-[1rem] cursor-pointer" onClick={openFollowersModal}>
            Followers {followerUserUIDs?.length}
          </h2>
          <h2 className="cursor-pointer" onClick={openFollowingModal}>
            Following {folllowingUserUIDs?.length}
          </h2>
        </div>
      </div>
      <motion.div
        className="flex-grow overflow-y-scroll"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {quoteCards}
      </motion.div>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          title={modalContent === "following" ? "Following" : "Followers"}
          contentComponent={
            modalContent === "following" ? Following : Followers
          }
          closeModal={closeModal}
          followers={followerUserUIDs}
          following={folllowingUserUIDs}
          currentUser={currentUser}
        />
      )}
    </div>
  );
};

export default FollowingQuotesFeed;
