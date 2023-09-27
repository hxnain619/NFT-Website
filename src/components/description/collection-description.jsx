/* eslint-disable react/jsx-curly-brace-presence */
/* eslint-disable no-return-assign */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-shadow */
import React, { useState, useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { setImageQuality, setOverlay, setMintAmount, setToggleUpgradeModal } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import CollectionDetails from "../details/collection-details";
import classes from "./collection-description.module.css";
import CollectionPreview from "../preview/collection-preview";
import { ReactComponent as PreviewIcon } from "../../assets/icon-nft-preview.svg";
import { handleGenerate } from "./collection-description-script";
import { plans } from "../../pages/Pricing/Pricing.script";

import PrimaryButton from "../primary-button/PrimaryButton";

const CollectionDescription = () => {
  const {
    layers,
    nftLayers,
    mintAmount,
    dispatch,
    combinations,
    rule,
    isRule,
    collectionName,
    imageQuality,
    currentPlan,
  } = useContext(GenContext);
  const canvasRef = useRef(null);
  const [state, setState] = useState({
    selectInputValue: 1,
    amountInputValue: "",
  });
  const { selectInputValue, amountInputValue } = state;

  const generateProps = {
    isRule,
    rule,
    mintAmount,
    combinations,
    layers,
    collectionName,
    dispatch,
    canvasRef,
    imageQuality,
  };

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const handleSelectChange = (e) => {
    handleSetState({ selectInputValue: e.target.value });
    dispatch(setImageQuality(parseInt(e.target.value)));
  };

  const handleAmountChange = (e) => {
    handleSetState({ amountInputValue: e.target.value });
  };

  const handleGenerateClick = () => {
    if (parseInt(amountInputValue) > Number(plans[currentPlan].amount)) {
      dispatch(setToggleUpgradeModal(true));
      return;
    }
    dispatch(setMintAmount(parseInt(amountInputValue)));
    handleGenerate({ ...generateProps, mintAmount: parseInt(amountInputValue) });
  };

  const handleMaxClick = () => {
    handleSetState({ amountInputValue: combinations });
  };

  useEffect(() => {
    dispatch(setOverlay(false));
    handleSetState({ amountInputValue: mintAmount });
  }, []);

  const ripple = window.sessionStorage.ripple;

  return (
    <div className={classes.container}>
      <div className={classes.preview_details}>
        <div className={classes.previewWrapper}>
          <CollectionPreview />
        </div>
        <div className={classes.detailsWrapper}>
          <CollectionDetails />
        </div>
      </div>

      <div className={classes.combinations_amount}>
        <div className={classes.combinations}>
          <div className={classes.title}>
            <span>Combinations</span>
          </div>
          <div className={classes.count}>{combinations}</div>
        </div>

        <div className={classes.amount}>
          <div htmlFor="amount to generate" className={classes.title}>
            <span>Generate</span>
          </div>

          <div className={classes.amountWrapper}>
            <input
              className={classes.amountInput}
              type="number"
              min="0"
              max={combinations}
              value={amountInputValue}
              onChange={handleAmountChange}
              placeholder="Eg: 1000"
            />

            <button type="button" onClick={handleMaxClick}>
              Max
            </button>
          </div>
        </div>
      </div>

      <div className={classes.generateContainer}>
        <div className={classes.generateSettings}>
          <div className={classes.wrapper}>
            <select value={selectInputValue} onChange={handleSelectChange} placeholder="Choose Image Quality">
              <option value={1}>High</option>
              <option value={0.5}>Medium</option>
              <option value={0.2}>Low</option>
            </select>
          </div>
        </div>
        <div className={classes.btnContainer}>
          {nftLayers.length ? (
            <div
              onClick={() => (window.sessionStorage.ripple = true)}
              className={`${classes.previewBtn} ${!ripple && classes.active}`}
            >
              <Link to={"/preview"}>
                <PreviewIcon className={classes.previewIcon} />
              </Link>
            </div>
          ) : null}

          <PrimaryButton
            text="Generate Collection"
            onClick={handleGenerateClick}
            width="100%"
            disabled={!combinations || combinations === 0}
          />
        </div>
      </div>
      <canvas style={{ display: "none" }} ref={canvasRef} />
    </div>
  );
};

export default CollectionDescription;
