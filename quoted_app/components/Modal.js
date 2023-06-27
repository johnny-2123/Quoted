import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Modal(props) {
  const { setOpenModal } = props;
  const { currentUser } = useAuth();
  const [_document, set_Document] = useState(null);
  const [quoteText, setQuoteText] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    set_Document(document);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!quoteText) return;

    setLoading(true);

    try {
      const newQuoteRef = await addDoc(collection(db, "quotes"), {
        text: quoteText,
        author: doc(db, "users", currentUser.uid),
        createdAt: serverTimestamp(),
        likes: 0,
      });
      await updateQuoteField(currentUser.uid, newQuoteRef.id);
    } catch (error) {
      console.log("Error adding quote:", error);
    } finally {
      setLoading(false);
      setOpenModal(false);
    }

    setLoading(false);
  };

  const updateQuoteField = async (userId, quoteId) => {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      [`quotes.${quoteId}`]: doc(db, "quotes", quoteId),
    });
  };

  if (!_document) return null;

  return ReactDOM.createPortal(
    <div className="fixed w-screen h-screen top-0 left-0 bg-white text-slate-900 flex flex-col z-50 text-lg sm:text-xl">
      <div className="flex items-center justify-between border-b-2 border-solid border-slate-900 p-4">
        <h1 className="text-2xl sm:text-3xl select-none font-semibold">
          New Quote
        </h1>
        <i
          className="fa-solid fa-xmark cursor-pointer duration-300 hover:rotate-90 text-2xl sm:text-3xl"
          onClick={() => setOpenModal(false)}
        ></i>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <form onSubmit={handleSubmit}>
          <textarea
            value={quoteText}
            onChange={(e) => setQuoteText(e.target.value)}
            placeholder="Enter your quote..."
            className="p-2 border border-gray-300 rounded w-full"
            rows={4}
            required
          ></textarea>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-2 px-4 rounded transition-colors duration-300"
          >
            {isLoading ? "Adding..." : "Add Quote"}
          </button>
        </form>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
