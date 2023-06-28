import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import QuoteCard from "./QuoteCard";
import NewQuoteBtn from "./NewQuoteBtn";
import Modal from "./Modal";

export default function QuotesFeed() {
  const { currentUser } = useAuth();
  const [quotes, setQuotes] = useState([]);
  const [hideTitle, setHideTitle] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editQuoteId, setEditQuoteId] = useState(null);
  const [editQuoteText, setEditQuoteText] = useState("");

  useEffect(() => {
    const collectionRef = collection(db, "quotes");

    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setQuotes(
        querySnapshot?.docs?.map((doc) => {
          const data = doc.data();
          const createdAt = data.createdAt && data.createdAt.toDate().getTime();
          return {
            ...data,
            id: doc.id,
            timestamp: createdAt || 0,
          };
        })
      );
    });

    return unsubscribe;
  }, []);

  const openEditModal = (quoteId, quoteText) => {
    setEditQuoteId(quoteId);
    setEditQuoteText(quoteText);
    setOpenModal(true);
  };

  const closeEditModal = () => {
    setEditQuoteId(null);
    setEditQuoteText("");
    setOpenModal(false);
  };

  const quoteCards = quotes.map((quote) => {
    console.log("quote", quote);
    return (
      <QuoteCard
        id={quote.id}
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
    <div className="flex flex-col h-full">
      <h1 className={`text-3xl py-2 transition-all duration-300 `}>
        Quotes Feed
      </h1>
      <div className="overflow-y-scroll h-[calc(100vh-8rem)]">{quoteCards}</div>
      <NewQuoteBtn setOpenModal={setOpenModal} />
      {openModal && (
        <Modal
          setOpenModal={setOpenModal}
          quoteId={editQuoteId}
          quoteText={editQuoteText}
          closeEditModal={closeEditModal}
        />
      )}
    </div>
  );
}
