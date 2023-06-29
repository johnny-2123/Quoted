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

  const { userData, userQuotes } = useUserData(currentUser.uid);

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

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col items-center gap-2 p-0">
        <div className="w-full flex flex-row items-center">
          <img
            src={
              "https://res.cloudinary.com/dkul3ouvi/image/upload/v1688003424/photo-1593085512500-5d55148d6f0d_zhgde7.jpg"
            }
            className="w-[5rem] h-[5rem] rounded-full object-cover md:w-[4rem] md:h-[4rem] sm:w-[3rem] sm:h-[3rem]"
          />

          <i
            className="fa-solid fa-user-pen ml-auto cursor-pointer duration-300 hover:text-gray-300"
            onClick={() => {
              setOpenModal(true);
              setModalContent("user");
            }}
          ></i>
        </div>

        <div className="flex flex-col items-start  w-full">
          <h1 className="text-xl font-bold">{userData?.userName}</h1>
          <p className="text-sm text-slate-900">{userData?.bio}</p>
        </div>
      </div>
      <div className="py-2 w-full text-end">
        <button
          type="button"
          onClick={() => {
            logout();
            router.push("/");
          }}
          className="duration-300 hover:pl-2 cursor-pointer"
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
          quoteText={editQuoteText}
          userData={userData}
          quoteContent={quoteContent}
          setQuoteContent={setQuoteContent}
        />
      )}
    </div>
  );
}
