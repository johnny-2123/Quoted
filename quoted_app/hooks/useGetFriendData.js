import React, { useEffect, useCallback, useState } from "react";
import { db } from "@/firebase";
import {
  doc,
  onSnapshot,
  collection,
  query,
  where,
  docRef,
} from "firebase/firestore";
import { useAuth } from "@/context/AuthContext";
import useUserData from "@/hooks/useUserData";

const useGetFriendData = () => {
  const { currentUser } = useAuth();
  const { userData } = useUserData(currentUser?.uid);
  console.log("userData in friends page", userData);
  const [followingUsers, setFollowingUsers] = useState([]);
  const [folllowingUserUIDs, setFollowingUserUIDs] = useState([]);
  const [followerUserUIDs, setFollowerUserUIDs] = useState([]);
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const docRef = doc(db, "users", currentUser?.uid);

    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        if (doc.data()?.following === undefined) return;

        setFollowingUsers(Object.values(doc.data()?.following));
        setFollowingUserUIDs(Object.keys(doc.data()?.following));

        if (doc.data()?.followers === undefined) return;
        setFollowerUserUIDs(Object.keys(doc.data()?.followers));
      }
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  useEffect(() => {
    if (followingUsers?.length <= 0) return;
    const quotesQuery = query(
      collection(db, "quotes"),
      where("author", "in", followingUsers)
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
  }, [followingUsers]);

  return { quotes, folllowingUserUIDs, followerUserUIDs };
};

export default useGetFriendData;
