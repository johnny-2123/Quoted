import React from "react";

const NewQuoteBtn = ({ setOpenModal }) => {
  return (
    <div
      className="fixed right-[.5rem] bottom-[4rem] flex items-center justify-center bg-transparent text-[3rem] text-dark cursor-pointer duration-300 transform hover:scale-90 rounded-[50%]]"
      onClick={() => setOpenModal(true)}
    >
      <i className="fa-solid fa-circle-plus"></i>
    </div>
  );
};

export default NewQuoteBtn;
