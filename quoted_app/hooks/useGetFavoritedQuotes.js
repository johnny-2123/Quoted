import React, { useEffect, useCallback, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  docRef,
  documentId,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import useUserData from "@/hooks/useUserData";

const useGetFavoritedQuotes = (userData) => {
  const [favoritedQuoteUIDs, setFavoritedQuoteUIDs] = useState([]);
  console.log("favoritedQuotes", favoritedQuoteUIDs);
  const [favoritedQuotes, setFavoritedQuotes] = useState([]);
  console.log("favoritedQuotes", favoritedQuotes);

  useEffect(() => {
    if (!userData) return;

    if (userData.favorites) {
      setFavoritedQuoteUIDs(Object.keys(userData.favorites));
    }
  }, [userData]);

  useEffect(() => {
    if (favoritedQuoteUIDs?.length === 0) return;
    const favoritedQuotesQuery = query(
      collection(db, "quotes"),
      where(documentId(), "in", favoritedQuoteUIDs)
    );
    const unsubscribe = onSnapshot(favoritedQuotesQuery, (querySnapshot) => {
      setFavoritedQuotes(
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

    return () => unsubscribe();
  }, [favoritedQuoteUIDs]);

  return { favoritedQuotes };
};

export default useGetFavoritedQuotes;
