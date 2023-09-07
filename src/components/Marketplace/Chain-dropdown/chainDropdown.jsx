/* eslint-disable react/no-array-index-key */
/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import allChainsIcon from "../../../assets/all-chains.svg";
import avalancheIcon from "../../../assets/icon-avalanche.svg";
import { ReactComponent as DropdownIcon } from "../../../assets/icon-chevron-down.svg";
import polygonIcon from "../../../assets/icon-polygon.svg";
import { GenContext } from "../../../gen-state/gen.context";
import { orderedChainsList } from "../../../utils/supportedChains";
import classes from "./chainDropdown.module.css";

const chainIcon = {
  polygon: polygonIcon,
  avalanche: avalancheIcon,
};

const ChainDropdown = ({ onChainFilter, data }) => {
  const [state, setState] = useState({
    toggleChainFilter: false,
    chain: "All Chains",
    inContainer: false,
  });
  const location = useLocation();
  const { mainnet } = useContext(GenContext);
  const { toggleChainFilter, chain, inContainer } = state;

  const handleSetState = (payload) => {
    setState((states) => ({ ...states, ...payload }));
  };

  const wrapperRef = useRef(null);
  const hanldeClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      handleSetState({ toggleChainFilter: false });
    }
  };

  useEffect(() => {
    if (inContainer) {
      document.addEventListener("click", hanldeClickOutside, true);
      return () => document.removeEventListener("click", hanldeClickOutside, true);
    }
  }, [inContainer]);

  useEffect(() => {
    const { search } = location;
    const name = new URLSearchParams(search).get("chain");
    if (name) {
      handleSetState({ chain: name });
    }
  }, []);

  useEffect(() => {
    if (data) {
      onChainFilter(chain);
    }
  }, [data]);

  const chainHandler = (name) => {
    onChainFilter(name);
    handleSetState({ chain: name, toggleChainFilter: false });
  };
  return (
    <div className={classes.chainDropdown} ref={wrapperRef}>
      <div
        onClick={() => handleSetState({ toggleChainFilter: !toggleChainFilter, inContainer: true })}
        className={classes.selectedChain}
      >
        <div>
          {chainIcon[chain.toLowerCase()] ? (
            <img className={classes.chainImg} src={chainIcon[chain.toLowerCase()]} alt={chain} />
          ) : (
            <img className={classes.chainImg} src={allChainsIcon} alt={chain} />
          )}
          <span className={classes.chainName}>{chain}</span>
        </div>
        <DropdownIcon className={`${classes.dropdownIcon} ${toggleChainFilter && classes.active}`} />
      </div>
      <div className={`${classes.dropdown} ${toggleChainFilter && classes.active}`}>
        {[
          <div key={0} onClick={() => chainHandler("All Chains")} className={classes.chain}>
            <img src={allChainsIcon} alt="All Chains" /> <span>All Chains</span>
          </div>,
          orderedChainsList
            .filter((_chain) => mainnet === _chain.isMainnet)
            .map((_chain, idx) => (
              <div
                key={idx + 1}
                onClick={() => {
                  !_chain.comingSoon ? chainHandler(_chain.chain) : {};
                }}
                className={`${classes.chain} ${_chain.comingSoon && classes.inActive}`}
              >
                {_chain.icon ? <img src={_chain.icon} alt={_chain.chain} /> : <p />} <div>{_chain.chain}</div>
              </div>
            )),
        ]}
      </div>
    </div>
  );
};

export default ChainDropdown;
