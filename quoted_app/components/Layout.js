import React, { useState, useEffect } from "react";
import Footer from "./Footer";

export default function Layout(props) {
  const { children } = props;
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateSize = () => {
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen relative bg-background overflow-hidden"
      style={{ maxHeight: `${height}px` }}
    >
      <main className="flex-1 flex flex-col overflow-auto p-4 text-slate-900">
        {children}
      </main>
      <Footer />
    </div>
  );
}
