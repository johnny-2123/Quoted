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

  return (
    <div>
      <div>
        <img
          src="https://res.cloudinary.com/dkul3ouvi/image/upload/v1688003424/photo-1593085512500-5d55148d6f0d_zhgde7.jpg"
          className="w-10 h-auto"
        />
        <i className="fa-solid fa-user-pen"></i>
      </div>
      <div>
        <h1>{userData?.userName}</h1>
        <p>{userData?.bio}</p>
      </div>
      <div>
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
    </div>
  );
}
