import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch } from "react-router-dom";
import { GenContext } from "../../gen-state/gen.context";
import { getSingleNftDetails } from "../../utils";
import classes from "./listed.module.css";
import telegram from "../../assets/blue-telegram.svg";
import twitterIcon from "../../assets/blue-twitter.svg";
import facebookIcon from "../../assets/blue-facebook.svg";
import linktree from "../../assets/linked-tree.svg";
import LoadingScreen from "../NFT-Detail/Loading-Screen/LoadingScreen";

const Listed = () => {
  const {
    params: { nftId },
  } = useRouteMatch();
  const { singleNfts } = useContext(GenContext);

  const [state, setState] = useState({
    isLoading: true,
  });
  const { nftDetails, isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    const nft = singleNfts.filter((singleNft) => String(singleNft.id) === nftId)[0];

    (async function getNftDetails() {
      const nftdetails = await getSingleNftDetails(nft);

      handleSetState({ nftDetails: nftdetails, isLoading: false });
    })();
    document.documentElement.scrollTop = 0;
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className={classes.container}>
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={nftDetails.image_url} alt="" />

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Enable Email Notification</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <div className={classes.priceDescription}>
            Enter your email address in your account settings so we can let you know, when your listing sells or
            receives offers
          </div>
          <button type="button" className={classes.buy}>
            Profile Settings
          </button>
        </div>
      </div>

      <div className={classes.feature}>
        <div className={classes.mainDetails}>
          <div className={classes.collectionHeader}>
            <div className={classes.nftId}>Share your listing</div>
          </div>
        </div>

        <div className={classes.detailContent}>
          <img src={twitterIcon} alt="Twitter-icon" />
          <img src={facebookIcon} alt="Facebook-icon" />
          <img src={telegram} alt="Telegram-icon" />
          <img src={linktree} alt="CopyT-icon" />
        </div>
      </div>
      <button type="button" className={classes.view}>
        View Item
      </button>
    </div>
  );
};

export default Listed;
