import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "./firebase";

export default function DeleteMsg({ setDeleteOn, id }) {
  async function deleteMsg() {
    await deleteDoc(doc(db, "messages", id));
    setDeleteOn(false);
  }

  return (
    <div className="border-2 border-sky-600 bg-gray-400 rounded-md w-[300px] p-2 h-[100px]">
      <span className="flex justify-center text-gray-800 font-bold">
        Do you want to delete this message ?
      </span>
      <div className="flex gap-4 justify-center mt-4">
        <button
          onClick={() => setDeleteOn(false)}
          className="border active:bg-slate-500 border-gray-800 rounded-md text-gray-800 w-20"
        >
          No
        </button>
        <button
          onClick={deleteMsg}
          className="rounded-md bg-sky-600 w-20 active:bg-sky-800"
        >
          Yes
        </button>
      </div>
    </div>
  );
}
