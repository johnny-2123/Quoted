import React, { useEffect, useState } from "react";
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
} from "firebase/firestore";
import UserCard from "@/components/userCard";

const Followers = ({ followers, currentUser }) => {
  console.log(`followers in Followers modal: ${followers}`);
  const [followerUsers, setFollowerUsers] = useState([]);
  console.log(`followerUsers in Followers modal: ${followerUsers}`);

  useEffect(() => {
    if (followers.length <= 0) return;
    const followerQuery = query(
      collection(db, "users"),
      where(documentId(), "in", followers)
    );

    const unsubscribeFollower = onSnapshot(followerQuery, (querySnapshot) => {
      setFollowerUsers(
        querySnapshot?.docs?.map((doc) => {
          const data = doc.data();
          console.log(`data in Followers modal`, data);
          return {
            ...data,
            id: doc.id,
          };
        })
      );
    });

    return () => unsubscribeFollower();
  }, [followers]);

  const handleRemoveFollower = async (uid) => {
    const friendUserRef = doc(db, "users", uid);
    const currentUserRef = doc(db, "users", currentUser?.uid);

    try {
      await updateDoc(friendUserRef, {
        [`following.${currentUser?.uid}`]: deleteField(),
      });

      await updateDoc(currentUserRef, {
        [`followers.${uid}`]: deleteField(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const userCards = followerUsers.map((user) => {
    return (
      <UserCard
        key={user?.uid}
        userName={user?.userName}
        displayName={user?.displayName}
        profilePicture={user?.profilePicture}
        handleEditRelationship={() => handleRemoveFollower(user?.uid)}
      />
    );
  });

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-grow overflow-y-scroll">{userCards}</div>
    </div>
  );
};

export default Followers;
