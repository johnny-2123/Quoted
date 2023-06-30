import { useState, useEffect } from "react";
import { onSnapshot } from "firebase/firestore";

export default function useQuotes(query) {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(query, (querySnapshot) => {
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

    return unsubscribe;
  }, []);

  return quotes;
}
