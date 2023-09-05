/* eslint-disable no-shadow */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { ethers } from "ethers";
import classes from "./wallet.module.css";
import { GenContext } from "../../gen-state/gen.context";
import userIcon from "../../assets/icon-user.svg";
import switchIcon from "../../assets/icon-switch.svg";
import copyIcon from "../../assets/icon-copy.svg";
import { ReactComponent as DropdownIcon } from "../../assets/icon-chevron-down.svg";
import disconnectIcon from "../../assets/icon-disconnect.svg";
import WalletPopup from "../wallet-popup/walletPopup";
import supportedChains from "../../utils/supportedChains";
import bellIcon from "../../assets/bell.svg";
import useCommon from "../../hooks/useCommon";

import {
  setNetworkType,
  connectWallet,
  getConnectedChain,
  breakAddress,
  disconnectWallet,
  connectWithQRCode,
  initializeConnection,
  initConnectWallet,
} from "./wallet-script";

// import { setSwitchWalletNotification } from "../../gen-state/gen.actions";
import PushNotification from "../notifications/PushNotification";

function ConnectWallet() {
  const history = useHistory();
  const { pathname } = useLocation();
  const clipboardRef = useRef();
  const walletProviderRef = useRef(0);
  const { dispatch, account, chainId, proposedChain, mainnet, toggleWalletPopup } = useContext(GenContext);
  const [balance, setBalance] = useState(0);
  const { americanFormatNumber } = useCommon();

  const [state, setState] = useState({
    clipboardState: "Copy Address",
    network: null,
    walletConnectProvider: null,
    connectionMethod: null,
    isMetamask: true,
    openNotification: false,
    overrideWalletConnect: false,
    rpc: null,
  });

  const {
    clipboardState,
    openNotification,
    network,
    walletConnectProvider,
    overrideWalletConnect,
    connectionMethod,
    rpc,
    isMetamask,
  } = state;

  const handleSetState = (payload) => {
    setState((state) => ({ ...state, ...payload }));
  };

  const walletProps = {
    dispatch,
    supportedChains,
    proposedChain,
    mainnet,
    chainId,
    walletConnectProvider,
    connectionMethod,
    walletProviderRef,
    rpc,
    history,
    pathname,
    handleSetState,
  };

  const handleCopy = (props) => {
    const { navigator, clipboard } = props;
    clipboard.select();
    clipboard.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(clipboard.value);
    handleSetState({ clipboardState: "Copied" });
    setTimeout(() => {
      handleSetState({ clipboardState: "Copy Address" });
    }, 850);
  };

  const handleDisconnet = async () => {
    disconnectWallet(walletProps);
  };

  // const handleNetworkClick = () => {
  //   dispatch(setSwitchWalletNotification(true));
  // };

  const handleDashboard = () => {
    history.push(`/profile/${chainId}/${account}`);
  };

  useEffect(() => {
    setNetworkType(walletProps);
  }, [chainId]);

  useEffect(() => {
    const isSupported = Object.keys(supportedChains).includes(String(proposedChain));
    if (!isSupported) return;
    connectWallet(walletProps);
  }, [proposedChain, connectionMethod]);

  useEffect(() => {
    if (walletProviderRef.current >= 2 || overrideWalletConnect) {
      handleSetState({ overrideWalletConnect: false });
      connectWithQRCode(walletProps);
    } else {
      walletProviderRef.current = +1;
    }
  }, [walletConnectProvider, overrideWalletConnect]);

  useEffect(() => {
    initializeConnection(walletProps);
  }, [rpc, window.selector]);

  useEffect(() => {
    const getAccountBalance = async () => {
      // Fetch account balance using Ether.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceWei = await provider.getBalance(account); // accounts is an array, so we use [0] to access the first account
      const balanceEther = ethers.utils.formatEther(balanceWei);
      // console.log(`Account Balance: ${balanceEther} ETH`);
      setBalance(balanceEther);
    };
    if (account && account.length > 15) getAccountBalance();
  }, [account]);

  const dropdown = (
    <div className={classes.dropdownContainer}>
      <div className={classes.dropdown}>
        <div onClick={handleDashboard} className={classes.option}>
          <img src={userIcon} alt="" />
          <div>View Profile</div>
        </div>
        <div onClick={() => initConnectWallet(walletProps)} className={classes.option}>
          <img src={switchIcon} alt="" />
          <div>Switch network</div>
        </div>
        <div onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })} className={classes.option}>
          <img src={copyIcon} alt="" />
          <div>{clipboardState}</div>
          <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={account} />
        </div>
        <div onClick={handleDisconnet} className={classes.option}>
          <img src={disconnectIcon} alt="" />
          <div>Disconnect</div>
        </div>
      </div>
    </div>
  );

  const connected = (
    <div className={classes.connectedContainer}>
      <div className={classes.balance}> {americanFormatNumber(balance, 3)} AVAX </div>
      <div className={classes.connected}>
        <div className={classes.address}>
          <span>{account?.length > 15 ? breakAddress(account) : account}</span>
        </div>
        <img className={classes.chain} src={getConnectedChain(chainId)} alt="" />
      </div>
      {dropdown}
    </div>
  );

  const changeNetwork = (
    <div className={classes.networkContainer}>
      <div className={classes.notificationContent}>
        <div className={`${classes.notification} ${openNotification && classes.notiActive}`}>
          <img
            className={classes.nIcon}
            src={bellIcon}
            alt=""
            onClick={() => handleSetState({ openNotification: true })}
          />
          <div id="push-notification" className={classes.pushNotification}>
            <PushNotification toggleNotification={handleSetState} />
          </div>
        </div>
      </div>
      <div className={classes.network}>
        <div className={`${classes.dot} ${network === "mainnet" && classes.mainnet}`} />{" "}
        <div className={classes.activeNetwork}>{network === "mainnet" ? "Mainnet" : "Testnet"}</div>
      </div>
    </div>
  );

  return (
    <>
      {toggleWalletPopup && (
        <div className={`${classes.popupContainer} ${toggleWalletPopup && classes.active}`}>
          <WalletPopup isMetamask={isMetamask} handleSetState={handleSetState} />
        </div>
      )}
      {account ? (
        <div className={classes.container}>
          {connected}
          {changeNetwork}
        </div>
      ) : (
        <div className={classes.connect} onClick={() => initConnectWallet(walletProps)}>
          Connect Wallet
        </div>
      )}
    </>
  );
}

export default ConnectWallet;
