import { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  documentId,
  where,
} from "firebase/firestore";

export default function useUserData(uid) {
  const [userData, setUserData] = useState(null);
  const [userQuoteUIDs, setUserQuoteUIDs] = useState([]);
  const [userQuotes, setUserQuotes] = useState([]);

  useEffect(() => {
    if (!uid) return;

    const docRef = doc(db, "users", uid);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setUserData(doc.data());
        const userQuoteUIDs = Object.keys(doc.data().quotes);
        setUserQuoteUIDs(userQuoteUIDs);
      }
    });

    return unsubscribe;
  }, [uid]);

  useEffect(() => {
    if (userQuoteUIDs.length > 0) {
      const quotesQuery = query(
        collection(db, "quotes"),
        where(documentId(), "in", userQuoteUIDs)
      );

      const unsubscribeQuotes = onSnapshot(quotesQuery, (snapshot) => {
        setUserQuotes(
          snapshot?.docs?.map((doc) => {
            const data = doc.data();
            const createdAt =
              data.createdAt && data.createdAt.toDate().getTime();
            return {
              ...data,
              id: doc.id,
              timestamp: createdAt || 0,
            };
          })
        );
      });

      return unsubscribeQuotes;
    }
  }, [userQuoteUIDs]);

  return { userData, userQuotes };
}
