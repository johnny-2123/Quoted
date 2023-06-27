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
  const [quotes, setQuotes] = useState([]);
  const [hideTitle, setHideTitle] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const collectionRef = collection(db, "quotes");

    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setQuotes(
        querySnapshot.docs.map((doc) => {
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

  const quoteCards = quotes.map((quote) => {
    return (
      <QuoteCard
        key={quote.id}
        author={quote.author}
        text={quote.text}
        timestamp={quote.timestamp}
        usersLiked={quote.likes}
      />
    );
  });

  return (
    <div className="flex flex-col h-full">
      <h1 className={`text-3xl py-2 transition-all duration-300 `}>
        Quotes Feed
      </h1>
      <div className="overflow-y-scroll h-[calc(100vh-8rem)]">{quoteCards}</div>
      <NewQuoteBtn setOpenModal={setOpenModal} />{" "}
      {openModal && <Modal setOpenModal={setOpenModal} />}{" "}
    </div>
  );
}
