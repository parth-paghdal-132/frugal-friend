import React from "react";

export default function Logout() {
  localStorage.removeItem("token");
  return (
    // destroy the token
    // redirect to login page

    <div>
      <h1>Logout</h1>
    </div>
  );
}
