import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { getDoc } from "firebase/firestore";
import { updateDoc, doc, deleteField } from "firebase/firestore";
import Link from "next/link";
import Image from "next/image";

export default function QuoteCard({
  id,
  timestamp,
  text,
  author,
  usersLiked,
  usersFavorited,
  currentUser,
  openEditModal,
}) {
  const [authorData, setAuthorData] = useState(null);
  const [userLikedQuote, setUserLikedQuote] = useState(false);
  const [userFavoritedQuote, setUserFavoritedQuote] = useState(false);
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

    const fetchUsersLikedData = async () => {
      if (usersLiked && currentUser?.uid in usersLiked) {
        setUserLikedQuote(true);
      } else {
        setUserLikedQuote(false);
      }
    };

    const fetchUsersFavoritedData = async () => {
      if (usersFavorited && currentUser?.uid in usersFavorited) {
        setUserFavoritedQuote(true);
      } else {
        setUserFavoritedQuote(false);
      }
    };

    fetchAuthorData();
    fetchUsersLikedData();
    fetchUsersFavoritedData();
  }, [author, usersLiked, currentUser]);

  const formattedTimestamp =
    new Date(timestamp).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    }) +
    " " +
    new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

  const handleEdit = () => {
    openEditModal(id, text);
  };

  const handleLike = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser?.uid);
    const quoteRef = doc(db, "quotes", id);

    try {
      if (userLikedQuote) {
        await updateDoc(userRef, {
          [`likes.${id}`]: deleteField(),
        });

        await updateDoc(quoteRef, {
          [`likes.${currentUser.uid}`]: deleteField(),
        });

        setUserLikedQuote(false);
      } else {
        await updateDoc(userRef, {
          [`likes.${id}`]: quoteRef,
        });

        await updateDoc(quoteRef, {
          [`likes.${currentUser.uid}`]: userRef,
        });

        setUserLikedQuote(true);
      }
    } catch (error) {
      console.log("Error toggling like:", error);
    }
  };

  const handleFavorite = async () => {
    if (!currentUser) return;
    const userRef = doc(db, "users", currentUser?.uid);
    const quoteRef = doc(db, "quotes", id);

    try {
      if (userFavoritedQuote) {
        await updateDoc(userRef, {
          [`favorites.${id}`]: deleteField(),
        });

        await updateDoc(quoteRef, {
          [`favorites.${currentUser.uid}`]: deleteField(),
        });

        setUserFavoritedQuote(false);
      } else {
        await updateDoc(userRef, {
          [`favorites.${id}`]: quoteRef,
        });

        await updateDoc(quoteRef, {
          [`favorites.${currentUser.uid}`]: userRef,
        });

        setUserFavoritedQuote(true);
      }
    } catch (error) {
      console.log("Error toggling favorite:", error);
    }
  };

  return (
    <div
      key={id}
      className="flex py-4 pl-1 pr-4 border-y border-gray-200 rounded w-full "
    >
      <Link
        href={{
          pathname: `/profile/${authorData?.uid}`,
          query: { id: authorData?.uid },
        }}
        className="p-0 m-0 mr-3 w-[4rem] h-[4rem] min-w-[35px] min-h-[35px] max-w-[40px] max-h-[40px] relative"
      >
        <Image
          src={authorData?.profilePicture || defaultProfilePicture}
          className="rounded-full object-cover min-w-[35px] min-h-[35px] max-w-[40px] max-h-[40px]"
          alt="Profile Picture"
          width={0}
          height={0}
          style={{ width: "100%", height: "auto" }}
          unoptimized={true}
        />
      </Link>
      <div className="flex flex-col flex-grow text-xs sm:text-md xs:text-lg">
        <p className="font-bold w-full flex justify-between items-center content-center text-sm lg:text-base">
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
        <p className="text-sm lg:text-base text-slate-900 text-start">{text}</p>
        <div className="flex justify-between items-center mt-2 mr-0 sm:text-sm lg:text-xs">
          <div className="flex flex-row ">
            <p className=" text-slate-500 mr-[1rem]">
              {userLikedQuote ? (
                <i
                  className="fa-solid fa-heart mr-1 cursor-pointer "
                  onClick={handleLike}
                ></i>
              ) : (
                <i
                  className="fa-regular fa-heart mr-1 cursor-pointer"
                  onClick={handleLike}
                ></i>
              )}
              {Object.keys(usersLiked)?.length}
            </p>
            {currentUser && authorData?.uid !== currentUser?.uid && (
              <p className="text-slate-500 ">
                <i
                  className={`fa-${
                    userFavoritedQuote ? "solid" : "regular"
                  } fa-star mr-1 cursor-pointer`}
                  onClick={handleFavorite}
                ></i>
              </p>
            )}
          </div>
          <p className=" text-slate-500">{formattedTimestamp}</p>
        </div>
      </div>
    </div>
  );
}
