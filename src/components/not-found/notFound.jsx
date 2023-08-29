import React from "react";
import icon from "../../assets/icon-not-found.png";
import classes from "./notFound.module.css";

const NotFound = () => (
  <div className={classes.container}>
    <div className={classes.imageContainer}>
      <img src={icon} alt="" />
    </div>
    <h1>No Results Found.</h1>
    <p>We can’t find any item matching your search</p>
  </div>
);

export default NotFound;
