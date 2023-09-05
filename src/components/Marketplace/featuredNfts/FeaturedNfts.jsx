import React from "react";
import classes from "./FeaturedNfts.module.css";
import FeaturedNFTCards from "./featuredCards";

const FeautedNfts = () => {
  return (
    <div className={classes.container}>
      <div className={classes.headingContainer}>
        <div className={classes.heading}>Featured NFTs </div>
      </div>
      <FeaturedNFTCards />
    </div>
  );
};

export default FeautedNfts;
