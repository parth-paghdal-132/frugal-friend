import React from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../config/axiosConfig"

export default function Logout() {
  localStorage.removeItem("token");

  React.useEffect(() => {
    async function userLogOut() {
      await axiosInstance.get("/auth/logout");
    }

    userLogOut();
  }, [])

  return <Navigate to="/auth/login" state={{loginMessage: "You have been successfully logged out!"}}/>;
}
