import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(props) {
  const { children } = props;

  useEffect(() => {
    const setVh = () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    setVh();

    window.addEventListener("resize", setVh);

    return () => window.removeEventListener("resize", setVh);
  }, []);

  return (
    <div
      style={{ maxHeight: "calc(100*var(--vh))" }}
      className="flex flex-col min-h-screen relative bg-background "
    >
      <main className="flex-1 flex flex-col overflow-auto p-4 text-slate-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
