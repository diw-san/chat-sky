import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import ChatRoom from "./Components/ChatRoom";
import SignIn from "./pages/SignIn";
import { useEffect } from "react";
import { auth } from "./Components/firebase";
import DeleteMsg from "./Components/DeleteMsg";

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const authChange = auth.onAuthStateChanged((user) => {
      if (user) {
        window.location.pathname === "/login" && navigate("/");
      } else {
        window.location.pathname !== "/login" && navigate("/login");
      }
    });
    return authChange;
  }, [navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<ChatRoom />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/d" element={<DeleteMsg />} />
      </Routes>
    </>
  );
}

export default App;
