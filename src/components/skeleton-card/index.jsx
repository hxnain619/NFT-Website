import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import classes from "./skeleton.module.scss";

import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCards = ({
  animation = "wave",
  baseColor = "#4b5067",
  highlightColor = "#646a87",
  cardsLength = 4, // number of cards
  customSize = [250, 20, 20], // define each card height
  className = "",
  fullWidth = false,
}) => (
  <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} enableAnimation>
    <div className={`${classes.skeletonWrapper} ${fullWidth && classes.fullWidth}`}>
      {[...new Array(cardsLength)]
        .map((_, idx) => idx)
        .map((id) => (
          <div className={`${classes.skeleton}  ${fullWidth && classes.skeletonFull} ${className}`} key={id}>
            {customSize?.map((size, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={size + index} animation={animation} count={1} height={size} />
            ))}
          </div>
        ))}
    </div>
  </SkeletonTheme>
);

export default SkeletonCards;
