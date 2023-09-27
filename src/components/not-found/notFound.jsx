import React from "react";
import icon from "../../assets/no-result.png";
import classes from "./notFound.module.css";

const NotFound = () => (
  <div className={classes.container}>
    <div className={classes.imageContainer}>
      <img src={icon} alt="" />
      <img src={icon} alt="" />
      <img src={icon} alt="" />
    </div>
    <h1>You have no Items to display</h1>
  </div>
);

export default NotFound;
