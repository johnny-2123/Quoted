import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import { storage } from "../firebase";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";

export default function EditUserForm({ closeEditModal, userData }) {
  const { currentUser } = useAuth();
  console.log("currentUser", currentUser.uid);
  const [username, setUsername] = useState(userData.userName);
  const [email, setEmail] = useState(userData.email);
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture);
  const [imageUpload, setImageUpload] = useState(null);
  const [fireStoreImage, setFireStoreImage] = useState([]);
  console.log("fireStoreImage", fireStoreImage);

  const imageRef = ref(storage, `images/${currentUser.uid}`);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const downloadURL = await getDownloadURL(imageRef);
        console.log("downloadURL", downloadURL);
        setFireStoreImage(downloadURL);
      } catch (error) {
        console.log("Error fetching profile picture:", error);
      }
    };

    fetchProfilePicture();
  }, [currentUser?.uid, imageRef]);

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

      await uploadImage();

      closeEditModal();
    } catch (error) {
      console.log("Error updating user:", error);
    }
  };

  const uploadImage = async (e) => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${currentUser.uid}`);

    uploadBytes(imageRef, imageUpload)
      .then((res) => {
        console.log("Image uploaded successfully:", res);
        alert("Image uploaded successfully");
      })
      .catch((error) => {
        console.log("Error uploading image:", error);
        alert("Error uploading image");
      });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col justify-center">
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
      <div className="mb-4">
        <label htmlFor="profilePictureFile" className="block mb-1">
          Profile Picture File:
        </label>
        <input
          type="file"
          id="profilePictureFile"
          className={`border border-gray-300 rounded px-2 py-1 w-full `}
          onChange={(e) => setImageUpload(e.target.files[0])}
        />
      </div>

      <button
        type="submit"
        className="w-full bg-light hover:bg-opacity-90 text-white py-2 px-4 rounded transition-colors duration-300"
      >
        Save Changes
      </button>
    </form>
  );
}
