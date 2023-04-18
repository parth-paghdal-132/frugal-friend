import React, { useState, useEffect } from "react";

const SingleButton = ({ value, onClick }) => {
  const [press, setPress] = useState(false);

  const handlePress = () => {
    setPress(true);
    setTimeout(() => {
      setPress(false);
    }, 100);
  };

  const handleKeyDown = (e) => {
    if (e.repeat) return;
    if (e.key === "Enter") {
    }
    const key = e.key;
    if (key == value) {
      onClick(value);
      handlePress();
    }
  };

  const handleKeyUp = (e) => {
    setPress(false);
  };

  const handleMouseDown = () => {
    setPress(true);
  };

  const handleMouseUp = () => {
    setPress(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <button
      className="number-pad-button"
      onClick={() => onClick(value)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        backgroundColor: press ? "blue" : "lightgray",
      }}
    >
      {value}
    </button>
  );
};

export default SingleButton;
