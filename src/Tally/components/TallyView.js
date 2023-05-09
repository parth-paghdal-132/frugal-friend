import React from "react";
import NumberPad from "./NumberPad";
import { Alert } from "react-bootstrap";
import { useSelector } from "react-redux";
const TallyView = () => {
  const sentence = useSelector((state) => state.numberPad.sentence);
  return (
    <div>
      <h1>Add Expense</h1>
      {sentence.en && (
        <Alert
          variant={sentence.er ? "danger" : "success"}
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          {sentence.en}
        </Alert>
      )}
      <NumberPad />
    </div>
  );
};

export default TallyView;
