import React, { useContext, useEffect, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FacebookShareButton, TelegramShareButton, TwitterShareButton, RedditShareButton } from "react-share";
import twitterIcon from "../../../assets/icon-social-twitter.svg";
import facebookIcon from "../../../assets/icon-social-facebook.svg";
import redditIcon from "../../../assets/icon-social-reddit.svg";
import telegramIcon from "../../../assets/icon-social-telegram.svg";
import copyIcon from "../../../assets/icon-copy.svg";

import { GenContext } from "../../../gen-state/gen.context";
import { getNftById } from "../../../renderless/fetch-data/fetchUserGraphData";
import supportedChains from "../../../utils/supportedChains";
import LoadingScreen from "../../NFT-Detail/Loading-Screen/LoadingScreen";
import classes from "./listed.module.css";

const Listed = () => {
  const { mainnet, activeCollection } = useContext(GenContext);

  const {
    params: { nftId },
  } = useRouteMatch();
  const { params } = useRouteMatch();
  const { chainId } = useContext(GenContext);
  const history = useHistory();
  const [state, setState] = useState({
    isLoading: true,
  });
  const { nftDetails, isLoading } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  useEffect(() => {
    if (chainId > 0) {
      (async function getUserCollection() {
        const [nft] = await getNftById(nftId, supportedChains[chainId]?.chain);
        if (!nft) history.push("/");
        else {
          handleSetState({
            nftDetails: nft,
            isLoading: false,
          });
        }
      })();
      document.documentElement.scrollTop = 0;
    }
  }, [chainId]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  const baseURL = `${window.location.protocol}//${window.location.host}`;
  const shareURL =
    nftDetails?.collection_name !== "Genadrop 1 of 1" && nftDetails?.chain !== 4160
      ? `${baseURL}/marketplace/collections/${
          nftDetails?.chain === 4160 ? nftDetails?.collection_name : nftDetails?.collection_contract
        }/${nftDetails?.Id}`
      : `${baseURL}/marketplace/1of1/${nftDetails?.chain}/${nftDetails?.Id}`;

  const marketPlaceURL =
    nftDetails?.collection_name !== "Genadrop 1 of 1" && nftDetails?.chain !== 4160
      ? `/marketplace/collections/${nftDetails?.chain}~${
          nftDetails?.chain === 4160 ? nftDetails?.collection_name : nftDetails?.collection_contract
        }/${nftDetails?.Id}`
      : `/marketplace/1of1/${nftDetails?.chain}/${nftDetails?.Id}`;
  return (
    <div className={classes.container}>
      <span>Your item is now listed for sale</span>
      <img className={classes.nft} src={nftDetails?.image_url} alt="" />

      <div className={classes.nftId}>
        Share it on Socials, or turn it into physical merchandise like canvases, t-shirts, hoodies, and more...{" "}
        <div className={classes.detailContent}>
          <TwitterShareButton url={shareURL}>
            <img src={twitterIcon} alt="Twitter-icon" />
          </TwitterShareButton>
          <RedditShareButton>
            <img src={redditIcon} alt="Reddit-icon" />
          </RedditShareButton>
          <FacebookShareButton url={shareURL}>
            <img src={facebookIcon} alt="Facebook-icon" />
          </FacebookShareButton>
          <TelegramShareButton url={shareURL}>
            <img src={telegramIcon} alt="Telegram-icon" />
          </TelegramShareButton>
          <CopyToClipboard text={shareURL}>
            <img src={copyIcon} alt="CopyT-icon" />
          </CopyToClipboard>
        </div>
      </div>
      <Link to={marketPlaceURL} className={classes.view}>
        <button type="button" className={classes.viewtext}>
          View NFT
        </button>
      </Link>
    </div>
  );
};

export default Listed;
