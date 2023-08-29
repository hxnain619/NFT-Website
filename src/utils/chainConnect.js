/* eslint-disable no-console */
export const chainIdToParams = {
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

const chainDecimalsToHex = {
  137: "0x89",
  80001: "0x13881",
  43113: "0Xa869",
  43114: "0xa86a",
};

export async function switchChain(chainId) {
  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [
        {
          chainId: chainDecimalsToHex[chainId],
        },
      ],
    });

    return null;
  } catch (error) {
    console.log("switch error: ", error);
    return error;
  }
}

export async function addChain(chainId) {
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
}
