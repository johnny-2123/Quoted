import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="flex justify-between items-center gap-8 py-3 px-[1.5rem] mx-0 text-2xl xxs:px-[1rem] xxs:gap-2 xxs:justify-between">
      <Link href={"/friends"}>
        <i className="fa-solid fa-users duration-300 hover:opacity-60 cursor-pointer text-light"></i>
      </Link>
      <Link href={"/likes"}>
        <i className="fa-regular fa-heart duration-300 hover:opacity-60 cursor-pointer text-light"></i>
      </Link>
      <Link href={"/"} className="duration-300 hover:opacity-60 cursor-pointer">
        <i className="fa-solid fa-quote-left   text-light mr-1"></i>
        <i className="fa-solid fa-quote-right  text-light"></i>
      </Link>
      <Link
        href={"/favorites"}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
      >
        <i className="fa-regular fa-star"></i>
      </Link>
      <Link
        href={"/user"}
        className="duration-300 hover:opacity-60 cursor-pointer text-light"
      >
        <i className="fa-solid fa-user"></i>
      </Link>
    </div>
  );
}
