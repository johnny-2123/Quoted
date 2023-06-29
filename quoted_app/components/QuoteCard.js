import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { getDoc, getAll } from "firebase/firestore";

export default function QuoteCard({
  id,
  timestamp,
  text,
  author,
  usersLiked,
  currentUser,
  openEditModal,
}) {
  const [authorData, setAuthorData] = useState(null);
  const [usersLikedArray, setUsersLikedArray] = useState([]);
  // console.log("id in QuoteCard", id);

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

    // const fetchUsersLikedData = async () => {
    //   const userRefs = Object.values(usersLiked);
    //   try {
    //     const userDocs = await getAll(...userRefs);
    //     const usersLikedData = userDocs.map((doc) => doc.data());
    //     setUsersLikedArray(usersLikedData);
    //   } catch (error) {
    //     console.log("Error fetching usersLiked data:", error);
    //   }
    // };

    fetchAuthorData();
    // fetchUsersLikedData();
  }, [author]);

  const formattedTimestamp = new Date(timestamp).toLocaleString();

  const handleEdit = () => {
    openEditModal(id, text);
  };

  return (
    <div key={id} className="flex p-4 border-y border-gray-200 rounded w-full ">
      <div className="mr-4">
        <i className="fa-solid fa-user text-2xl"></i>
      </div>
      <div className="flex flex-col w-full">
        <p className="font-bold w-full flex justify-between items-center content-center">
          {authorData?.userName}{" "}
          {currentUser && authorData?.uid === currentUser.uid && (
            <button
              onClick={handleEdit}
              className="my-auto ml-auto text-gray-600 hover:text-gray-900"
            >
              <i className="fa-solid fa-pencil my-auto duration-300 hover:rotate-45"></i>
            </button>
          )}
        </p>
        <p className="text-gray-600">{text}</p>
        <div className="flex justify-between items-center mt-2 mr-1">
          <p className="text-sm text-gray-400">{formattedTimestamp}</p>
          <p className="text-sm text-gray-400">
            <i className="fa-regular fa-heart"></i>{" "}
            {Object.keys(usersLiked).length}
          </p>
        </div>
      </div>
    </div>
  );
}
