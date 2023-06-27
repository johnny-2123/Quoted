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

export default function QuotesFeed() {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const collectionRef = collection(db, "quotes");

    const q = query(collectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setQuotes(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          timestamp: doc.data().createdAt.toDate().getTime(),
        }))
      );
    });

    return unsubscribe;
  }, []);

  console.log("quotes", quotes);

  const quoteCards = quotes.map((quote) => {
    return (
      <QuoteCard
        key={quote.id}
        author={quote.author}
        text={quote.text}
        timestamp={quote.timestamp}
        likes={quote.likes}
      />
    );
  });

  return (
    <div>
      <h1 className="text-3xl py-2">Quotes Feed</h1>
      {quoteCards}
    </div>
  );
}
