/* eslint-disable react/button-has-type */
import React, { useState, useEffect, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import supportedChains from "../../../utils/supportedChains";
import { buyGraphNft, buyNft, getFormatedPrice } from "../../../utils";
import openseaIcon from "../../../assets/icon-opensea.svg";
import lockIcon from "../../../assets/lock-white.svg";

import PrimaryButton from "../../../components/primary-button/PrimaryButton";

import { GenContext } from "../../../gen-state/gen.context";
import "./Deals.css";

const Deals = ({ nftDetails }) => {
  const {
    price,
    chain,
    sold,
    isListed,
    owner,
    account,
    chainId,
    mainnet,
    connector,
    dispatch,
    Id,
    collection_name,
    isSoulBound,
  } = nftDetails;
  const history = useHistory();
  const [usdValue, setUsdValue] = useState(0);
  const buyProps = {
    dispatch,
    account,
    connector,
    mainnet,
    nftDetails,
    history,
    chainId,
  };
  const { priceFeed } = useContext(GenContext);
  // const getUsdValue = async () => {
  //   if (priceFeed !== null) {
  //     const value = priceFeed[supportedChains[chain].coinGeckoLabel || supportedChains[chain].id];
  //     setUsdValue(Number(value) * Number(price));
  //   }
  // };

  const getUsdValue = async () => {
    const value = await getFormatedPrice(supportedChains[chain].coinGeckoLabel || supportedChains[chain].id);

    setUsdValue(Number(value) * Number(price));
  };

  useEffect(() => {
    getUsdValue();
  }, [priceFeed]);

  const chainButton = () => {
    return isSoulBound ? (
      <div className="lock">
        <img src={lockIcon} alt="" />
        <span>Non Transferable</span>
      </div>
    ) : !isListed && !price ? (
      owner === account && supportedChains[chain]?.networkId !== 1111 ? (
        <Link to={chain ? `/marketplace/1of1/list/${chain}/${Id}` : `/marketplace/1of1/list/${Id}`}>
          {isListed ? <PrimaryButton text="Re-List" disabled /> : <PrimaryButton text="List" />}
        </Link>
      ) : (
        <PrimaryButton text="Not Listed" disabled />
      )
    ) : owner === account && isListed ? (
      <PrimaryButton text="Listed" disabled />
    ) : !sold && isListed ? (
      <PrimaryButton onClick={() => buyGraphNft(buyProps)} text="Buy" />
    ) : account === owner ? (
      <Link to={chain ? `/marketplace/1of1/list/${chain}/${Id}` : `/marketplace/1of1/list/${Id}`}>
        <PrimaryButton text="List" />
      </Link>
    ) : price && !isListed ? (
      <PrimaryButton text="Sold" disabled />
    ) : isListed ? (
      <PrimaryButton text="Buy" onClick={() => buyGraphNft(buyProps)} />
    ) : (
      <PrimaryButton text="Not Listed" disabled />
    );
  };

  return (
    <div className="detail-section">
      <div className="sea">
        <div className="title">Current Price</div>
      </div>
      <div className="price-section">
        <div className="price">
          <img className="chainIcon" src={supportedChains[chain].icon} alt="" />
          <div className="price-text">{`${price ? Number(price).toFixed(2) : "0.0"}`}</div>
          <div className="appx">{`~ $${price ? usdValue.toFixed(2) : "0"}`}</div>
        </div>
        {chainButton()}
      </div>
    </div>
  );
};

export default Deals;
