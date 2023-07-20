import React from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(props) {
  const { children } = props;

  return (
    <div className="flex flex-row-reverse md:flex-col min-h-screen max-h-screen relative bg-background ">
      <main className="flex-1 flex flex-col overflow-hidden p-0 text-slate-900 ">
        {children}
      </main>
      <Footer />
    </div>
  );
}
