import React, { useContext } from "react";
import { ReactComponent as LinkIcon } from "../../../assets/icon-link.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { chainIdToParams } from "../../../utils/chain";
import supportedChains from "../../../utils/supportedChains";
import { breakAddress } from "../NFTDetail-script";
import classes from "./Details.module.css";

const Details = ({ nftDetails }) => {
  const { owner, chain, isListed } = nftDetails;
  const { mainnet } = useContext(GenContext);
  console.log(nftDetails);
  const handleExplorer = () => {
    window.open(`${chainIdToParams[chain]?.blockExplorerUrls}address/${owner}`);
  };

  return (
    <div className={classes.container}>
      <div className={classes.heading}>Details</div>
      <div className={classes.listContainer}>
        <div className={classes.list}>
          <div>Mint address</div>
          <div onClick={handleExplorer} className={`${classes.value} ${classes.textPurple}`}>
            {breakAddress(owner, 8)}
            <LinkIcon />
          </div>
        </div>
        {isListed && (
          <div className={classes.list}>
            <div>Marketplace Fee</div>
            <div>10%</div>
          </div>
        )}
        {isListed && (
          <div className={`${classes.list} ${classes.total}`}>
            <div>Total</div>
            <div>10%</div>
          </div>
        )}
        <div className={classes.list}>
          <div>Token ID</div>
          <div>{nftDetails.tokenID}</div>
        </div>
        <div className={classes.list}>
          <div>Blockchain</div>
          <div>{supportedChains[chain]?.label}</div>
        </div>
      </div>
    </div>
  );
};

export default Details;
