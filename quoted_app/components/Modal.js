import React from "react";
import ReactDOM from "react-dom";

export default function Modal(props) {
  const { setOpenModal, contentComponent: ContentComponent } = props;

  return ReactDOM.createPortal(
    <div className="fixed w-screen h-screen top-0 left-0 bg-white text-slate-900 flex flex-col z-50 text-lg sm:text-xl">
      <div className="flex items-center justify-between border-b-2 border-solid border-slate-900 p-4">
        <h1 className="text-2xl sm:text-3xl select-none font-semibold">
          {props.title}
        </h1>
        <i
          className="fa-solid fa-xmark cursor-pointer duration-300 hover:rotate-90 text-2xl sm:text-3xl"
          onClick={() => setOpenModal(false)}
        ></i>
      </div>
      <div className="p-4">
        <ContentComponent {...props} />
      </div>
    </div>,
    document.getElementById("portal")
  );
}
