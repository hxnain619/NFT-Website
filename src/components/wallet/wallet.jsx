/* eslint-disable global-require */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-shadow */
import { ethers } from "ethers";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import bellIcon from "../../assets/bell.svg";
import copyIcon from "../../assets/icon-copy.svg";
import disconnectIcon from "../../assets/icon-disconnect.svg";
import userIcon from "../../assets/icon-user.svg";
import { GenContext } from "../../gen-state/gen.context";
import useCommon from "../../hooks/useCommon";
import supportedChains from "../../utils/supportedChains";
import WalletPopup from "../wallet-popup/walletPopup";
import classes from "./wallet.module.css";

import PrimaryButton from "../primary-button/PrimaryButton";

import {
  breakAddress,
  connectWallet,
  connectWithQRCode,
  disconnectWallet,
  getConnectedChain,
  initConnectWallet,
  initializeConnection,
  setNetworkType,
} from "./wallet-script";

import Web3 from "web3";
import { setNotification } from "../../gen-state/gen.actions";
import { chainIdToParams } from "../../utils/chain";
import { readUserProfile } from "../../utils/firebase";
import PushNotification from "../notifications/PushNotification";

function ConnectWallet() {
  const history = useHistory();
  const { pathname } = useLocation();
  const clipboardRef = useRef();
  const walletProviderRef = useRef(0);
  const { dispatch, account, chainId, proposedChain, mainnet, toggleWalletPopup } = useContext(GenContext);
  const [balance, setBalance] = useState(0);
  const [balances, setBalances] = useState({
    ETH: "0",
    MATIC: "0",
    AVAX: "0",
  });

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
    userDetails: null,
  });

  const {
    openNotification,
    network,
    walletConnectProvider,
    overrideWalletConnect,
    connectionMethod,
    rpc,
    isMetamask,
    userDetails,
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
    dispatch(
      setNotification({
        message: `Copied to clipboard.`,
        type: "success",
      })
    );
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
      const fetchBalance = async (providerUrl, account) => {
        const web3 = new Web3(new Web3.providers.HttpProvider(providerUrl));
        return await web3.eth.getBalance(account);
      };

      const formatBalance = (balance) => {
        return parseFloat(Web3.utils.fromWei(balance, "ether")).toFixed(3);
      };
      const ethBalance = formatBalance(
        await fetchBalance(mainnet ? chainIdToParams[1].rpcUrls[0] : chainIdToParams[5].rpcUrls[0], account)
      );
      const maticBalance = formatBalance(
        await fetchBalance(mainnet ? chainIdToParams[137].rpcUrls[0] : chainIdToParams[80001].rpcUrls[0], account)
      );
      const avaxBalance = formatBalance(
        await fetchBalance(mainnet ? chainIdToParams[43114].rpcUrls[0] : chainIdToParams[43113].rpcUrls[0], account)
      );

      setBalances({
        ETH: ethBalance,
        MATIC: maticBalance,
        AVAX: avaxBalance,
      });

      // Fetch account balance using Ether.js
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const balanceWei = await provider.getBalance(account); // accounts is an array, so we use [0] to access the first account
      const balanceEther = ethers.utils.formatEther(balanceWei);

      setBalance(balanceEther);

      if (account) {
        await readUserProfile(account).then((res) => {
          handleSetState({ userDetails: res });
        });
      }
    };
    if (account && account.length > 15) getAccountBalance();
  }, [account]);

  const notificationRef = useRef(null);

  const handleNotificationMenu = (isOpen) => {
    handleSetState({ openNotification: isOpen });
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        handleNotificationMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationRef, handleNotificationMenu]);

  const dropdown = (
    <div className={classes.dropdownContainer}>
      <div className={classes.dropdown}>
        <div className={classes.listView}>
          <span>
            <div className={classes.avatar}>
              <img src={getConnectedChain(chainId)} alt="user img" />
            </div>
          </span>
          <div>
            <span>{userDetails?.username ?? "User 123"}</span>
            <div
              style={{ display: "flex", margin: 0, cursor: "pointer" }}
              onClick={() => handleCopy({ navigator, clipboard: clipboardRef.current })}
            >
              <div>{account?.length > 15 ? breakAddress(account, 8) : account}</div>
              &nbsp;&nbsp;
              <img src={copyIcon} width="20px" alt="" />
            </div>
            <input style={{ display: "none" }} ref={clipboardRef} type="text" defaultValue={account} />
          </div>
        </div>
        <div onClick={handleDashboard} className={classes.option}>
          <img src={userIcon} alt="" />
          <div>My Profile</div>
        </div>
        {Object.entries(supportedChains || {}).length && (
          <div className={classes.chainsListContainer}>
            {Object.entries(supportedChains)
              .filter((val) => val[1].id !== "invalid" && val[1].isMainnet === mainnet)
              .map((val) => {
                return (
                  <div className={classes.chainList} key={val[1].networkId.toString()}>
                    <div style={{ display: "flex" }}>
                      <img width={24} src={val[1].icon} alt="" />
                      <span>
                        {balances[val[1].symbol]} {val[1].symbol}
                      </span>
                    </div>
                    <a href={val[1].explorer} target="_blank" rel="noreferrer">
                      Buy
                    </a>
                  </div>
                );
              })}
          </div>
        )}
        <div onClick={handleDisconnet} className={classes.option}>
          <img src={disconnectIcon} alt="" />
          <div>Disconnect</div>
        </div>
      </div>
    </div>
  );

  const connected = (
    <div className={classes.connectedContainer}>
      <div className={classes.balance}>
        {" "}
        {`${americanFormatNumber(balances[supportedChains[chainId]?.symbol], 3)} ${
          supportedChains[chainId]?.symbol
        }`}{" "}
      </div>
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
    <div className={classes.networkContainer} ref={notificationRef}>
      <div className={classes.notificationContent}>
        <div className={`${classes.notification} ${openNotification && classes.notiActive}`}>
          <img className={classes.nIcon} src={bellIcon} alt="" onClick={() => handleNotificationMenu(true)} />
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
        <div>
          <PrimaryButton text="Connect Wallet" onClick={() => initConnectWallet(walletProps)} />
        </div>
      )}
    </>
  );
}

export default ConnectWallet;
