import React from "react";

const LandingHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-md text-center my-[3rem]">
        Quoted <i class="fa-solid fa-quote-left mr-1"></i>
        <i class="fa-solid fa-quote-right"></i>
      </h1>
      <h2 className="text-2xl font-md text-center mb-[3rem]">
        A social media platform for sharing quotes
      </h2>
    </div>
  );
};

export default LandingHeader;
