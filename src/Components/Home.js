import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import store from "../Tally/redux/store";
export default function Home() {
  // const [showTallyView, setShowTallyView] = useState(false);

  // const handleClick = () => {
  //   setShowTallyView(!showTallyView);
  // };

  return (
    <div>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <h1>Wei Begin</h1>
      <Provider store={store}>
        <Outlet />
      </Provider>
    </div>
  );
}
