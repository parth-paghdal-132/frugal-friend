import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowPress } from "../redux/SingleButtonSlice";
import { Button } from "react-bootstrap";
import { type } from "@testing-library/user-event/dist/type";

const SingleButton = ({ item, type, onClick }) => {
  const showPress = useSelector((state) => state.pressButton[item]);
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    if (e.target.value === item) {
      dispatch(setShowPress(item));
    }
  };

  const handleMouseUp = (e) => {
    if (e.target.value === item) {
      dispatch(setShowPress(item));
    }
  };

  return (
    <Button
      className="number-pad-button"
      value={item}
      type={type}
      onClick={onClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      style={{
        backgroundColor: showPress ? "#1E88E5" : "#F5F5F5",
        color: showPress ? "#FFFFFF" : "#212529",
      }}
      variant="outline-secondary"
      aria-label={item}
    >
      {item === "Backspace" || item === "Enter"
        ? item === "Backspace"
          ? "Back"
          : "Save"
        : item}
    </Button>
  );
};

export default SingleButton;
