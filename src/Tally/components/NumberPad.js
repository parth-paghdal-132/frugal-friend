import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setInput,
  setDecimal,
  setBackspace,
  setEnter,
  setCategory,
  setDescribe,
  loadAllData,
  setSentence,
} from "../redux/NumberPadSlice";
import SingleButton from "./SingleButton";
import { convertToNumber } from "../helpers/NumberPadHelp";
import { Container, Row, Col, Form } from "react-bootstrap";
import "./styles.css";
import axiosInstance from "../../config/axiosConfig";
const NumberPad = () => {
  const value = useSelector((state) => state.numberPad.value);
  const decimal = useSelector((state) => state.numberPad.decimal);
  const selectedCategory = useSelector((state) => state.numberPad.category);
  const expenseDescription = useSelector((state) => state.numberPad.describe);
  const allData = useSelector((state) => state.numberPad.allData);
  const sentence = useSelector((state) => state.numberPad.sentence);
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const sessionData = allData.sessionDate;
    const budgetData = allData.budgetData;
    if (sessionData === null) {
      try {
        dispatch(loadAllData());
      } catch (error) {
        console.error(error);
      }
    }
    if (sessionData === null) {
      dispatch(
        setSentence({
          er: true,
          en: "You need to login before add expense",
        })
      );
      // return alert("You need to login before add expense");
    }
    if (!budgetData) {
      dispatch(
        setSentence({
          er: true,
          en: "You need to set goal for current month before add expense",
        })
      );
      // alert("You need set goal for current month before add expense");
    }

    if (selectedCategory && value !== "0") {
      try {
        const response = await axiosInstance.post("/api/add-expense", {
          userId: sessionData._id,
          category: selectedCategory,
          amount: value,
          description: expenseDescription,
        });
        dispatch(
          setSentence({
            er: false,
            en: "Add Expense Successfully, you have been awarded 1 point!",
          })
        );
      } catch (error) {
        console.error(error);
      }
    } else if (value === "0") {
      dispatch(
        setSentence({
          er: true,
          en: "Please enter a valid number for Amount.",
        })
      );
    } else {
      dispatch(
        setSentence({
          er: true,
          en: "Please select a category.",
        })
      );
    }
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
  ].map((item) => (
    <SingleButton
      item={item}
      type={item !== "Enter" ? "button" : "Submit"}
      onClick={item !== "Enter" ? handleButtonClick : handleSubmit}
    />
  ));

  const handleCategoryChange = (e) => {
    const value = e.target.value;

    dispatch(setCategory(value));
  };

  const handleDescriptionChange = (e) => {
    const value = e.target.value;

    dispatch(setDescribe(value));
  };

  useEffect(() => {
    dispatch(loadAllData());
  }, []);

  return (
    <Container>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col xs={12}>
            <Form.Group controlId="category-selector">
              <Row>
                <Col xs={3} className="d-flex align-items-center">
                  <Form.Label>Category</Form.Label>
                </Col>
                <Col xs={9}>
                  <Form.Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                  >
                    <option value="">Select category</option>
                    <option value="Food and groceries">
                      Food and groceries
                    </option>
                    <option value="Housing and utilities">
                      Housing and utilities
                    </option>
                    <option value="Transportation">Transportation</option>
                    <option value="Personal care">Personal care</option>
                    <option value="Entertainment"> "Entertainment"</option>
                    {/* Add more categories as needed */}
                  </Form.Select>
                </Col>
              </Row>
            </Form.Group>
          </Col>
          <Col xs={12}>
            <Form.Group controlId="description-input">
              <Row>
                <Col xs={3} className="d-flex align-items-center">
                  <Form.Label>Description</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    value={expenseDescription}
                    onChange={handleDescriptionChange}
                  />
                </Col>
              </Row>
            </Form.Group>
          </Col>

          <Col xs={12}>
            <Form.Group controlId="number-pad-input">
              <Row>
                <Col xs={3} className="d-flex align-items-center">
                  <Form.Label>Amount</Form.Label>
                </Col>
                <Col>
                  <Form.Control
                    type="text"
                    readOnly
                    value={value}
                    className="number-pad-input"
                  />
                </Col>
              </Row>
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
      </Form>
    </Container>
  );
};

export default NumberPad;
