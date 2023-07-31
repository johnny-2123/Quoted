import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/QuoteCard";
import useGetFriendData from "@/hooks/useGetFriendData";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import { motion, AnimatePresence } from "framer-motion";
import useGetFavoritedQuotes from "@/hooks/useGetFavoritedQuotes";

export default function Favorites() {
  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser.uid);
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const { favoritedQuotes } = useGetFavoritedQuotes(userData);

  const quoteCards = favoritedQuotes.map((quote) => (
    <QuoteCard
      id={quote.id}
      key={quote.id}
      author={quote.author}
      text={quote.text}
      timestamp={quote.timestamp}
      usersLiked={quote.likes}
      usersFavorited={quote.favorites}
      currentUser={currentUser}
      openEditModal={null}
    />
  ));

  return (
    <div className="flex flex-col h-full overflow-auto py-4 px-2">
      <h1 className={`text-3xl py-2 transition-all duration-300 `}>
        Favorites
        <i className="fa-solid fa-star text-light ml-1"></i>
      </h1>
      <AnimatePresence mode="wait">
        <motion.div
          className="flex-grow overflow-y-scroll"
          // initial={{ opacity: 0 }}
          // animate={{ opacity: 1 }}
          // exit={{ opacity: 0 }}
          // transition={{ duration: 1 }}
        >
          {quoteCards}
        </motion.div>
      </AnimatePresence>
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
}
