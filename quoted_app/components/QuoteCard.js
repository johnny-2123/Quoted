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
  const defaultProfilePicture =
    "https://res.cloudinary.com/dkul3ouvi/image/upload/v1688073928/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e_iwci96.jpg";

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
    <div
      key={id}
      className="flex py-4 pl-1 pr-4 border-y border-gray-200 rounded w-full "
    >
      <img
        src={`${authorData?.profilePicture || defaultProfilePicture}`}
        className="w-[5rem] h-[5rem] rounded-full object-cover md:w-[4rem] md:h-[4rem] sm:w-[3rem] sm:h-[3rem] m-0 mr-2"
      />
      <div className="flex flex-col flex-grow">
        <p className="font-bold w-full flex justify-between items-center content-center">
          {authorData?.userName}
          {currentUser && authorData?.uid === currentUser.uid && (
            <button
              onClick={handleEdit}
              className="my-auto ml-auto text-slate-800 hover:text-gray-900"
            >
              <i className="fa-solid fa-pencil my-auto duration-300 hover:rotate-45"></i>
            </button>
          )}
        </p>
        <p className="text-slate-900">{text}</p>
        <div className="flex justify-between items-center mt-2 mr-1">
          <p className="text-sm text-slate-500">{formattedTimestamp}</p>
          <p className="text-sm text-slate-500">
            <i className="fa-regular fa-heart"></i>{" "}
            {Object.keys(usersLiked).length}
          </p>
        </div>
      </div>
    </div>
  );
}
