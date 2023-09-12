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

const getClientByChainName = (chainName) => {
  const chain = getChainFromName(chainName);
  return getClientByChain(chain);
};

export { getClientByChainName, getClientByChain };
