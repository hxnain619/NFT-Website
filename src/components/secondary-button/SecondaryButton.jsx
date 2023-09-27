import React from "react";
import classes from "./SecondaryButton.module.css";

const SecondaryButton = ({ text, onClick, width }) => (
  <button type="button" className={`${classes.button}`} style={{ width }} onClick={onClick}>
    {text}
  </button>
);

export default SecondaryButton;
