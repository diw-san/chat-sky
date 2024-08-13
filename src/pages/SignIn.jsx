import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useState } from "react";
import { auth } from "../Components/firebase";

export default function SignIn() {
  const [isSignIn, setisSignIn] = useState(false);

  function signIn() {
    setisSignIn(true);
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then(async (result) => {
        if (result.user) {
          window.location.href = "/";
        }
      })
      .catch((error) => {
        console.log("error here", error);
      })
      .then(setisSignIn(false));
  }

  return (
    <>
      <div className="flex items-center justify-center h-screen text-center">
        <div className="">
          <p className="text-sky-600 py-16 -mt-24 font-extrabold text-6xl font-sans title">
            Chat Sky
          </p>
          <button
            disabled={isSignIn}
            onClick={signIn}
            className="text-xl border-2 border-gray-600 active:bg-gray-400 transition ease-out p-1 px-2 rounded-3xl"
          >
            Sign with Google
          </button>
        </div>
      </div>
    </>
  );
}
