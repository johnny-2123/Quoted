import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Slide, toast } from "react-toastify";

export default function Footer() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  const notifyComingSoon = () => {
    toast.info("Feature coming soon!", {
      transition: Slide,
      autoClose: 2000,
      hideProgressBar: true,
    });
  };

  return (
    <div className="flex flex-col-reverse py-[5rem] md:py-3 md:flex-row justify-between items-center gap-8 px-[1rem] md:px-[1.5rem] mx-0 text-2xl xxs:px-[1rem] xxs:gap-2 xxs:justify-between">
      <Link
        href={{
          pathname: "/friends",
        }}
      >
        <i className="fa-solid fa-users duration-300 hover:none cursor-pointer text-light"></i>
      </Link>
      <Link href={""} onClick={notifyComingSoon}>
        <i className="fa-regular fa-heart duration-300 hover:opacity-60 cursor-not-allowed text-light"></i>
      </Link>
      <Link
        href={{
          pathname: "/",
        }}
        className="duration-300 hover:opacity-60 cursor-pointer"
        title="All Quotes"
      >
        <i className="fa-solid fa-quote-left   text-light mr-1"></i>
        <i className="fa-solid fa-quote-right  text-light"></i>
      </Link>
      <Link
        href={{
          pathname: "/favorites",
        }}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
      >
        <i className="fa-regular fa-star"></i>
      </Link>
      <Link
        href={"/user"}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
        title="Profile"
      >
        <i className="fa-solid fa-user"></i>
      </Link>
    </div>
  );
}
