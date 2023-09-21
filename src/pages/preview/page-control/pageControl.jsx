import React from "react";
import classes from "./pageControl.module.css";

const PageControl = ({ controProps }) => {
  const { handleGoto, handleNext, handlePrev, currentPage, currentPageValue, paginate, handleSetState } = controProps;
  return (
    <div className={classes.paginate}>
      <div onClick={handlePrev} className={classes.pageControl}>
        prev
      </div>
      <div className={classes.pageCount}>
        {currentPage} of {Object.keys(paginate).length}
      </div>
      <div onClick={handleNext} className={classes.pageControl}>
        next
      </div>
      <div className={classes.pageChoose}>
        <input
          min={1}
          type="number"
          value={currentPageValue}
          onChange={(e) => handleSetState({ currentPageValue: e.target.value >= 1 ? e.target.value : "" })}
        />
        <div onClick={handleGoto} className={classes.pageControl}>
          goto
        </div>
      </div>
    </div>
  );
};

export default PageControl;
