import React, { useContext, useEffect, useState } from "react";
import { useRouteMatch, Link, useHistory } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { FacebookShareButton, TwitterShareButton, TelegramShareButton } from "react-share";
import CopyToClipboard from "react-copy-to-clipboard";
import classes from "./listed.module.css";
import { GenContext } from "../../../gen-state/gen.context";
import supportedChains from "../../../utils/supportedChains";
// import { getUserBoughtNftCollection } from "../../../utils";
import { getNftById } from "../../../renderless/fetch-data/fetchUserGraphData";
// import { fetchUserBoughtNfts } from "../../../utils/firebase";
import telegram from "../../../assets/blue-telegram.svg";
import twitterIcon from "../../../assets/blue-twitter.svg";
import facebookIcon from "../../../assets/blue-facebook.svg";
import linktree from "../../../assets/linked-tree.svg";

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
  }, []);

  if (isLoading) {
    return (
      <div className={classes.menu}>
        <div className={classes.left}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.right}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={40} />
          <br />
          <Skeleton count={1} height={40} />
        </div>

        <div className={classes.fullLegnth}>
          <Skeleton count={1} height={200} />
          <br />
          <Skeleton count={1} height={200} />
        </div>
      </div>
    );
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
        Share
        <div className={classes.detailContent}>
          <TwitterShareButton url={shareURL}>
            <img src={twitterIcon} alt="Twitter-icon" />
          </TwitterShareButton>
          <FacebookShareButton url={shareURL}>
            <img src={facebookIcon} alt="Facebook-icon" />
          </FacebookShareButton>
          <TelegramShareButton url={shareURL}>
            <img src={telegram} alt="Telegram-icon" />
          </TelegramShareButton>
          <CopyToClipboard text={shareURL}>
            <img src={linktree} alt="CopyT-icon" />
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
