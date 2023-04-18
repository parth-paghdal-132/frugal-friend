import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import TallyButton from "./Tally/TallyButton";
import TallyView from "./Tally/TallyView";

export default function Home() {
  const [showTallyView, setShowTallyView] = useState(false);

  const handleClick = () => {
    setShowTallyView(!showTallyView);
  };

  return (
    <div>
      {showTallyView && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
          // onClick={handleClick} // Added this line to allow closing TallyView by clicking on the overlay
        >
          <TallyView />
          <TallyButton
            handleClick={handleClick}
            showTallyView={showTallyView}
          />
        </div>
      )}
      <div
        style={{
          filter: showTallyView ? "blur(2px)" : "none",
          pointerEvents: showTallyView ? "none" : "auto",
        }}
      >
        {/* Your parent component's content goes here */}
      </div>
      <TallyButton handleClick={handleClick} showTallyView={showTallyView} />
    </div>
  );
}
