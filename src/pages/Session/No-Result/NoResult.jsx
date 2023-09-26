import React from "react";
import { useHistory } from "react-router-dom";
import cardPacks from "../../../assets/cards-pack.png";
import PrimaryButton from "../../../components/primary-button/PrimaryButton";
import classes from "./NoResult.module.css";

const NotFound = () => {
  const history = useHistory();

  const handleCreate = () => {
    history.push("/create/collection");
  };

  return (
    <div className={classes.container}>
      <div className={classes.content}>
        <h1>Session</h1>
        <div className={classes.wrapper}>
          <img src={cardPacks} alt="card pack" />
          <div className={classes.description}>
            <h3>You have no saved session</h3>
            <div>Upgrade to any of our paid plans to save your session progress</div>
          </div>

          <PrimaryButton onClick={handleCreate} text="Create New" />
        </div>
      </div>
    </div>
  );
};

export default NotFound;
