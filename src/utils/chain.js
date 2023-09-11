import { CHAIN_DECIMAL_TO_HEX, EVM_CHAINS } from "../constant/chain";

const chainIdToParams = {
  137: {
    chainId: "0x89",
    chainName: "Polygon Matic",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
    iconUrls: [""],
  },

  80001: {
    chainId: "0x13881",
    chainName: "Polygon Testnet",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    iconUrls: [""],
  },
  43113: {
    chainId: "0Xa869",
    chainName: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
    iconUrls: [""],
  },
  43114: {
    chainId: "0xa86a",
    chainName: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
    iconUrls: [""],
  },
};

const chainNameToParams = {
  polygon: {
    chainId: "0x89",
    chainName: "Polygon Matic",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-rpc.com/"],
    blockExplorerUrls: ["https://www.polygonscan.com/"],
    iconUrls: [""],
  },

  "polygon-testnet": {
    chainId: "0x13881",
    chainName: "Polygon Testnet",
    nativeCurrency: { name: "Matic", symbol: "MATIC", decimals: 18 },
    rpcUrls: ["https://polygon-mumbai.g.alchemy.com/v2/sjbvWTjbyKXxvfJ1HkHIdEDHc2u8wNym"],
    blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
    iconUrls: [""],
  },
  avalanche: {
    chainId: "0Xa869",
    chainName: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax-test.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://testnet.snowtrace.io/"],
    iconUrls: [""],
  },
  "avalanche-testnet": {
    chainId: "0xa86a",
    chainName: "Avalanche",
    nativeCurrency: { name: "Avalanche", symbol: "AVAX", decimals: 18 },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io/"],
    iconUrls: [""],
  },
};

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

const switchChain = async (chainId) => {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: CHAIN_DECIMAL_TO_HEX[chainId],
        },
      ],
    });

    return null;
  } catch (error) {
    console.log("switch error: ", error);
    return error;
  }
};

const addChain = async (chainId) => {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [chainIdToParams[chainId]],
    });
    return null;
  } catch (error) {
    console.log("add error: ", error);
    return error;
  }
};

export { getChainFromName, getChainExplorerLink, chainIdToParams, chainNameToParams, switchChain, addChain };
