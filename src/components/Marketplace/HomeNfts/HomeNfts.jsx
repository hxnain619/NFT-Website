import React from "react";
import { Link } from "react-router-dom";
import classes from "./HomeNfts.module.css";
import FeaturedNFTCards from "../featuredNfts/featuredCards";

const HomeNfts = () => {
  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <div className={classes.headingContainer}>
          <div className={classes.heading}>FEATURED NFTs </div>
          <div>Notable NFTs that were easily created on the Planform</div>
          <div>
            <Link to="/marketplace">
              <div className={classes.btn}>View All</div>
            </Link>
          </div>
        </div>
        <FeaturedNFTCards />
      </div>
    </div>
  );
};

export default HomeNfts;
