import React from "react";
import { Navigate } from "react-router-dom";

export default function Home() {
  let token = localStorage.getItem("token");
  if (token) {
    return <Navigate to="/myprofile" />;
  } else {
    return <Navigate to="/auth/login" />;
  }
}
