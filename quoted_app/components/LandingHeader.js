import React from "react";

const LandingHeader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <h1 className="text-4xl font-md text-center xs:!my-[3rem] lg:!my-[1.5rem]">
        Quoted <i class="fa-solid fa-quote-left mr-1 text-dark"></i>
        <i class="fa-solid fa-quote-right text-light    "></i>
      </h1>
      <h2 className="text-2xl font-md text-center lg:mb-[2rem]">
        A social media platform for sharing quotes
      </h2>
    </div>
  );
};

export default LandingHeader;
