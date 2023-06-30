import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import QuoteCard from "@/components/QuoteCard";
import Modal from "@/components/Modal";
import useUserData from "@/hooks/useUserData";
import EditUserForm from "@/components/EditUserForm";
import AddEditQuote from "@/components/AddEditQuote";
import { Redirect } from "next/router";

export default function User() {
  const router = useRouter();
  const { currentUser, logout } = useAuth();
  const [editQuoteId, setEditQuoteId] = useState(null);
  const [editQuoteText, setEditQuoteText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [quoteContent, setQuoteContent] = useState(null);

  const { userData, userQuotes } = useUserData(currentUser?.uid);

  // if (!currentUser) {
  //   return <Redirect to="/login" />;
  // }

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

        <div className="flex flex-col items-start w-full text-xs sm:text-md xs:text-lg">
          <h1 className="text-sm lg:text-base font-bold">
            {userData?.userName || "Username"}
          </h1>
          <p className="text-sm lg:text-base text-slate-900">
            {userData?.bio || "Bio"}
          </p>
        </div>
      </div>
      <div className="my-1 w-full text-end text-sm lg:text-base">
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.push("/");
          }}
          className="duration-300 hover:scale-[90%] cursor-pointer bg-dark text-white rounded-[20px] px-4 py-1 text-xs sm:text-md "
        >
          Logout
        </button>
      </div>
      <div className="flex-grow overflow-y-scroll">
        {quoteCards.length > 0 ? (
          quoteCards
        ) : (
          <p className="h-[50vh] flex items-center justify-center">
            You haven't posted any quotes yet :/
          </p>
        )}
      </div>
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
