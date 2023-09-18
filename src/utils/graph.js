import { EVM_CHAINS } from "../constant/chain";
import { getChainFromName } from "./chain";
import { avalancheClient, ethClient, polygonClient } from "./graphqlClient";

const getClientByChain = (chain) => {
  switch (chain) {
    case EVM_CHAINS.Polygon:
      return polygonClient;
    case EVM_CHAINS.Avalanche:
      return avalancheClient;
    case EVM_CHAINS.Ethereum:
      return ethClient;
    default:
      return avalancheClient;
  }
};

const getChainNameByChain = (chain) => {
  switch (chain) {
    case EVM_CHAINS.Polygon:
      return "Polygon";
    case EVM_CHAINS.Avalanche:
      return "Avalanche";
    case EVM_CHAINS.Ethereum:
      return "Ethereum";
    default:
      return "Avalanche";
  }
};

const getClientByChainName = (chainName) => {
  const chain = getChainFromName(chainName);
  return getClientByChain(chain);
};

export { getClientByChainName, getClientByChain, getChainNameByChain };
