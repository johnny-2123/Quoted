import React, { useEffect, useCallback, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";

const useGetFollowingQuotes = () => {
  const { currentUser } = useAuth();
  const [followedUsersUIDs, setFollowedUsersUIDs] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, "users", currentUser?.uid);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setFollowedUsersUIDs(Object.values(doc.data()?.following));
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (followedUsersUIDs.length === 0) return;
    const quotesQuery = query(
      collection(db, "quotes"),
      where("author", "in", followedUsersUIDs)
    );

    const unsubscribe = onSnapshot(quotesQuery, (querySnapshot) => {
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

    return () => unsubscribe();
  }, [followedUsersUIDs]);

  return { quotes };
};

export default useGetFollowingQuotes;
