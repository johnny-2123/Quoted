import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useAuth } from "../context/AuthContext";

export default function Modal(props) {
  const { setOpenModal } = props;
  const [_document, set_Document] = useState(null);

  useEffect(() => {
    set_Document(document);
  }, []);

  if (!_document) return null;

  return ReactDOM.createPortal(
    <div className="fixed w-screen h-screen top-0 left-0 bg-white text-slate-900 flex flex-col z-50 text-lg sm:text-xl">
      <div className="flex items-center justify-between border-b-2 border-solid border-slate-900 p-4 ">
        <h1 className="text-2xl sm:text-3xl select-none font-semibold">
          New Tweet
        </h1>
        <i
          className="fa-solid fa-xmark cursor-pointer duration-300 hover:rotate-90 text-2xl sm:text-3xl"
          onClick={() => setOpenModal(false)}
        ></i>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <h2
          onClick={() => {
            setOpenModal(false);
          }}
          className="duration-300 hover:pl-2 cursor-pointer"
        >
          New Tweet
        </h2>
      </div>
    </div>,
    document.getElementById("portal")
  );
}
