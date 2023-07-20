import React from "react";
import Link from "next/link";
import Image from "next/image";

const UserCard = ({
  userName,
  profilePicture,
  userId,
  handleEditRelationship,
}) => {
  const defaultProfilePicture =
    "https://res.cloudinary.com/dkul3ouvi/image/upload/v1688073928/39013954-f5091c3a-43e6-11e8-9cac-37cf8e8c8e4e_iwci96.jpg";

  return (
    <div
      key={userId}
      className="flex py-4 pl-1 pr-4 border-y border-gray-200 rounded w-full "
    >
      <Link
        href={{
          pathname: `/profile/${userId}`,
          query: { id: userId },
        }}
        className="p-0 m-0 mr-3 w-[4rem] h-[4rem] min-w-[35px] min-h-[35px] max-w-[40px] max-h-[40px] relative"
      >
        <Image
          src={profilePicture || defaultProfilePicture}
          className="rounded-full object-cover min-w-[35px] min-h-[35px] max-w-[40px] max-h-[40px]"
          alt="Profile Picture"
          width={0}
          height={0}
          style={{ width: "100%", height: "auto" }}
          unoptimized={true}
        />
      </Link>
      <div className="flex flex-row flex-grow text-xs sm:text-md xs:text-lg">
        <p className="font-bold w-full flex justify-between items-center content-center text-sm lg:text-base">
          {userName}
        </p>
        <i
          className="fa-solid fa-user-minus cursor-pointer duration-300 hover:opacity-70 mr-2"
          onClick={() => handleEditRelationship(userId)}
        ></i>
      </div>
    </div>
  );
};

export default UserCard;
