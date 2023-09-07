import React from "react";
import { useHistory } from "react-router-dom";
import GlowCircle from "../../glow-circle/GlowCircle";
import Search from "../../Search/Search";
import Chains from "../Chains/Chains";
import classes from "./Banner.module.css";

const Banner = () => {
  return (
    <div className={classes.container}>
      <div className={classes.wrapper}>
        <div className={classes.heading}>
          <div className={classes.title}>
            Find, Buy and Sell NFTs across <br /> blockchains
          </div>
          <div className={classes.searchContainer}>
            <Search searchPlaceholder="Search collections, and 1 of 1s" type="" />
          </div>
        </div>
        <Chains />
      </div>
      <GlowCircle />
    </div>
  );
};

export default Banner;
