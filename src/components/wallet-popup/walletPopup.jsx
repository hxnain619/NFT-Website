/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";

// near wallets

// near wallet styles & icons
import "@near-wallet-selector/modal-ui/styles.css";
import classes from "./walletPopup.module.css";

// components
import { setProposedChain, setToggleWalletPopup } from "../../gen-state/gen.actions";
import { GenContext } from "../../gen-state/gen.context";
import supportedChains, { orderedChainsList } from "../../utils/supportedChains";

import DesktopPopup from "./desktopPopup";

// unused for now

const WalletPopup = ({ handleSetState }) => {
  const { dispatch, mainnet, connectFromMint } = useContext(GenContext);
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showConnectionMethods, setConnectionMethods] = useState(false);
  const [activeChain, setActiveChain] = useState(null);
  const [showMetamask, setMetamask] = useState(true);
  const [connectOptions, setConnectOptions] = useState(orderedChainsList);

  const handleProposedChain = async () => {
    dispatch(setProposedChain(activeChain));
    dispatch(setToggleWalletPopup(false));
    setConnectionMethods(false);
  };

  const handleChain = async (chainId, isComingSoon = undefined) => {
    if (isComingSoon) return;
    if (chainId === 4160 || supportedChains[chainId]?.chain === "Near") {
      setMetamask(false);
    } else {
      setMetamask(true);
      window.localStorage.removeItem("near_wallet");
    }
    if (window.selector) {
      const nearLogout = await window.selector.wallet();
      nearLogout.signOut();
    }

    setActiveChain(chainId);
    setConnectionMethods(true);
  };

  const handleMetamask = async () => {
    handleSetState({ connectionMethod: "metamask" });
    // initializeConnection({ dispatch, handleSetState, activeChain, mainnet });
    handleProposedChain();
  };

  const handleWalletConnect = async () => {
    handleSetState({ connectionMethod: "walletConnect" });
    handleProposedChain();
  };

  // const handleMagicLink = async () => {
  //   handleSetState({ connectionMethod: "magicLink" });
  //   handleProposedChain();
  // };
  useEffect(() => {
    setShowMoreOptions(false);
    setConnectionMethods(false);
  }, []);

  useEffect(() => {
    if (!connectFromMint.chainId) return;
    dispatch(setToggleWalletPopup(true));
    handleChain(connectFromMint.chainId, connectFromMint.isComingSoon);
  }, [connectFromMint, window.selector]);

  return (
    <div className={classes.container}>
      <div>
        <DesktopPopup
          showConnectionMethods={showConnectionMethods}
          mainnet={mainnet}
          connectOptions={connectOptions}
          showMoreOptions={showMoreOptions}
          handleChain={handleChain}
          setShowMoreOptions={setShowMoreOptions}
          dispatch={dispatch}
          setConnectionMethods={setConnectionMethods}
          handleMetamask={handleMetamask}
          handleWalletConnect={handleWalletConnect}
          showMetamask={showMetamask}
          setToggleWalletPopup={setToggleWalletPopup}
        />
      </div>
      {/* <div className={classes.mobileView}>
        <MobilePopup
          showConnectionMethods={showConnectionMethods}
          mainnet={mainnet}
          connectOptions={connectOptions}
          showMoreOptions={showMoreOptions}
          handleChain={handleChain}
          setShowMoreOptions={setShowMoreOptions}
          dispatch={dispatch}
          setConnectionMethods={setConnectionMethods}
          handleMetamask={handleMetamask}
          handleWalletConnect={handleWalletConnect}
          showMetamask={showMetamask}
          setToggleWalletPopup={setToggleWalletPopup}
        />
      </div> */}
    </div>
  );
};

export default WalletPopup;
