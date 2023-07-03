import React, { useEffect, useState, useCallback } from "react";
import { db } from "@/firebase";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "@/components/QuoteCard";
import useGetFollowingQuotes from "@/hooks/useGetFollowingQuotes";
import Modal from "@/components/Modal";

const FollowingQuotesFeed = () => {
  const { currentUser } = useAuth();

  const { quotes } = useGetFollowingQuotes();
  console.log("quotes", quotes);
  const [openModal, setOpenModal] = React.useState(false);

  const openEditModal = useCallback((quoteId, quoteText) => {
    setEditQuoteId(quoteId);
    setEditQuoteText(quoteText);
    setOpenModal(true);
  }, []);

  const closeEditModal = () => {
    setEditQuoteId(null);
    setEditQuoteText("");
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
      openEditModal={openEditModal}
    />
  ));

  return (
    <div className="flex flex-col h-full overflow-auto">
      <h1 className={`text-3xl py-2 transition-all duration-300 `}>
        Following <i className="fa-solid fa-quote-left text-dark mr-1"></i>
        <i className="fa-solid fa-quote-right text-light"></i>
      </h1>
      <div className="flex-grow overflow-y-scroll">{quoteCards}</div>
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          title={editQuoteId ? "Edit Quote" : "New Quote"}
          contentComponent={AddEditQuote}
          quoteId={editQuoteId}
          setEditQuoteId={setEditQuoteId}
          quoteText={editQuoteText}
          setEditQuoteText={setEditQuoteText}
          closeEditModal={closeEditModal}
          setQuoteContent={setQuoteContent}
          quoteContent={quoteContent}
        />
      )}
    </div>
  );
};

export default FollowingQuotesFeed;
