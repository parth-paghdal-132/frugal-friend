import React from "react";
import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <div className="navigation">
      <ul className="navigation_ul">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/auth/signup"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Signup
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/auth/login"
            className={({ isActive }) => (isActive ? "active" : "inactive")}
          >
            Login
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
