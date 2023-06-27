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

  return (
    <div key={id}>
      <h2>Quote</h2>
      <p>{text}</p>
      {authorData && <p>Author: {authorData.userName}</p>}
    </div>
  );
}
