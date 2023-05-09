import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { setShowTallyView, setReset } from "../redux/TallyButtonSlice";
import TallyView from "./TallyView";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles.css";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const TallyButton = () => {
  const showTallyView = useSelector((state) => state.tallyButton.showTallyView);
  const reset = useSelector((state) => state.tallyButton.reset);
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(setShowTallyView());
  };

  const handleModalClose = () => {
    dispatch(setReset());
    handleClick();
  };

  return (
    <div>
      <Modal show={showTallyView} onHide={handleModalClose} centered>
        <Modal.Body>
          <TallyView />
        </Modal.Body>
      </Modal>
      <Button variant="primary" onClick={handleClick} className="appear-button">
        {!showTallyView ? (
          <AddIcon className="button-img" />
        ) : (
          <RemoveIcon className="button-img" />
        )}
      </Button>
    </div>
  );
};

export default TallyButton;
