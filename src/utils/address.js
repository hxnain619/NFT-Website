import { EVM_CHAINS } from "../constant/chain";
import { getChainFromName } from "./chain";

require("dotenv").config();

const getSoulBoundAddress = (chainName, isMainNet) => {
  let chain = 0;
  if (typeof chainName === "string") chain = getChainFromName(chainName);
  else if (typeof chainName === "number") chain = chainName;

  switch (chain) {
    case EVM_CHAINS.Ethereum:
      return isMainNet
        ? process.env.REACT_APP_ETH_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_ETH_TESTNET_SOULBOUND_ADDRESS;
    case EVM_CHAINS.Polygon:
      return isMainNet
        ? process.env.REACT_APP_POLY_MAINNET_SOULBOUND_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_SOULBOUND_ADDRESS;
    case EVM_CHAINS.Avalanche:
      return isMainNet
        ? process.env.REACT_APP_AVAX_MAINNET_SOULDBOUND_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_SOULDBOUND_ADDRESS;
    default:
      return process.env.REACT_APP_ETH_MAINNET_SOULBOUND_ADDRESS;
  }
};

const getSingleMinterAddress = (chainName, isMainNet) => {
  let chain = 0;
  if (typeof chainName === "string") chain = getChainFromName(chainName);
  else if (typeof chainName === "number") chain = chainName;

  switch (chain) {
    case EVM_CHAINS.Polygon:
      return isMainNet
        ? process.env.REACT_APP_POLY_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_SINGLE_ADDRESS;
    case EVM_CHAINS.Ethereum:
      return isMainNet
        ? process.env.REACT_APP_ETH_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_ETH_TESTNET_SINGLE_ADDRESS;
    case EVM_CHAINS.Avalanche:
      return isMainNet
        ? process.env.REACT_APP_AVAX_MAINNET_SINGLE_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_SINGLE_ADDRESS;
    default:
      return process.env.REACT_APP_ETH_MAINNET_SINGLE_ADDRESS;
  }
};

const getMinterAddress = (chainName, isMainNet) => {
  let chain = 0;
  if (typeof chainName === "string") chain = getChainFromName(chainName);
  else if (typeof chainName === "number") chain = chainName;

  switch (chain) {
    case EVM_CHAINS.Polygon:
      return isMainNet
        ? process.env.REACT_APP_POLY_MAINNET_MINTER_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_MINTER_ADDRESS;
    case EVM_CHAINS.Ethereum:
      return isMainNet
        ? process.env.REACT_APP_ETH_MAINNET_MINTER_ADDRESS
        : process.env.REACT_APP_ETH_TESTNET_MINTER_ADDRESS;
    case EVM_CHAINS.Avalanche:
      return isMainNet
        ? process.env.REACT_APP_AVAX_MAINNET_MINTER_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_MINTER_ADDRESS;
    default:
      return process.env.REACT_APP_ETH_MAINNET_MINTER_ADDRESS;
  }
};

const getMarketAddress = (chainName, isMainNet) => {
  let chain = 0;
  if (typeof chainName === "string") chain = getChainFromName(chainName);
  else if (typeof chainName === "number") chain = chainName;

  switch (chain) {
    case EVM_CHAINS.Polygon:
      return isMainNet
        ? process.env.REACT_APP_POLY_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_POLY_TESTNET_MARKET_ADDRESS;
    case EVM_CHAINS.Ethereum:
      return isMainNet
        ? process.env.REACT_APP_ETH_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_ETH_TESTNET_MARKET_ADDRESS;
    case EVM_CHAINS.Avalanche:
      return isMainNet
        ? process.env.REACT_APP_AVAX_MAINNET_MARKET_ADDRESS
        : process.env.REACT_APP_AVAX_TESTNET_MARKET_ADDRESS;
    default:
      return process.env.REACT_APP_ETH_MAINNET_MARKET_ADDRESS;
  }
};

export { getSoulBoundAddress, getMinterAddress, getSingleMinterAddress, getMarketAddress };
