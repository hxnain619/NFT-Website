import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import classes from "./skeleton.module.scss";

import "react-loading-skeleton/dist/skeleton.css";

const SkeletonCards = ({ animation = "wave", baseColor = "#4b5067", highlightColor = "#646a87" }) => (
  <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} enableAnimation>
    <div className={classes.skeletonWrapper}>
      {[...new Array(4)]
        .map((_, idx) => idx)
        .map((id) => (
          <div className={classes.skeleton} key={id}>
            {[250, 20, 20].map((size, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <Skeleton key={size + index} animation={animation} count={1} height={size} />
            ))}
          </div>
        ))}
    </div>
  </SkeletonTheme>
);

export default SkeletonCards;
