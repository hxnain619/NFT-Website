import React from "react";
import classes from "./PageControl.module.css";

const PageControl = ({ controProps }) => {
  const { handleGoto, handleNext, handlePrev, currentPage, currentPageValue, paginate, handleSetState } = controProps;
  return (
    <div className={classes.paginate}>
      <div onClick={handlePrev} className={classes.pageControl}>
        Prev
      </div>
      <div className={classes.pageCount}>
        {currentPage} of {Object.keys(paginate).length}
      </div>
      <div onClick={handleNext} className={classes.pageControl}>
        Next
      </div>
      <div className={classes.pageChoose}>
        <input
          min={1}
          type="number"
          value={currentPageValue}
          onChange={(e) => handleSetState({ currentPageValue: e.target.value >= 1 ? e.target.value : "" })}
        />
        <div onClick={handleGoto} className={classes.pageControl}>
          GoTo
        </div>
      </div>
    </div>
  );
};

export default PageControl;
