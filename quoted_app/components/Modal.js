import React from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function Modal(props) {
  const { setOpenModal, contentComponent: ContentComponent } = props;

  return ReactDOM.createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed w-screen h-screen top-0 left-0 bg-white text-slate-900 flex flex-col z-50 text-lg sm:text-xl"
        initial={{ opacity: 0, x: "100vw" }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: "100vw" }}
        transition={{ duration: 0.3, type: "tween" }}
        key={"modal"}
      >
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
      </motion.div>
    </AnimatePresence>,
    document.getElementById("portal")
  );
}
