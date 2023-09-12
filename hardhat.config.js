/* hardhat.config.js */
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@openzeppelin/hardhat-upgrades");

console.log("Network Configuration Loaded");

module.exports = {
  defaultNetwork: "polygon-testnet",
  networks: {
    "polygon-testnet": {
      url: "https://polygon-mumbai-bor.publicnode.com	",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    "avax-testnet": {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    "eth-testnet": {
      url: "https://ethereum-goerli.publicnode.com",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    "polygon-mainnet": {
      url: "https://rpc-mainnet.maticvigil.com",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    "avax-mainnet": {
      url: "https://avalanche-c-chain.publicnode.com",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
    "eth-mainnet": {
      url: "wss://mainnet.gateway.tenderly.co	",
      accounts: [process.env.OWNER_PRIVATE_KEY],
    },
  },
  solidity: {
    version: "0.8.8",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    apiKey: process.env.POLYGON_API_KEY, // Polygon
    // apiKey: process.env.ETH_API_KEY, // Ethereum
    // apiKey: process.env.AVAX_API_KEY, // Avalance
  },
  mocha: {
    timeout: 70000,
  },
};
