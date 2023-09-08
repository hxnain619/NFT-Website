import React from "react";
import lockIcon from "../../../assets/lock-icon.svg";
import supportedChains from "../../../utils/supportedChains";
import classes from "./CardFooter.module.css";

const formattedNumber = (number, decimals = 2) => {
  const input = number?.toFixed(decimals);
  return parseFloat(input);
};

export const MarketplaceView = ({ footerPrpops }) => {
  const { price, chain, account, owner, sold, isListed, usdValue, isSoulBound } = footerPrpops;
  return (
    <div className={classes.marketplace}>
      <div className={classes.floorPrice}>
        <div className={classes.priceLabel}>Price</div>
        <div className={classes.amount}>
          <span className={classes.accent}>
            {formattedNumber(Number(price), 4)} {supportedChains[chain]?.symbol}
          </span>
          {/* <span>{`($${formattedNumber(usdValue, 4)})`}</span> */}
        </div>
      </div>
      {isSoulBound ? (
        <div className={classes.lock}>
          <img src={lockIcon} alt="" />
          <span>Non Transferable</span>
        </div>
      ) : !price ? (
        owner === account && supportedChains[chain]?.chain !== "Near" ? (
          <div className={classes.btn}>List</div>
        ) : (
          <div className={`${classes.btn} ${classes.disable}`}>Not Listed</div>
        )
      ) : sold && price && !isListed ? (
        <div className={`${classes.btn} ${classes.disable}`}>Sold</div>
      ) : (
        <div className={classes.btn}>Listed</div>
      )}
    </div>
  );
};

// Dashboard Cards

// On  Sale
export const OnSalveView = ({ footerPrpops }) => {
  const { price, chain, usdValue, isSoulBound } = footerPrpops;
  return (
    <div className={classes.onSale}>
      <div className={classes.floorPrice}>
        <div className={classes.priceLabel}>Price</div>
        <div className={classes.amount}>
          <p className={classes.accent}>
            {formattedNumber(Number(price))} {supportedChains[chain].symbol}
          </p>
        </div>
      </div>
      {isSoulBound && (
        <div className={classes.lock}>
          <img src={lockIcon} alt="" />
          <span>Non Transferable</span>
        </div>
      )}
    </div>
  );
};

// Collected
export const CollectedView = ({ footerPrpops }) => {
  const { price, userId, account, isListed } = footerPrpops;
  return (
    <div className={classes.collected}>
      <div className={`${classes.list}  ${price || userId ? classes.listed : ""}`}>
        {!isListed ? (userId === account ? "List" : "Not Listed") : "Listed"}
      </div>
    </div>
  );
};
