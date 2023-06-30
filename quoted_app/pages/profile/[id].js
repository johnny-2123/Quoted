import React from "react";
import useUserData from "@/hooks/useUserData";
import QuoteCard from "@/components/QuoteCard";
import { useRouter } from "next/router";

export default function ViewProfile() {
  const router = useRouter();
  const { id: userId } = router.query;
  console.log("userId", userId);
  const { userData, userQuotes } = useUserData(userId);

  console.log("userData", userData);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const quoteCards = userQuotes.map((quote) => (
    <QuoteCard
      id={quote.id}
      key={quote.id}
      author={quote.author}
      text={quote.text}
      timestamp={quote.timestamp}
      usersLiked={quote.likes}
      currentUser={null}
      openEditModal={() => {}}
    />
  ));

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="flex flex-col items-center gap-2 p-0 mb-2">
        <div className="w-full flex flex-row items-center">
          <img
            src={userData?.profilePicture}
            className="rounded-full object-cover w-[3rem] h-[3rem]"
          />
        </div>
        <div className="flex flex-col items-start w-full text-xs sm:text-md xs:text-lg">
          <h1 className="text-sm lg:text-base font-bold">
            {userData?.userName || "Username"}
          </h1>
          <p className="text-sm lg:text-base text-slate-900">
            {userData?.bio || "Bio"}
          </p>
        </div>
      </div>
      <div className="flex-grow overflow-y-scroll">
        {quoteCards.length > 0 ? (
          quoteCards
        ) : (
          <p className="h-[50vh] flex items-center justify-center">
            This user hasn't posted any quotes yet.
          </p>
        )}
      </div>
    </div>
  );
}
