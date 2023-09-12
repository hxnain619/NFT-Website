import { addChain, switchChain } from "./chain";

// Chain Icons
import avaxChainIcon from "../assets/chainIcons/AVAX.svg";
import polygonChainIcon from "../assets/chainIcons/MATIC.svg";
import etherChainIcon from "../assets/chainIcons/ETH.svg";

const supportedChains = {
  80001: {
    id: "matic-network",
    label: "Polygon Testnet",
    chain: "Polygon",
    icon: polygonChainIcon,
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com/",
    networkId: 80001,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  137: {
    id: "matic-network",
    label: "Polygon",
    chain: "Polygon",
    explorer: "https://polygonscan.com/",
    icon: polygonChainIcon,
    symbol: "MATIC",
    networkId: 137,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  43114: {
    id: "avalanche",
    label: "Avalanche",
    chain: "Avalanche",
    icon: avaxChainIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43114,
    explorer: "https://snowtrace.io/",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
    bgColor: "#E13F40",
    color: "#FFFFFF",
  },
  43113: {
    id: "avalanche",
    label: "Avalanche Testnet",
    chain: "Avalanche",
    icon: avaxChainIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43113,
    explorer: "https://testnet.snowtrace.io/",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
  },
  1: {
    id: "ethereum",
    label: "Ethereum",
    chain: "Ethereum",
    icon: etherChainIcon,
    symbol: "ETH",
    networkId: 1,
    explorer: "https://etherscan.io/",
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },

  5: {
    id: "ethereum-testnet",
    label: "Goerli",
    chain: "Ethereum",
    icon: etherChainIcon,
    symbol: "ETH",
    networkId: 5,
    explorer: "https://goerli.etherscan.io/",
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "ethereum",
  },
  0: {
    id: "invalid",
    label: "invalid",
    chain: "invalid",
    icon: avaxChainIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "invalid",
    networkId: 0,
    explorer: "https://testnet.snowtrace.io/",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "invalid",
  },
};

export const orderedChainsList = [
  {
    id: "matic-network",
    label: "Polygon ",
    chain: "Polygon",
    icon: polygonChainIcon,
    symbol: "MATIC",
    explorer: "https://mumbai.polygonscan.com/address",
    networkId: 80001,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  {
    id: "matic-network",
    label: "Polygon",
    chain: "Polygon",
    explorer: "https://polygonscan.com/address",
    icon: polygonChainIcon,
    symbol: "MATIC",
    networkId: 137,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "matic-network",
  },
  {
    id: "avalanche",
    label: "Avalanche",
    chain: "Avalanche",
    icon: avaxChainIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43114,
    explorer: "https://snowtrace.io/",
    add: addChain,
    isMainnet: true,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
  },
  {
    id: "avalanche",
    label: "Avalanche ",
    chain: "Avalanche",
    icon: avaxChainIcon,
    livePrice: "https://api.coingecko.com/api/v3/simple/price?ids=avalanche-2&vs_currencies=usd",
    symbol: "AVAX",
    networkId: 43113,
    explorer: "https://testnet.snowtrace.io/",
    add: addChain,
    isMainnet: false,
    switch: switchChain,
    coinGeckoLabel: "avalanche-2",
  },
];

export default supportedChains;
