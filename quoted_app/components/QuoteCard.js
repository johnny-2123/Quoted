import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import { getDoc } from "firebase/firestore";

export default function QuoteCard({ id, timestamp, text, author, likes }) {
  const [authorData, setAuthorData] = useState(null);

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

    fetchAuthorData();
  }, [author]);

  const formattedTimestamp = new Date(timestamp).toLocaleString();

  return (
    <div key={id} className="flex p-4 border border-gray-200 rounded">
      <div className="mr-4">
        <i className="fa-solid fa-user text-2xl"></i>
      </div>
      <div className="flex flex-col">
        <p className="font-bold">{authorData?.userName}</p>
        <p className="text-gray-600">{text}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="text-sm text-gray-400">{formattedTimestamp}</p>
          <p className="text-sm text-gray-400">Likes: {likes}</p>
        </div>
      </div>
    </div>
  );
}
