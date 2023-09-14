import React from "react";
import Graph from "../../../components/Nft-details/graph/graph";
import classes from "./PriceHistory.module.css";

const PriceHistory = ({ transactionHistory }) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>Price History</div>
      <div className={classes.history}>{transactionHistory && <Graph details={transactionHistory} />}</div>
    </div>
  );
};

export default PriceHistory;
