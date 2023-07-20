import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/QuoteCard";
import useGetFriendData from "@/hooks/useGetFriendData";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import Followers from "@/components/followers";
import Following from "@/components/following";

const FollowingQuotesFeed = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser?.uid);
  // console.log("userData in friends page", userData);
  const { quotes, followerUserUIDs, folllowingUserUIDs } = useGetFriendData();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  // console.log("followers in friends page", followerUserUIDs);
  // console.log("following in friends page", folllowingUserUIDs);

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
      <div className="flex-grow overflow-y-scroll">{quoteCards}</div>
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
