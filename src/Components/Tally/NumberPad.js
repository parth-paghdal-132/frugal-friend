import React, { useState, useEffect } from "react";
import SingleButton from "./SingleButton";
import "./styles.css";

const NumberPad = () => {
  const [input, setInput] = useState("");
  const [saved, setSaved] = useState([]);
  const [press, setPress] = useState(false);
  const [decimal, setDecimal] = useState(false);
  const [maxPrecision, setMaxPrecision] = useState(null);
  const [decimalLength, setDecimalLength] = useState(0);

  const handleButtonClick = (e) => {
    // Check the precision of the number
    const CheckPrecision = (num) => {
      const numString = num.toString();
      const decimalIndex = numString.lastIndexOf(".");
      if (decimalIndex === -1) return 0;
      return numString.length - decimalIndex - 1;
    };

    const value = e.target ? e.target.value : e;
    if (value == "Backspace") {
      setInput((prevInput) => prevInput.slice(0, -1));
      return;
    }
    if (value == "Save") {
      setMaxPrecision((prev) =>
        prev > CheckPrecision(input) ? prev : CheckPrecision(input)
      );
      setInput((prevInput) => eval(prevInput));
      return;
    }
    if (value == "add again") {
      setInput((prevInput) => eval(prevInput));
      return;
    }
    if (value == "+") {
      if (input == "") {
        setInput("0");
        return;
      }
      if (input[input.length - 1] == "+") {
        setInput((prevInput) => prevInput.slice(0, -1) + value);
        return;
      }
      setMaxPrecision((prev) =>
        prev > CheckPrecision(input) ? prev : CheckPrecision(input)
      );
      setDecimal(false);
      setInput((prevInput) => prevInput + value);
      return;
    }
    if (value == "-") {
      if (input == "") {
        setInput("0");
        return;
      }
      if (input[input.length - 1] == "-") {
        setInput((prevInput) => prevInput.slice(0, -1) + value);
        return;
      }
      setMaxPrecision((prev) =>
        prev > CheckPrecision(input) ? prev : CheckPrecision(input)
      );
      setDecimal(false);
      setInput((prevInput) => prevInput + value);
      return;
    }

    // add decimal
    if (value == ".") {
      // check for decimal
      if (decimal) return;
      // check for empty input 0.
      if (input == "") {
        setInput("0.");
      }
      // check for ..
      if (input[input.length - 1] == ".") {
        setInput((prevInput) => prevInput.slice(0, -1) + value);
        return;
      }
      // check for +.
      if (input[input.length - 1] == "+") {
        setInput((prevInput) => prevInput + "0.");
        return;
      }
      // check for -.
      if (input[input.length - 1] == "-") {
        setInput((prevInput) => prevInput + "0.");
        return;
      }
      setDecimal(true);
      setInput((prevInput) => prevInput + value);
      return;
    }

    // add 0
    if (value == "0") {
      // check for "" + 0
      if (input === "") {
        setInput("0");
        return;
      }
      // check for 00000
      if (
        (input[input.length - 2] == "+" || input[input.length - 2] == "-") &&
        input[input.length - 1] == "0"
      ) {
        setInput((prevInput) => prevInput.slice(0, -1) + value);
        return;
      }
      setInput((prevInput) => prevInput + value);
      return;
    }

    // check for +01, -01
    if (
      (input[input.length - 2] == "+" || input[input.length - 2] == "-") &&
      input[input.length - 1] == "0"
    ) {
      setInput((prevInput) => prevInput.slice(0, -1) + value);
      return;
    }

    // check for 09
    if (input == "0" && value != ".") {
      setInput(value);
      return;
    }

    setInput((prevInput) => `${prevInput}${value}`);
  };

  const buttons = [
    1,
    2,
    3,
    "Backspace",
    4,
    5,
    6,
    "-",
    7,
    8,
    9,
    "+",
    "add again",
    0,
    ".",
    "Save",
  ].map((value) => (
    <SingleButton key={value} value={value} onClick={handleButtonClick} />
  ));

  return (
    <div>
      <input type="text" readOnly value={input} className="number-pad-input" />
      <div className="number-pad-grid">{buttons}</div>
    </div>
  );
};

export default NumberPad;
