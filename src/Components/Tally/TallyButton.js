import React from "react";
import ReactDOM from "react-dom";
import TallyView from "./TallyView";

function TallyButton({ handleClick, showTallyView }) {
  return (
    <button
      style={{
        position: "fixed",
        bottom: "10px",
        left: "10px",
      }}
      onClick={handleClick}
    >
      {!showTallyView ? (
        <img
          src="https://img.icons8.com/ios/50/000000/plus-math.png"
          alt="plus"
        />
      ) : (
        <img
          src="https://img.icons8.com/ios/50/000000/minus-math.png"
          alt="minus"
        />
      )}
    </button>
  );
}

export default TallyButton;
