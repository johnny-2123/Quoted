import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/QuoteCard";
import useGetFollowingQuotes from "@/hooks/useGetFollowingQuotes";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import Followers from "@/components/followers";
import Following from "@/components/following";

const FollowingQuotesFeed = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser?.uid);

  const { quotes } = useGetFollowingQuotes();
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [followers, setFollowers] = useState([]);
  // console.log("followers", followers);
  const [following, setFollowing] = useState([]);
  // console.log("following", following);

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

  useEffect(() => {
    if (userData?.followers) {
      setFollowers(Object.keys(userData?.followers));
    }
    if (userData?.following) {
      setFollowing(Object.keys(userData?.following));
    }
  }, [userData?.followers, userData?.following]);

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
    <div className="flex flex-col h-full overflow-auto">
      <div className="w-full flex flex-col items-start mb-[.3rem]">
        <h1 className={`text-3xl py-2 transition-all duration-300 `}>
          Friends <i className="fa-solid fa-quote-left text-dark mr-1"></i>
          <i className="fa-solid fa-quote-right text-light"></i>
        </h1>
        <div className="mr-[2rem] flex flex-row">
          <h2 className="mr-[1rem]" onClick={openFollowersModal}>
            Followers {followers?.length}
          </h2>
          <h2 onClick={openFollowingModal}>Following {following?.length}</h2>
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
          followers={followers}
          following={following}
        />
      )}
    </div>
  );
};

export default FollowingQuotesFeed;
