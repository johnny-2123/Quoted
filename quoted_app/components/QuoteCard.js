import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  QuerySnapshot,
  getDoc,
} from "firebase/firestore";

export default function QuoteCard({ id, timestamp, text, author, usersLiked }) {
  const [authorData, setAuthorData] = useState(null);
  const [usersLikedArray, setUsersLikedArray] = useState([]);

  console.log(`author`, author);
  console.log("likes", usersLiked);

  useEffect(() => {
    const fetchAuthorData = async () => {
      try {
        const authorDoc = await getDoc(author);
        if (authorDoc.exists()) {
          setAuthorData(authorDoc.data());
        }
      } catch (error) {
        console.log("Error fetching author data:", error);
      }
    };

    const fetchUsersLikedData = async () => {
      for (const [key, userRef] of Object.entries(usersLiked)) {
        try {
          const usersLikedDoc = await getDoc(userRef);
          if (usersLikedDoc.exists()) {
            setUsersLikedArray((prevArray) => [
              ...prevArray,
              usersLikedDoc.data(),
            ]);
          }
        } catch (error) {
          console.log("Error fetching usersLiked data:", error);
        }
      }
    };
    fetchAuthorData();
    fetchUsersLikedData();
  }, [author]);

  console.log("usersLikedArray", usersLikedArray);

  const formattedTimestamp = new Date(timestamp).toLocaleString();

  return (
    <div key={id} className="flex p-4 border border-gray-200 rounded w-full">
      <div className="mr-4">
        <i className="fa-solid fa-user text-2xl"></i>
      </div>
      <div className="flex flex-col">
        <p className="font-bold">{authorData?.userName}</p>
        <p className="text-gray-600">{text}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">{formattedTimestamp}</p>
          <p className="text-sm text-gray-400">
            Likes: {Object.keys(usersLiked).length}
          </p>
        </div>
      </div>
    </div>
  );
}
