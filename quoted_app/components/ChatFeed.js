import React, { useState, useEffect } from "react";
import { db } from "@/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  documentId,
  where,
  deleteField,
  updateDoc,
  orderBy,
  limit,
  serverTimestamp,
  addDoc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { useCollectionData } from "react-firebase-hooks/firestore";
import Picker from "emoji-picker-react";
import ChatCard from "./ChatCard";

const ChatFeed = ({ userData, friendUserData }) => {
  const [message, setMessage] = useState("");
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log("userData in friend chat", userData);
  console.log("userUid in friend chat", userData?.uid);
  console.log("friendUserData in friend chat", friendUserData);
  console.log("friendUid in friend chat", friendUserData?.uid);

  const [chatId, setChatId] = useState(null); // State to store the chat document ID
  console.log("chatId in friend chat", chatId);

  // const chatRef = collection(db, "chats", chatId);

  useEffect(() => {
    const checkChatDocument = async () => {
      // Combine and sort the UIDs to get the chatId
      const chatId = [userData?.uid, friendUserData?.uid].sort().join("_");

      // Check if the chat document exists
      const chatDocRef = doc(db, "chats", chatId);
      const chatDocSnapshot = await getDoc(chatDocRef);

      if (!chatDocSnapshot.exists()) {
        // If the document doesn't exist, create it
        await setDoc(chatDocRef, {
          /* Initial data */
        });
      }

      // Store the chatId in the state
      setChatId(chatId);
    };

    checkChatDocument();
  }, [userData?.uid, friendUserData?.uid]);

  const chatRef = doc(db, "chats", chatId);
  const chatsQuery = query(
    collection(db, "chats"),
    where(documentId(), "===", chatId),
    orderBy("createdAt", "desc"),
    limit(25)
  );

  // const chatsQuery = query(chatRef, orderBy("createdAt", "desc"), limit(25));

  const [messages] = useCollectionData(chatsQuery, { idField: "id" });
  const messagesMapped = messages?.map((message) => {
    const senderId = message?.senderId;
    const sender = senderId === userData?.uid ? userData : friendUserData;
    return (
      <ChatCard
        key={message.id}
        text={message.text}
        sender={sender}
        createdAt={message.createdAt}
      />
    );
  });

  const sendMessage = async (e) => {
    console.log("submitting");
    e.preventDefault();
    setLoading(true);

    const chatRef = doc(db, "chats", chatId);
    const time = serverTimestamp();
    await updateDoc(chatRef, {
      messages: [
        {
          text: message,
          senderId: userData?.uid,
          createdAt: "time",
        },
      ],
    });
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-grow overflow-y-scroll flex items-center">
        {messagesMapped?.length > 0 ? messagesMapped : "No Messages Yet"}
      </div>
      <form onSubmit={sendMessage}>
        <img
          className="emoji-icon mb-[.5rem] ml-auto cursor-pointer w-5 h-5 "
          src="https://icons.getbootstrap.com/assets/icons/emoji-smile.svg"
          onClick={() => setShowPicker((val) => !val)}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
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
                setMessage((prevMsg) => prevMsg + emojiObject.emoji)
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
          {/* {loading ? "Loading..." : quoteId ? "Edit Quote" : "Add Quote"} */}
          Send Message
        </button>
      </form>
    </div>
  );
};

export default ChatFeed;
