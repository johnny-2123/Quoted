import React, { useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout(props) {
  const { children } = props;

  useEffect(() => {
    function updateHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    }

    window.addEventListener("resize", updateHeight);
    updateHeight();

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen max-h-vh relative bg-background">
      <main className="flex-1 flex flex-col overflow-hidden p-4 text-slate-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
