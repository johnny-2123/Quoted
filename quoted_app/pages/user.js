import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  doc,
  documentId,
  Firestore,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import QuoteCard from "@/components/QuoteCard";

export default function User() {
  const router = useRouter();
  const { currentUser } = useAuth();
  console.log(`currentUser`, currentUser);
  const [userData, setUserData] = useState(null);
  console.log(`userData`, userData);
  const [userQuoteUIDs, setUserQuoteUIDs] = useState([]);
  console.log(`userQuoteUIDs`, userQuoteUIDs);
  const [userQuotes, setUserQuotes] = useState([]);
  console.log(`userQuotes`, userQuotes);
  const { logout } = useAuth();

  useEffect(() => {
    const docRef = doc(db, "users", currentUser.uid);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
        const userQuoteUIDs = Object.keys(doc.data().quotes);
        setUserQuoteUIDs(userQuoteUIDs);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    let unsubscribeQuotes = () => {};
    if (userQuoteUIDs.length > 0) {
      const quotesQuery = query(
        collection(db, "quotes"),
        where(documentId(), "in", userQuoteUIDs)
      );
      unsubscribeQuotes = onSnapshot(quotesQuery, (snapshot) => {
        setUserQuotes(snapshot.docs.map((doc) => doc.data()));
      });
    }

    return unsubscribeQuotes;
  }, [userQuoteUIDs]);

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

  const quoteCards = userQuotes.map((quote) => {
    return (
      <QuoteCard
        key={quote.id}
        id={quote.id}
        timestamp={quote.timestamp}
        text={quote.text}
        author={quote.author}
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
            src="https://res.cloudinary.com/dkul3ouvi/image/upload/v1688003424/photo-1593085512500-5d55148d6f0d_zhgde7.jpg"
            className="w-[5rem] h-[5rem] rounded-full object-cover md:w-[4rem] md:h-[4rem] sm:w-[3rem] sm:h-[3rem]"
          />

          <i className="fa-solid fa-user-pen ml-auto cursor-pointer duration-300 hover:text-gray-300"></i>
        </div>

        <div className="flex flex-col items-start  w-full">
          <h1 className="text-xl font-bold">{userData?.userName}</h1>
          <p className="text-sm text-gray-400">{userData?.bio}</p>
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
    </div>
  );
}
