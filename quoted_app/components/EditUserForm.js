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
  // console.log("currentUser", currentUser.uid);
  const [username, setUsername] = useState(userData.userName);
  const [email, setEmail] = useState(userData.email);
  const [profilePicture, setProfilePicture] = useState(userData.profilePicture);
  const [imageUpload, setImageUpload] = useState(null);
  const [fireStoreImage, setFireStoreImage] = useState([]);
  // console.log("fireStoreImage", fireStoreImage);

  const genericProfilePicture =
    "https://res.cloudinary.com/dkul3ouvi/image/upload/v1688073928/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e_iwci96.jpg";

  const imageRef = ref(storage, `images/${currentUser.uid}`);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      try {
        const downloadURL = await getDownloadURL(imageRef);
        // console.log("downloadURL", downloadURL);
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

      await uploadImage();

      await updateDoc(doc(db, "users", currentUser.uid), {
        profilePicture: fireStoreImage,
      });

      closeEditModal();
    } catch (error) {
      console.log("Error updating user:", error);
    } finally {
      //success notification
    }
  };

  const uploadImage = async (e) => {
    if (!imageUpload) return;

    const imageRef = ref(storage, `images/${currentUser.uid}`);

    try {
      await uploadBytes(imageRef, imageUpload);

      const downloadURL = await getDownloadURL(imageRef);
      console.log("downloadURL", downloadURL);
      setFireStoreImage(downloadURL);

      console.log("Image uploaded successfully");
      alert("Image uploaded successfully");
    } catch (error) {
      console.log("Error uploading image:", error);
      alert("Error uploading image");
    }
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
          value={profilePicture || genericProfilePicture}
          onChange={(e) => setProfilePicture(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1 w-full"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="profilePictureFile" className="block mb-1">
          Profile Picture File:
        </label>
        <div
          style={{
            backgroundImage: `url(${fireStoreImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            borderRadius: "50%",
          }}
          className="border border-gray-300 rounded px-2 py-1 h-[5rem] w-[5rem]"
        >
          <input
            type="file"
            id="profilePictureFile"
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            className="border border-gray-300 rounded"
            onChange={(e) => setImageUpload(e.target.files[0])}
          ></input>
        </div>
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
