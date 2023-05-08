import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setInput,
  setDecimal,
  setBackspace,
  setEnter,
} from "../redux/NumberPadSlice";
import SingleButton from "./SingleButton";
import { convertToNumber } from "../helpers/NumberPadHelp";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./styles.css";

const NumberPad = () => {
  const value = useSelector((state) => state.numberPad.value);
  const decimal = useSelector((state) => state.numberPad.decimal);
  const dispatch = useDispatch();

  const handleButtonClick = (e) => {
    let key = e.key || e.target.value;
    key = key.toString();

    if (key == "Backspace") {
      if (value.length == 1) {
        dispatch(setInput("0"));
        return;
      }
      if (value[value.length - 1] == ".") {
        dispatch(setDecimal(false));
      }
      dispatch(setBackspace());
      return;
    }
    if (key == "Enter") {
    }

    // = button
    if (key == "=") {
      if (value == "") {
        dispatch(setInput("0"));
        return;
      }
      if (
        value[value.length - 1] == "." ||
        value[value.length - 1] == "+" ||
        value[value.length - 1] == "-"
      ) {
        let result = value.toString().slice(0, -1);
        result = convertToNumber(result);
        if (result.includes(".")) {
          dispatch(setDecimal(true));
        } else {
          dispatch(setDecimal(false));
        }
        dispatch(setInput(result));
        return;
      }

      const result = convertToNumber(value);
      if (result.includes(".")) {
        dispatch(setDecimal(true));
      } else {
        dispatch(setDecimal(false));
      }
      dispatch(setInput(result));

      return;
    }

    if (key == "+") {
      if (value == "") {
        dispatch(setInput("0"));
        return;
      }
      if (value[value.length - 1] == "+" || value[value.length - 1] == "-") {
        const result = value.toString().slice(0, -1) + key.toString();
        dispatch(setInput(result));
        return;
      }
      if (value[value.length - 1] == ".") {
        const result = value.toString();
        dispatch(setInput(result));
        return;
      }

      const result = value.toString() + key.toString();
      dispatch(setDecimal(false));
      dispatch(setInput(result));
      return;
    }

    if (key == "-") {
      if (value == "") {
        dispatch(setInput("0"));
        return;
      }
      if (value[value.length - 1] == "+" || value[value.length - 1] == "-") {
        const result = value.toString().slice(0, -1) + key.toString();
        dispatch(setInput(result));
        return;
      }
      if (value[value.length - 1] == ".") {
        const result = value.toString();
        dispatch(setInput(result));
        return;
      }

      const result = value.toString() + key.toString();
      dispatch(setDecimal(false));
      dispatch(setInput(result));

      return;
    }

    // add decimal
    if (key == ".") {
      // check for decimal
      if (decimal) return;
      if (value.toString().trim() === "") {
        const result = "0" + key.toString();
        dispatch(setDecimal(true));
        dispatch(setInput(result));
        return;
      }
      // check for empty input 0.
      if (value === "0") {
        const result = value.toString() + key.toString();
        dispatch(setDecimal(true));
        dispatch(setInput(result));
      }
      // check for ..
      if (value[value.length - 1] == ".") {
        const result = value.toString();
        dispatch(setInput(result));
        return;
      }
      // check for +. or -.
      if (value[value.length - 1] == "+" || value[value.length - 1] == "-") {
        const result = value.toString() + "0" + key.toString();
        dispatch(setInput(result));
        return;
      }

      setDecimal(true);
      const result = value.toString() + key.toString();
      dispatch(setInput(result));
      return;
    }

    // add 0
    if (key == "0") {
      // check for "" + 0
      if (value === "") {
        dispatch(setInput("0"));
        return;
      }
      // check for +00000, -00000, 00000
      if (
        (value[value.length - 2] === "+" || value[value.length - 2] === "-") &&
        value[value.length - 1] === "0"
      ) {
        const result = value.toString().slice(0, -1) + key.toString();
        dispatch(setInput(result));
        return;
      }
      if (!decimal) {
        if (value === "0") return;
      }
      const result = value.toString() + key.toString();
      dispatch(setInput(result));
      return;
    }

    // check for +01, -01
    if (
      (value[value.length - 2] == "+" || value[value.length - 2] == "-") &&
      value[value.length - 1] == "0"
    ) {
      const result = value.toString().slice(0, -1) + key.toString();
      dispatch(setInput(result));
      return;
    }

    // check for 09
    if (value == "0") {
      const result = value.toString().slice(0, -1) + key.toString();
      dispatch(setInput(result));
      setInput(value);
      return;
    }

    const result = value.toString() + key.toString();
    dispatch(setInput(result));
  };

  const buttons = [
    "1",
    "2",
    "3",
    "Backspace",
    "4",
    "5",
    "6",
    "-",
    "7",
    "8",
    "9",
    "+",
    "Enter",
    "0",
    ".",
    "=",
  ].map((item) => <SingleButton item={item} onClick={handleButtonClick} />);

  return (
    <Container>
      <h1>Value: {value}</h1>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="number-pad-input">
            <Form.Control
              type="text"
              readOnly
              value={value}
              className="number-pad-input"
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        {buttons.map((button, index) => (
          <Col key={index} xs={3} className="my-1">
            {button}
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default NumberPad;
