import React, { useState, useEffect } from "react";
import useUserData from "@/hooks/useUserData";
import QuoteCard from "@/components/QuoteCard";
import { useRouter } from "next/router";
import { getDoc, updateDoc, doc, deleteField } from "firebase/firestore";
import { db } from "../../firebase";
import { useAuth } from "../../context/AuthContext";
import { toast, Slide } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Modal from "@/components/Modal";
import ChatFeed from "@/components/ChatFeed";

export default function ViewProfile() {
  const router = useRouter();
  const { id: friendUserId } = router.query;

  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser?.uid);

  const { userData: friendUserData, userQuotes } = useUserData(friendUserId);

  const [followingUser, setFollowingUser] = useState(false);

  const [openModal, setOpenModal] = useState(false);

  if (!friendUserData) {
    return <div>Loading...</div>;
  }

  const notifyFriendStatusUpdate = (userName, followingStatusUpdate) => {
    const message = `${userName} ${followingStatusUpdate} succesfully`;
    toast.success(message, {
      transition: Slide,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const quoteCards = userQuotes.map((quote) => (
    <QuoteCard
      id={quote.id}
      key={quote.id}
      author={quote.author}
      text={quote.text}
      timestamp={quote.timestamp}
      usersLiked={quote.likes}
      usersFavorited={quote.favorites}
      currentUser={currentUser}
      openEditModal={() => {}}
    />
  ));

  const handleFollow = async () => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser?.uid);
    const friendUserRef = doc(db, "users", friendUserId);

    try {
      if (followingUser) {
        await updateDoc(userRef, {
          [`following.${friendUserId}`]: deleteField(),
        });

        await updateDoc(friendUserRef, {
          [`followers.${currentUser?.uid}`]: deleteField(),
        });
        setFollowingUser(false);
      } else {
        await updateDoc(userRef, {
          [`following.${friendUserId}`]: friendUserRef,
        });

        await updateDoc(friendUserRef, {
          [`followers.${currentUser?.uid}`]: userRef,
        });

        setFollowingUser(true);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      notifyFriendStatusUpdate(
        friendUserData.userName,
        followingUser ? "unfollowed" : "followed"
      );
    }
  };

  return (
    <div className="flex flex-col overflow-hidden py-4 px-2">
      <div className="flex flex-col items-center gap-2 p-0 mb-2">
        <div className="w-full flex flex-row items-center">
          <img
            src={friendUserData?.profilePicture}
            className="rounded-full object-cover w-[3rem] h-[3rem]"
          />
          <i
            className={`fa-solid fa-user-${
              followingUser ? "check" : "plus"
            } ml-auto cursor-pointer duration-300 hover:opacity-70 sm:text-lg mr-2`}
            onClick={handleFollow}
          ></i>
        </div>
        <div className="flex flex-col items-start w-full text-xs sm:text-md xs:text-lg">
          <h1 className="text-sm lg:text-base font-bold">
            {friendUserData?.userName || "Username"}
          </h1>
          <p className="text-sm lg:text-base text-slate-900">
            {friendUserData?.bio || "Bio"}
          </p>
        </div>
        {/* <div className="my-1 w-full text-end px-0 mx-0">
          <button className="duration-300 hover: cursor-pointer text-light ">
            <i
              class="fa-solid fa-message ml-auto cursor-pointer duration-300 hover:opacity-70 text-md sm:text-lg mr-3"
              onClick={() => {
                setOpenModal(true);
              }}
            ></i>
          </button>
        </div> */}
      </div>
      <motion.div
        className="flex-grow overflow-y-scroll"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 15 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {quoteCards.length > 0 ? (
          quoteCards
        ) : (
          <p className="h-[50vh] flex items-center justify-center">
            This user hasn&apos;t posted any quotes yet.
          </p>
        )}
      </motion.div>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          contentComponent={ChatFeed}
          title={`chat with ${friendUserData.userName}`}
          userData={userData}
          friendUserData={friendUserData}
        />
      )}
    </div>
  );
}
