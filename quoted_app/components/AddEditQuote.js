import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";

export default function AddEditQuote({
  quoteId,
  setEditQuoteId,
  quoteText,
  setEditQuoteText,
  closeEditModal,
  setQuoteContent,
  quoteContent,
  setOpenModal,
}) {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setQuoteContent(quoteText);

    return () => {
      setQuoteContent("");
      setEditQuoteId(null);
      setEditQuoteText("");
    };
  }, [quoteText]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quoteContent) return;

    setLoading(true);

    try {
      if (quoteId) {
        await updateQuote(quoteId, quoteContent);
        closeEditModal();
      } else {
        await addNewQuote();
      }
    } catch (error) {
      console.log("Error adding/updating quote:", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }
  };

  const addNewQuote = async () => {
    try {
      const newQuoteRef = await addDoc(collection(db, "quotes"), {
        text: quoteContent,
        author: doc(db, "users", currentUser.uid),
        createdAt: serverTimestamp(),
        likes: {},
      });
      await updateQuoteField(currentUser.uid, newQuoteRef.id);
    } catch (error) {
      console.log("Error adding quote:", error);
    }
  };

  const updateQuote = async (quoteId, updatedText) => {
    const quoteRef = doc(db, "quotes", quoteId);
    await updateDoc(quoteRef, {
      text: updatedText,
    });
  };

  const updateQuoteField = async (userId, quoteId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`quotes.${quoteId}`]: doc(db, "quotes", quoteId),
    });
  };

  const deleteQuote = async (quoteId) => {
    const quoteRef = doc(db, "quotes", quoteId);

    await deleteDoc(quoteRef);

    const userRef = doc(db, "users", currentUser.uid);
    const userQuoteField = `quotes.${quoteId}`;
    await updateDoc(userRef, {
      [userQuoteField]: deleteField(),
    });

    closeEditModal();
  };

  return (
    <div className="flex flex-col gap-3 text-xs sm:text-md xs:text-lg">
      <form onSubmit={handleSubmit}>
        <textarea
          value={quoteContent}
          onChange={(e) => setQuoteContent(e.target.value)}
          placeholder="Enter your quote..."
          className="p-2 border border-gray-300 rounded w-full"
          rows={4}
          required
        ></textarea>
        <button
          type="submit"
          className="w-full bg-light hover:bg-opacity-90 text-white py-2 px-4 rounded-[20px]  transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Loading..." : quoteId ? "Edit Quote" : "Add Quote"}
        </button>
      </form>
      {quoteId && (
        <button
          onClick={() => deleteQuote(quoteId)}
          className="w-full bg-dark hover:bg-opacity-90 text-white py-2 px-4 rounded-[20px] transition-colors duration-300 mt-4"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Quote"}
        </button>
      )}
    </div>
  );
}
