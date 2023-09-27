/* eslint-disable dot-notation */
/* eslint-disable prefer-const */
import React, { useLayoutEffect } from "react";
import { useHistory } from "react-router-dom";
import NFTreasure from "../../assets/NFTreasure.png";
import PrimaryButton from "../primary-button/PrimaryButton";
import SecondaryButton from "../secondary-button/SecondaryButton";
import classes from "./something_wrong.module.css";

const SomethingWentWrong = () => {
  const history = useHistory();
  const goHome = () => {
    history.push("/");
    window.location.reload();
  };

  useLayoutEffect(() => {
    let hideFooter = document.getElementById("hide-footer");
    if (hideFooter) {
      hideFooter.style.display = "none";
    }
  }, []);

  return (
    <div className={classes["container"]}>
      <div className={classes["not-found"]}>
        <img src={NFTreasure} alt="NFTreasure Logo" />
        <h1>Oops something went wrong</h1>
        <div className={classes["text"]}>
          <span>We are working to fix it, click the refresh button to reload page.</span>
        </div>
      </div>
      <div className={classes["button-container"]}>
        <SecondaryButton text="Take Me Home" onClick={goHome} />
        <PrimaryButton text="Refresh" onClick={() => window.location.reload()} />
      </div>
    </div>
  );
};

export default SomethingWentWrong;
