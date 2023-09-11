import { EVM_CHAINS } from "../constant/chain";
import { chainNameToParams } from "./chainConnect";

const getChainFromName = (chainName) => {
  if (chainName.toLowerCase().includes("polygon")) {
    return EVM_CHAINS.Polygon;
  }
  if (chainName.toLowerCase().includes("avalance")) {
    return EVM_CHAINS.Avalanche;
  }
  if (chainName.toLowerCase().includes("eth")) {
    return EVM_CHAINS.Ethereum;
  }

  return EVM_CHAINS.Ethereum;
};
const getChainExplorerLink = (chainName, isMainNet) => {
  return chainNameToParams[isMainNet ? chainName.toLowerCase() : `${chainName.toLowerCase()}-testnet`]
    .blockExplorerUrls;
};

export { getChainFromName, getChainExplorerLink };
