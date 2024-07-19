import React, { useEffect } from "react";
import SignUp from "./signUp.jsx";
import Login from "./Login.jsx";
import { useNavigate } from "react-router";

export default function Home({ ipcRenderer, currUser, list, notify }) {
  const navigate = useNavigate();
  useEffect(() => {
    if (currUser !== null) {
      if (currUser?.role === "admin") {
        navigate("/dboard", { replace: true });
      } else navigate("/wstation", { replace: true });
    }
  }, [currUser, list, navigate]);
  console.log("home");

  return (
    <>
      {JSON.stringify(list) === "[]" ? (
        <SignUp notify={notify} ipcRenderer={ipcRenderer} />
      ) : (
        <Login notify={notify} ipcRenderer={ipcRenderer} />
      )}
    </>
  );
}
