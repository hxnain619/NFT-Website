/* eslint-disable consistent-return */
import React from "react";
import downIcon from "../../../assets/down-icon.svg";
import rightIcon from "../../../assets/right-icon.svg";
import classes from "./FAQCard.module.css";

const FQACard = ({ dropdown, id, handleSetState, FAQ: { question, answer } }) => {
  const handleDropdown = () => {
    if (String(id) === dropdown) return handleSetState({ dropdown: "" });
    handleSetState({ dropdown: String(id) });
  };

  return (
    <div onClick={handleDropdown} className={classes.container}>
      <div className={`${classes.question} ${dropdown === String(id) && classes.active}`}>
        <p className={classes.title}>{question}</p>
        <span>
          {dropdown === String(id) ? (
            <img className={classes.downIcon} src={downIcon} alt="" />
          ) : (
            <img className={classes.rightIcon} src={rightIcon} alt="" />
          )}
        </span>
      </div>
      <div className={`${classes.answer} ${dropdown === String(id) && classes.active}`}>{answer}</div>
    </div>
  );
};

export default FQACard;
