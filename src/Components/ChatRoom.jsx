import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";

import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { BiTrash } from "react-icons/bi";
import DeleteMsg from "./DeleteMsg";
import { IoSend } from "react-icons/io5";

export function getTime(time) {
  const now = time?.toDate().toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  return now;
}

export default function ChatRoom() {
  const [newMsg, setNewMsg] = useState("");
  const [messages, setMessages] = useState([]);
  const [deleteOn, setDeleteOn] = useState(false);

  const user = auth.currentUser;

  async function logOut() {
    try {
      await auth.signOut();
      window.location.href = "/login";
    } catch (error) {
      console.log("error ocured:-", error);
    }
  }

  async function sendMsg(e) {
    e.preventDefault();

    await addDoc(collection(db, "messages"), {
      username: user.displayName,
      profileImg: user.photoURL,
      message: newMsg.trim() !== "" && newMsg,
      timestamp: serverTimestamp(),
      uid: user.uid,
    });
    setNewMsg("");
  }

  useEffect(
    () =>
      onSnapshot(
        query(collection(db, "messages"), orderBy("timestamp", "asc")),
        (snapshot) => {
          setMessages(snapshot.docs);
        }
      ),
    [db]
  );

  function randomNumber(length) {
    return Math.floor(Math.random() * length);
  }

  function borderClr() {
    const code = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, "A", "B", "C", "D", "E", "F"];

    let borderColor = "#";

    for (let i = 0; i < 6; i++) {
      borderColor += code[randomNumber(code.length)];
    }

    return borderColor;
  }

  function getDate(i) {
    const today = new Date().toLocaleDateString();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const currentDate = messages[i]
      .data()
      .timestamp?.toDate()
      .toLocaleDateString();

    if (i === 0) {
      if (currentDate === today) {
        return "Today";
      } else if (currentDate === yesterday.toLocaleDateString()) {
        return "Yesterday";
      }
      return messages[i].data().timestamp?.toDate().toLocaleDateString();
    }

    const prevDate = messages[i - 1]
      .data()
      .timestamp?.toDate()
      .toLocaleDateString();

    if (currentDate !== prevDate) {
      if (currentDate === today) {
        return "Today";
      } else if (currentDate === yesterday.toLocaleDateString()) {
        return "Yesterday";
      }
      return currentDate;
    }
    return null;
  }

  return (
    <>
      <div
        className="fixed min-w-[350px] max-w-[740px] h-[720px] my-2 inset-x-1 mx-auto border-[3px] p-1 rounded-md"
        style={{ borderColor: borderClr() }}
      >
        <img
          className="absolute my-auto inset-y-0 rounded inset-x-0 mx-auto bg-fixed w-full h-full z-0 object-cover"
          src="https://i.pinimg.com/736x/48/9d/82/489d8296459d472492a18fd24eca6382.jpg"
        />

        {/*Delete modal */}
        {deleteOn.isDelete && (
          <div className="absolute z-[60] w-full h-full flex justify-center items-center">
            <DeleteMsg id={deleteOn.id} setDeleteOn={setDeleteOn} />
          </div>
        )}

        <div className="relative h-full">
          <div className=" overflow-scroll scroll-smooths hideScroll h-full">
            <div className="absolute flex justify-between items-center p-1 w-full rounded-md border bg-gray-800 border-gray-600 h-11 z-50">
              <div className="flex ml-2 items-center font-bold text-[14px] gap-3">
                <img
                  className="h-9 w-9 object-cover rounded-full"
                  src={user?.photoURL}
                  alt=""
                />
                {user?.displayName}
              </div>

              <button
                onClick={logOut}
                className="hover:text-slate-400 text-[14px] font-semibold active:text-gray-500 mr-1"
              >
                Log out
              </button>
            </div>
            <div className="mt-12 mb-[50px] px-2">
              {messages.map((msg, i) => (
                <div key={msg.id} className="mt-4">
                  {getDate(i) && (
                    <p className=" w-full text-center mb-2 mx-auto">
                      <span className=" px-2 py-1 text-gray-300 bg-black/40 rounded-md">
                        {getDate(i)}
                      </span>
                    </p>
                  )}

                  <div
                    className={
                      user.uid === msg.data().uid && " flex flex-col items-end"
                    }
                  >
                    <div
                      className={`border bg-[#3a3a3a] w-3/5 max-w-[390px] md:max-w-[390px] border-gray-400 rounded-md p-1`}
                    >
                      <div className="flex gap-2 items-center justify-between">
                        <div className="flex gap-2">
                          <img
                            className="h-7 w-7 object-cover rounded-full"
                            src={msg.data().profileImg}
                            alt="dp"
                          />
                          <span className="text-[14px]">
                            {user.uid === msg.data().uid
                              ? "You"
                              : msg.data().username}
                          </span>
                        </div>

                        <span className="flex gap-2 items-center text-[11px]">
                          {user.uid === msg.data().uid && (
                            <BiTrash
                              onClick={() =>
                                setDeleteOn({
                                  isDelete: true,
                                  id: msg.id,
                                })
                              }
                              className="text-gray-600 active:text-gray-500"
                              size={15}
                            />
                          )}

                          {getTime(msg.data().timestamp)}
                        </span>
                      </div>

                      <p className="text-sm text-gray-300 ml-4 bg-black/25 p-2 rounded-md">
                        {msg.data().message}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <form onSubmit={sendMsg} className="absolute bottom-0 w-full z-50">
            <div className="flex items-center bg-black border-2 border-gray-600 rounded-md max-h-32 min-h-11 pl-3">
              <textarea
                type="text"
                placeholder="Write a message"
                maxLength={2500}
                value={newMsg}
                className="text-gray-300 bg-transparent py-2 resize-none h-10 max-h-32 focus:outline-none w-[92%] hideScroll"
                onChange={(e) => setNewMsg(e.target.value)}
              />
              <button className=" px-2" onClick={sendMsg}>
                <IoSend size={22} className="text-gray-400" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
