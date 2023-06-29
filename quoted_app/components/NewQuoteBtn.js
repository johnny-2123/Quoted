import React from "react";

const NewQuoteBtn = ({ setOpenModal }) => {
  return (
    <div
      className="fixed right-[.5rem] bottom-[4.5rem] flex items-center justify-center bg-background text-[3rem] text-dark cursor-pointer duration-300 transform hover:scale-90"
      onClick={() => setOpenModal(true)}
    >
      <i className="fa-solid fa-circle-plus"></i>
    </div>
  );
};

export default NewQuoteBtn;
