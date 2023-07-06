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

const Following = ({ following, currentUser }) => {
  // console.log(`Following in following modal: ${following}`);
  const [followingUsers, setFollowingUsers] = useState([]);
  // console.log(`followingUsers in following modal: ${followingUsers}`);

  useEffect(() => {
    if (following.length <= 0) return;
    const followingQuery = query(
      collection(db, "users"),
      where(documentId(), "in", following)
    );

    const unsubscribeFollowing = onSnapshot(followingQuery, (querySnapshot) => {
      setFollowingUsers(
        querySnapshot?.docs?.map((doc) => {
          const data = doc.data();
          console.log(`data in following modal`, data);
          return {
            ...data,
            id: doc.id,
          };
        })
      );
    });

    return () => unsubscribeFollowing();
  }, [following]);

  const handleUnfollow = async (uid) => {
    const friendUserRef = doc(db, "users", uid);
    const currentUserRef = doc(db, "users", currentUser?.uid);

    try {
      await updateDoc(friendUserRef, {
        [`followers.${currentUser?.uid}`]: deleteField(),
      });

      await updateDoc(currentUserRef, {
        [`following.${uid}`]: deleteField(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const userCards = followingUsers.map((user) => {
    return (
      <UserCard
        key={user?.uid}
        userName={user?.userName}
        displayName={user?.displayName}
        profilePicture={user?.profilePicture}
        handleEditRelationship={() => handleUnfollow(user?.uid)}
      />
    );
  });

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="flex-grow overflow-y-scroll">{userCards}</div>
    </div>
  );
};

export default Following;
