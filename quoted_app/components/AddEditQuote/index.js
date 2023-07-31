import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  deleteField,
} from "firebase/firestore";
import { toast, Slide } from "react-toastify";
import Picker from "emoji-picker-react";
import InputEmoji from "react-input-emoji";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./AddEditQuote.module.css";

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
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    setQuoteContent(quoteText);

    return () => {
      setQuoteContent("");
      setEditQuoteId(null);
      setEditQuoteText("");
    };
  }, [quoteText]);

  const notifyOnSuccess = (message) => {
    toast.success(`Quote ${message} succesfully`, {
      transition: Slide,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  const notifyOnError = (message) => {
    toast.error(`Error ${message} quote`, {
      transition: Slide,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

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
      if (quoteId) {
        notifyOnError("updating");
      } else {
        notifyOnError("adding");
      }
    } finally {
      setLoading(false);
      setOpenModal(false);

      if (quoteId) {
        notifyOnSuccess("updated");
      } else {
        notifyOnSuccess("added");
      }
    }
  };

  const addNewQuote = async () => {
    try {
      const newQuoteRef = await addDoc(collection(db, "quotes"), {
        text: quoteContent,
        author: doc(db, "users", currentUser.uid),
        createdAt: serverTimestamp(),
        likes: {},
        favorites: {},
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
    <div className="flex flex-col gap-3 text-xs sm:text-md xs:text-lg ">
      <form onSubmit={handleSubmit}>
        <img
          className="emoji-icon mb-[.5rem] ml-auto cursor-pointer w-5 h-5 "
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker((val) => !val)}
        />
        <textarea
          value={quoteContent}
          onChange={(e) => setQuoteContent(e.target.value)}
          placeholder="Enter your quote..."
          className="p-2 border border-gray-300 rounded w-full"
          id="mytextarea"
          rows={2}
          required
        ></textarea>
        {showPicker && (
          <div className="relative w-[100%] h-0 top-[4.5rem]">
            <Picker
              height={"60vh"}
              width={"100%"}
              onEmojiClick={(emojiObject) =>
                setQuoteContent((prevMsg) => prevMsg + emojiObject.emoji)
              }
              previewConfig={{ showPreview: false }}
            />
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-light hover:bg-opacity-90 text-white mt-5 py-3 px-4 rounded-[20px]  transition-colors duration-300"
          disabled={loading}
        >
          {loading ? "Loading..." : quoteId ? "Edit Quote" : "Add Quote"}
        </button>
      </form>
      {quoteId && (
        <button
          onClick={() => deleteQuote(quoteId)}
          className="w-full bg-dark hover:bg-opacity-90 text-white py-3 px-4 rounded-[20px] transition-colors duration-300 mt-2"
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete Quote"}
        </button>
      )}
    </div>
  );
}
