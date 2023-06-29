import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

export default function EditUserForm({ closeEditModal, userData }) {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState(userData.userName);
  const [email, setEmail] = useState(userData.email);
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateDoc(doc(db, "users", currentUser.uid), {
        userName: username,
        email: email,
      });

      await updateDoc(doc(db, "users", currentUser.uid), {
        profilePicture: profilePicture,
      });

      closeEditModal();
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="username" className="block mb-1">
          Username:
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block mb-1">
          Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="profilePicture" className="block mb-1">
          Profile Picture URL:
        </label>
        <input
          type="text"
          id="profilePicture"
          value={profilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </form>
  );
}
