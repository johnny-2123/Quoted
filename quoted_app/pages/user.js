import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import QuoteCard from "@/components/QuoteCard";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import EditUserForm from "@/components/EditUserForm";
import AddEditQuote from "@/components/AddEditQuote";

export default function User() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [editQuoteId, setEditQuoteId] = useState(null);
  const [editQuoteText, setEditQuoteText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [quoteContent, setQuoteContent] = useState(null);

  const { userData, userQuotes } = useUserData(currentUser?.uid);

  const defaultProfilePicture =
    "https://res.cloudinary.com/dkul3ouvi/image/upload/v1688073928/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e_iwci96.jpg";

  const openEditModal = (quoteId, quoteText) => {
    setEditQuoteId(quoteId);
    setEditQuoteText(quoteText);
    setOpenModal(true);
    setModalContent("quote");
  };

  const closeEditModal = () => {
    setEditQuoteId(null);
    setEditQuoteText("");
    setOpenModal(false);
  };

  const quoteCards = userQuotes.map((quote) => {
    // console.log("quote", quote);
    return (
      <QuoteCard
        id={quote.id}
        key={quote.id}
        author={quote.author}
        text={quote.text}
        timestamp={quote.timestamp}
        usersLiked={quote.likes}
        currentUser={currentUser}
        openEditModal={openEditModal}
      />
    );
  });

  if (!userData) return null;

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col items-center gap-2 p-0">
        <div className="w-full flex flex-row items-center">
          <img
            src={`${userData?.profilePicture || defaultProfilePicture}`}
            className="rounded-full object-cover w-[3rem] h-[3rem]"
          />
          <i
            className="fa-solid fa-user-pen ml-auto cursor-pointer duration-300 hover:opacity-70 sm:text-lg mr-2"
            onClick={() => {
              setOpenModal(true);
              setModalContent("user");
            }}
          ></i>
        </div>

        <div className="flex flex-col items-start w-full">
          <h1 className="text-xs sm:text-md xs:text-lg font-bold">
            {userData?.userName}
          </h1>
          <p className="text-xs sm:text-md xs:text-lg  text-slate-900">
            {userData?.bio}
          </p>
        </div>
      </div>
      <div className="py-1 w-full text-end">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="duration-300 hover:scale-[90%] cursor-pointer bg-dark text-white rounded-[20px] px-4 py-1 text-xs sm:text-md xs:text-lg "
        >
          Logout
        </button>
      </div>
      <div className="flex-grow overflow-y-scroll">{quoteCards}</div>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          contentComponent={
            modalContent === "quote" ? AddEditQuote : EditUserForm
          }
          title={modalContent === "quote" ? "Edit Quote" : "Edit Profile"}
          closeEditModal={closeEditModal}
          quoteId={editQuoteId}
          setEditQuoteId={setEditQuoteId}
          setEditQuoteText={setEditQuoteText}
          quoteText={editQuoteText}
          userData={userData}
          quoteContent={quoteContent}
          setQuoteContent={setQuoteContent}
        />
      )}
    </div>
  );
}
