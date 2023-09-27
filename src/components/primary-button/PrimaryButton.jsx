import React from "react";
import classes from "./PrimaryButton.module.css";

const PrimaryButton = ({ text, onClick, width, disabled }) => (
  <button type="button" className={`${classes.button}`} style={{ width }} onClick={onClick} disabled={disabled}>
    {text}
  </button>
);

export default PrimaryButton;
