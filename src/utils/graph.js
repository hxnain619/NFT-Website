import { EVM_CHAINS } from "../constant/chain";
import { getChainFromName } from "./chain";
import { avalancheClient, ethClient, polygonClient } from "./graphqlClient";

const clientByChain = (chain) => {
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

const clientByChainName = (chainName) => {
  const chain = getChainFromName(chainName);
  return clientByChain(chain);
};

export { clientByChainName, clientByChain };
