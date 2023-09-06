import React from "react";
import classes from "./GlowCircle.module.css";

const GlowCircle = () => {
  return (
    <div className={classes.glowContainer}>
      <div className={classes.glowLeft} />
      <div className={classes.glowCenter} />
      <div className={classes.glowRight} />
    </div>
  );
};

export default GlowCircle;
