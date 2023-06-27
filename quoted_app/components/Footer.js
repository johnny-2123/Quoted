import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Footer() {
  const { currentUser } = useAuth();

  if (!currentUser) return null;

  return (
    <div className="flex justify-center items-center gap-12 py-3 px-0 mx-0 text-2xl">
      <Link href={"/friends"}>
        <i className="fa-solid fa-users duration-300 hover:opacity-30 cursor-pointer text-light"></i>
      </Link>
      <Link href={"/likes"}>
        <i class="fa-regular fa-heart duration-300 hover:opacity-30 cursor-pointer text-light"></i>
      </Link>
      <Link href={"/"} className="duration-300 hover:opacity-30 cursor-pointer">
        <i class="fa-solid fa-quote-left   text-light"></i>
        <i class="fa-solid fa-quote-right  text-light"></i>
      </Link>
      <Link
        href={"/favorites"}
        className="duration-300 hover:opacity-30 cursor-pointer text-light"
      >
        <i class="fa-regular fa-star"></i>
      </Link>
      <Link
        href={"/user"}
        className="duration-300 hover:opacity-30 cursor-pointer text-light"
      >
        <i class="fa-solid fa-user"></i>
      </Link>
    </div>
  );
}
