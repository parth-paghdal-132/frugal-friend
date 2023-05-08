import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowTallyView } from "../redux/TallyButtonSlice";
import TallyView from "./TallyView";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
const TallyButton = () => {
  const showTallyView = useSelector((state) => state.tallyButton.showTallyView);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setShowTallyView());
  };

  return (
    <div>
      <Modal show={showTallyView} onHide={handleClick} centered>
        <Modal.Body>
          <TallyView />
        </Modal.Body>
      </Modal>
      <Button variant="primary" onClick={handleClick} className="appear-button">
        {!showTallyView ? (
          <img
            className="button-img"
            src="https://img.icons8.com/ios/50/000000/plus-math.png"
            alt="display tally view"
          />
        ) : (
          <img
            className="button-img"
            src="https://img.icons8.com/ios/50/000000/minus-math.png"
            alt="hide tally view"
          />
        )}
      </Button>
    </div>
  );
};

export default TallyButton;
