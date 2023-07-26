import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase";
import { doc, setDoc, deleteField } from "firebase/firestore";
import LandingHeader from "../LandingHeader";
import Footer from "../Footer";
import {motion} from "framer-motion"
import styles from "./Login.module.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState(null);
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const { login, signUp, currentUser } = useAuth();
  // console.log(currentUser);

  async function submitHandler() {
    if (!isLoggingIn && (!email || !password || !userName)) {
      setError("Please enter email, password, and username");
      return;
    }
    if (isLoggingIn) {
      try {
        await login(email, password);
      } catch (err) {
        setError("Incorrect email or password");
      }
      return;
    }
    const newUserCredentials = await signUp(email, password);

    if (newUserCredentials) {
      try {
        await setDoc(doc(db, "users", newUserCredentials.user.uid), {
          email: newUserCredentials.user.email,
          uid: newUserCredentials.user.uid,
          profilePicture: "",
          bio: "",
          quotes: {},
          likes: {},
          favorites: {},
          friends: {},
          userName: userName,
        });
      } catch (err) {
        // console.log(`Error creating user: ${err}`);
      }
    }
  }

  async function handleDemoLogin() {
    const demoEmail = "testuser@gmail.com";
    const demoPassword = "password";

    setEmail(demoEmail);
    setPassword(demoPassword);

    try {
      await login(demoEmail, demoPassword);
    } catch (err) {
      setError("Incorrect email or password");
    }
  }

  return (
    <div className="flex-1 text-xs sm:text-sm flex flex-col justify-center items-center gap-2 sm:gap-4 relative p-0 overflow-y-overlay flex-grow">
      <LandingHeader />
      <h1 className="font-bold select-none text-4xl sm:text-2xl uppercase text-slate-800 border-t border-slate-500 pt-[1.75rem] w-[40%] text-center ">
        {isLoggingIn ? "Login" : "Register"}
      </h1>
      {error && (
        <div className="w-full max-w-[40ch] border-rose-400 border text-center border-solid text-rose-400 py-2">
          {error}
        </div>
      )}
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email Address"
        className="outline-none duration-300 border-b-2 border-solid border-white focus:border-cyan-300 text-slate-900 p-2 w-full max-w-[40ch]"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="Password"
        className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
      />
      {!isLoggingIn && (
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          type="text"
          placeholder="Username"
          className="outline-none text-slate-900 p-2 w-full max-w-[40ch] duration-300 border-b-2 border-solid border-white focus:border-cyan-300"
        />
      )}
      <button
        onClick={submitHandler}
        className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-light after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-white rounded-[20px]"
      >
        <h2 className="relative z-20">SUBMIT</h2>
      </button>
      <button
        onClick={handleDemoLogin}
        className="w-full max-w-[40ch] border border-white border-solid uppercase py-2 duration-300 relative after:absolute after:top-0 after:right-full after:bg-light after:z-10 after:w-full after:h-full overflow-hidden hover:after:translate-x-full after:duration-300 hover:text-white rounded-[20px]"
      >
        <h2 className="relative z-20">DEMO LOGIN</h2>
      </button>
      <h2
        className="duration-300 hover:scale-110 cursor-pointer"
        onClick={() => setIsLoggingIn(!isLoggingIn)}
      >
        {!isLoggingIn ? "Login" : "Register"}
      </h2>
      <div
        className={
          "absolute bottom-0 bg-primaryLight w-[100%] py-5 text-white text-[1.5rem] flex justify-center items-center rounded-tr-[40%]"
        }
      >
        <a
          className={"mx-3"}
          href={"https://github.com/johnny-2123/Quoted"}
          target="_blank"
        >
          <i class="fa-brands fa-github"></i>
        </a>
        <a
          className={"mx-3"}
          href={"https://www.linkedin.com/in/johnny-avila-0512aa164/"}
          target="_blank"
        >
          <i class="fa-brands fa-linkedin"></i>
        </a>
        <a
          className={"mx-3 font-bold"}
          href={"https://wellfound.com/u/johnny-edgar-avila"}
          target="_blank"
        >
          W:
        </a>
      </div>
      <motion.img src='../../quoted_mobile.png' className="absolute h-[300px] w-auto bottom-[1.5rem] left-[3rem] drop-shadow-lg  md:hidden" alt="mobile phone with quoted app on screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1, ease: "easeInOut", type: "spring"  }}/>
    </div>
  );
}
