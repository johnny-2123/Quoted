import React, { useEffect, useCallback, useState } from "react";
import { db } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "./QuoteCard";
import NewQuoteBtn from "./NewQuoteBtn";
import Modal from "./Modal";
import useQuotes from "@/hooks/useQuotes";
import AddEditQuote from "./AddEditQuote";

export default function QuotesFeed() {
  const { currentUser } = useAuth();

  const [openModal, setOpenModal] = useState(false);
  const [editQuoteId, setEditQuoteId] = useState(null);
  const [editQuoteText, setEditQuoteText] = useState("");
  const [quoteContent, setQuoteContent] = useState("");

  const collectionRef = collection(db, "quotes");
  const q = query(collectionRef, orderBy("createdAt", "desc"));

  const quotes = useQuotes(q);

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
        Quoted <i className="fa-solid fa-quote-left text-dark mr-1"></i>
        <i className="fa-solid fa-quote-right text-light"></i>
      </h1>
      <div className="flex-grow overflow-y-scroll">{quoteCards}</div>
      <NewQuoteBtn setOpenModal={setOpenModal} />
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
}
